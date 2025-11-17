# MongoDB Setup Guide for Inventory Management System

## Overview
This inventory management system currently uses localStorage (browser storage) for data persistence. To migrate to MongoDB for production use, follow these steps.

## Prerequisites
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Node.js and npm installed
- Vercel account (optional, for deployment)

## Step 1: Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project (e.g., "InventoryPro")
4. Create a cluster:
   - Choose "M0 Sandbox" (free tier)
   - Select your preferred region
   - Click "Create Cluster"
5. Wait for cluster creation (2-3 minutes)

## Step 2: Create Database and Collections

Once cluster is created:

1. Click "Collections" tab
2. Click "Create Database"
3. Database name: `inventorydb`
4. Create the following collections by clicking "Create Collection":

### Collections to Create:
\`\`\`
inventorydb
├── products
├── sales
├── warehouses
├── categories
├── inventory_transactions
└── restock_orders
\`\`\`

## Step 3: Add Connection String

1. In MongoDB Atlas, click "Connect" button
2. Choose "Drivers" option
3. Select "Node.js" as driver
4. Copy the connection string
5. Add to your `.env.local` file:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventorydb?retryWrites=true&w=majority
\`\`\`

## Step 4: Install MongoDB Driver

\`\`\`bash
npm install mongodb
\`\`\`

## Step 5: Create MongoDB Connection Service

Create `lib/mongodb.ts`:

\`\`\`typescript
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please add MONGODB_URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
\`\`\`

## Step 6: Create API Routes for Data Operations

Create these files:
- `app/api/products/route.ts` - GET/POST products
- `app/api/sales/route.ts` - GET/POST sales
- `app/api/warehouses/route.ts` - GET/POST warehouses
- `app/api/categories/route.ts` - GET/POST categories

Example structure provided in this project.

## Data Structure

### Products Collection
\`\`\`json
{
  "_id": ObjectId,
  "name": "USB-C Fast Charger",
  "categoryId": "1",
  "warehouseId": "WH-001",
  "sku": "UFC-65W-001",
  "barcode": "BAR001",
  "purchasePrice": 15,
  "wholesalePrice": 22,
  "retailPrice": 35,
  "quantity": 145,
  "unit": "Piece",
  "date": "2024-11-15",
  "reorderLevel": 50,
  "costOfGoodsSold": 1500,
  "unitsSold": 100,
  "lastRestockDate": "2024-11-10",
  "isArchived": false
}
\`\`\`

### Sales Collection
\`\`\`json
{
  "_id": ObjectId,
  "invoiceNo": "INV-20241116-001",
  "date": "2024-11-16 14:30",
  "productId": "1",
  "customer": "Ali Khan",
  "saleType": "retail",
  "quantity": 2,
  "unitPrice": 35,
  "totalAmount": 70,
  "paymentMethod": "cash",
  "paymentStatus": "paid",
  "warehouseId": "WH-001",
  "isArchived": false
}
\`\`\`

### Categories Collection
\`\`\`json
{
  "_id": ObjectId,
  "name": "Chargers & Cables",
  "color": "#3B82F6",
  "icon": "Zap"
}
\`\`\`

### Warehouses Collection
\`\`\`json
{
  "_id": ObjectId,
  "name": "Main Store",
  "code": "MS-001",
  "location": "Downtown",
  "address": "123 Mobile Plaza, Tech City",
  "manager": "Ahmed Hassan",
  "phone": "+1-555-0101",
  "email": "ahmed@store.com",
  "capacity": 5000,
  "used": 3245,
  "isArchived": false
}
\`\`\`

## Step 7: Update Data Service to Use MongoDB

Replace localStorage functions in `lib/data-service.ts` with MongoDB calls:

\`\`\`typescript
// Example: Instead of localStorage
export async function getProducts() {
  const client = await mongoClient
  const db = client.db('inventorydb')
  return db.collection('products').find().toArray()
}
\`\`\`

## Step 8: Migrate Existing Data (Optional)

To import your existing localStorage data to MongoDB:

1. Export localStorage data as JSON
2. Use MongoDB Compass (GUI tool) to import the JSON
3. Or use mongoimport CLI tool

## Security Considerations

1. **Network Access**: In MongoDB Atlas, go to "Security" → "Network Access"
   - Add your server IP or 0.0.0.0 (if behind Vercel)
   - For production, use specific IPs only

2. **Database Access**: Create a database user with limited permissions:
   - Go to "Security" → "Database Access"
   - Create a user with role: "Read and write to any database"
   - Use this username in your connection string

3. **Environment Variables**: Never commit `.env.local` to git
   - Add to `.gitignore`
   - Set in Vercel dashboard under Project Settings → Environment Variables

## Deployment to Vercel

1. Push code to GitHub
2. Go to Vercel dashboard
3. Import your project
4. Add `MONGODB_URI` in Environment Variables
5. Deploy

## Switching Between localStorage and MongoDB

You can keep both implementations and switch via environment variable:

\`\`\`typescript
const useDatabase = process.env.NEXT_PUBLIC_USE_DB === 'mongodb'

export function getProducts() {
  if (useDatabase) {
    return fetchFromMongoDB('/api/products')
  } else {
    return getProductsFromLocalStorage()
  }
}
\`\`\`

## Troubleshooting

**Connection Error**: "ECONNREFUSED"
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure database user credentials are correct

**Slow Queries**: Add indexes
\`\`\`
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ warehouseId: 1 })
db.sales.createIndex({ date: -1 })
\`\`\`

**Memory Issues**: Use pagination and filtering on large collections

## Support
For MongoDB help: https://docs.mongodb.com/
For Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
