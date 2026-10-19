import { connectDatabase, ensureIndexes, Topic, disconnectDatabase } from '@parle/database';
import { grammarCatalog } from '@parle/database/catalog';

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required to seed the grammar catalog.');
  await connectDatabase(uri);
  try {
    await ensureIndexes();
    for (const topic of grammarCatalog) {
      const result = await Topic.updateOne(
        { slug: topic.slug },
        { $set: topic },
        { upsert: true, runValidators: true, strict: 'throw' },
      );
      console.log(
        `${result.upsertedCount ? 'Created' : 'Updated'} ${topic.slug} (${topic.exercises.length} exercises)`,
      );
    }
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((error) => {
  console.error('Grammar seed failed.', {
    kind: error instanceof Error ? error.name : 'UnknownError',
  });
  process.exitCode = 1;
});
