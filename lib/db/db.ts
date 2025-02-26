import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
      'Please define the MONGODB_URI environment variable. Example: mongodb+srv://username:password@cluster.mongodb.net/database'
  );
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn) {
      // Test the cached connection
      try {
        // @ts-ignore
        await cached.conn.connection.db.admin().ping();
        console.log('Using cached database connection');
        return cached.conn;
      } catch (error) {
        console.log('Cached connection failed, creating new connection');
        cached.conn = null;
        cached.promise = null;
      }
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true,
        connectTimeoutMS: 30000
      };

      console.log('Connecting to MongoDB...');
      // @ts-ignore
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
      cached.conn = await cached.promise;

      // Test the connection
      // @ts-ignore
      await mongoose.connection.db.admin().ping();
      console.log('Database ping successful');
      console.log('Successfully connected to MongoDB');

      return cached.conn;
    } catch (e) {
      cached.promise = null;
      cached.conn = null;
      throw e;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Clear cached connection on error
    cached.conn = null;
    cached.promise = null;
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export default dbConnect;