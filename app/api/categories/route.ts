import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('inventorydb')
    const categories = await db.collection('categories').find({}).toArray()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('inventorydb')

    const result = await db.collection('categories').insertOne({
      name: body.name,
      color: body.color,
      icon: body.icon,
      createdAt: new Date(),
    })

    return NextResponse.json({
      _id: result.insertedId,
      ...body,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
