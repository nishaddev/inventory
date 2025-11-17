import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('inventorydb')
    
    const includeArchived = request.nextUrl.searchParams.get('archived') === 'true'
    const query = includeArchived ? {} : { isArchived: { $ne: true } }
    
    const products = await db.collection('products').find(query).toArray()
    return NextResponse.json(products)
  } catch (error) {
    // Return empty array if MongoDB is not available
    if (error instanceof Error && error.message === 'MongoDB URI not configured') {
      return NextResponse.json([])
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('inventorydb')

    const result = await db.collection('products').insertOne({
      ...body,
      createdAt: new Date(),
      isArchived: false,
    })

    return NextResponse.json({
      _id: result.insertedId,
      ...body,
    })
  } catch (error) {
    // Return error if MongoDB is not available
    if (error instanceof Error && error.message === 'MongoDB URI not configured') {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}