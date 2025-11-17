import { MongoClient } from 'mongodb'

// Only initialize the URI if we're not in a build environment
const uri = process.env.MONGODB_URI || ''

if (!uri && process.env.NODE_ENV !== 'production') {
  throw new Error('Please add your Mongo URI to .env.local')
}

const options = {
  maxPoolSize: 10,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Only create the client if we have a URI
if (uri) {
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
} else {
  // Return a rejected promise if no URI is available
  clientPromise = Promise.reject(new Error('MongoDB URI not configured'))
}

export default clientPromise