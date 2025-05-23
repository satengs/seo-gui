import mongoose from 'mongoose';

interface ExtendedHistoricalEntry {
  keywordData: HistoricalKeywordDataDoc;
  organicResultsCount?: number;
  kgmid?: string;
  kgmTitle?: string;
  kgmWebsite?: string;
  backlinksNeeded?: number | null;
  difficulty?: number | null;
  volume?: number | null;
  timestamp?: string;
}

interface SearchAnalyticsDoc {
  _id: mongoose.Types.ObjectId;
  keywords?: {
    id: string;
    historicalData?: Record<string, ExtendedHistoricalEntry>;
  };
  historicalData?: Record<string, ExtendedHistoricalEntry> | null;
}

interface HistoricalKeywordDataDoc {
  id: mongoose.Types.ObjectId;
  date: string;
  keywordData: HistoricalKeywordDataDoc;
  organicResultsCount?: number;
  kgmid?: string;
  kgmTitle?: string;
  kgmWebsite?: string;
  backlinksNeeded?: number | null;
  difficulty?: number | null;
  timestamp?: string;
  volume?: number | null;
}

const SearchAnalytics =
  mongoose.connection.collection<SearchAnalyticsDoc>('keywords');
const HistoricalKeywordData =
  mongoose.connection.collection<HistoricalKeywordDataDoc>(
    'keywordHistoricalData'
  );

export const up = async () => {
  const docs = await SearchAnalytics.find({
    historicalData: { $exists: true, $ne: null },
  }).toArray();

  for (const doc of docs) {
    const { _id, historicalData } = doc;

    if (!historicalData || Object.keys(historicalData).length === 0) {
      await SearchAnalytics.updateOne(
        { _id },
        { $unset: { historicalData: '' } }
      );
      continue;
    }

    const docsToInsert: HistoricalKeywordDataDoc[] = Object.entries(
      historicalData
    ).map(([date, value]) => ({
      id: _id,
      date,
      keywordData: value.keywordData,
      organicResultsCount: value.organicResultsCount,
      kgmid: value.kgmid,
      kgmTitle: value.kgmTitle,
      kgmWebsite: value.kgmWebsite,
      backlinksNeeded: value.backlinksNeeded,
      difficulty: value.difficulty,
      volume: value.volume,
      timestamp: value.timestamp,
    }));

    if (docsToInsert.length) {
      await HistoricalKeywordData.insertMany(docsToInsert);
      console.log(`✅ Migrated ${docsToInsert.length} entries for ID: ${_id}`);
    }

    await SearchAnalytics.updateOne(
      { _id },
      { $unset: { historicalData: '' } }
    );
  }

  console.log('🎉 Historical data migration complete');
};

export const down = async () => {
  const allDocs = await HistoricalKeywordData.find({}).toArray();

  const groupedMap = new Map<
    string,
    Record<string, { keywordData: HistoricalKeywordDataDoc }>
  >();

  for (const doc of allDocs) {
    const { id, date, keywordData } = doc;
    const key = id.toString();

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {});
    }

    groupedMap.get(key)![date] = {
      keywordData: keywordData,
      organicResultsCount: doc.organicResultsCount,
      kgmid: doc.kgmid,
      kgmTitle: doc.kgmTitle,
      kgmWebsite: doc.kgmWebsite,
      backlinksNeeded: doc.backlinksNeeded,
      difficulty: doc.difficulty,
      volume: doc.volume,
      timestamp: doc.timestamp,
    } as ExtendedHistoricalEntry;
  }

  for (const [id, historicalData] of groupedMap.entries()) {
    await SearchAnalytics.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { historicalData } }
    );
  }

  await HistoricalKeywordData.deleteMany({});
  console.log('🗑️ Reverted historical data migration');
};
