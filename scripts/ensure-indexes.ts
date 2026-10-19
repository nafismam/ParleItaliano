import { connectDatabase, disconnectDatabase, ensureIndexes } from '@parle/database';
try {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await connectDatabase(process.env.MONGODB_URI);
  await ensureIndexes();
  console.log('Database indexes verified');
} finally {
  await disconnectDatabase();
}
