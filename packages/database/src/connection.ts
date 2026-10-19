import mongoose from 'mongoose';

type ConnectionCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
};
const globalDatabase = globalThis as typeof globalThis & { parleDatabase?: ConnectionCache };
const cache = (globalDatabase.parleDatabase ??= { connection: null, promise: null, uri: null });
export async function connectDatabase(uri: string): Promise<typeof mongoose> {
  if (cache.uri && cache.uri !== uri)
    throw new Error('Database connection cannot switch destinations in one process');
  if (cache.connection && mongoose.connection.readyState === 1) return cache.connection;
  cache.uri = uri;
  cache.promise ??= mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    bufferCommands: false,
    autoIndex: false,
  });
  try {
    cache.connection = await cache.promise;
    cache.promise = null;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    cache.connection = null;
    throw error;
  }
}
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  cache.connection = null;
  cache.promise = null;
  cache.uri = null;
}
