import dbConnect from '../index';
import KeywordHistoricalData from '../models/schemas/KeywordHistoricalData';
import mongoose from 'mongoose';

export async function up() {
  await dbConnect();
  console.log(
    'Starting migration: Wrapping keywordData in {_id, data: ...} structure'
  );

  const historicalData = await KeywordHistoricalData.find({});
  console.log(
    `Found ${historicalData.length} historical data entries to update`
  );

  let updatedCount = 0;
  for (const entry of historicalData) {
    // Only update if keywordData is not already wrapped
    if (entry.keywordData && !entry.keywordData.data) {
      await KeywordHistoricalData.updateOne(
        { _id: entry._id },
        {
          $set: {
            keywordData: {
              _id: new mongoose.Types.ObjectId(),
              data: entry.keywordData,
            },
          },
        }
      );
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} documents`);
  console.log('Migration completed successfully');
}

export async function down() {
  await dbConnect();
  console.log(
    'Reverting migration: Unwrapping keywordData from {_id, data: ...} structure'
  );

  const historicalData = await KeywordHistoricalData.find({});
  console.log(
    `Found ${historicalData.length} historical data entries to revert`
  );

  let revertedCount = 0;
  for (const entry of historicalData) {
    // Only revert if keywordData is wrapped
    if (entry.keywordData && entry.keywordData.data) {
      await KeywordHistoricalData.updateOne(
        { _id: entry._id },
        { $set: { keywordData: entry.keywordData.data } }
      );
      revertedCount++;
    }
  }

  console.log(`Successfully reverted ${revertedCount} documents`);
  console.log('Down migration completed successfully');
}
