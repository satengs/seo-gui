import mongoose from 'mongoose';

interface KeywordData {
  volume: number | null;
  difficulty: number | null;
}

interface ExtendedHistoricalEntry {
  keywordData: {
    data: KeywordData;
  };
  organicResultsCount?: number;
  kgmid?: string;
  kgmTitle?: string;
  kgmWebsite?: string;
  backlinksNeeded?: number | null;
  timestamp?: string;
}

interface SearchAnalyticsDoc {
  _id: mongoose.Types.ObjectId;
  keywords: {
    id: string;
    historicalData?: Record<string, ExtendedHistoricalEntry>;
  };
}

interface HistoricalKeywordDataDoc {
  id: string;
  date: string;
  keywordData: KeywordData;
  organicResultsCount?: number;
  kgmid?: string;
  kgmTitle?: string;
  kgmWebsite?: string;
  backlinksNeeded?: number | null;
  difficulty?: number | null;
  timestamp?: string;
  volume?: number | null;
}

const SearchAnalytics = mongoose.connection.collection<SearchAnalyticsDoc>('keywords');
const HistoricalKeywordData = mongoose.connection.collection<HistoricalKeywordDataDoc>('keywordHistoricalData');


export const up = async () => {
  const docs = await SearchAnalytics.find({ historicalData: { $exists: true, $ne: null } }).toArray();

  for (const doc of docs) {
    const { _id, historicalData } = doc;

    if (!historicalData || Object.keys(historicalData).length === 0) {
      await SearchAnalytics.updateOne({ _id }, { $unset: { historicalData: "" } });
      continue;
    }

    const docsToInsert: HistoricalKeywordDataDoc[] = Object.entries(historicalData).map(
      ([date, value]) => ({
        id: _id,
        date,
        keywordData: value.keywordData.data,
        organicResultsCount: value.organicResultsCount,
        kgmid: value.kgmid,
        kgmTitle: value.kgmTitle,
        kgmWebsite: value.kgmWebsite,
        backlinksNeeded: value.backlinksNeeded,
        difficulty:value.difficulty,
        volume: value.volume,
        timestamp: value.timestamp,
      })
    );


    if (docsToInsert.length) {
      await HistoricalKeywordData.insertMany(docsToInsert);
      console.log(`✅ Migrated ${docsToInsert.length} entries for ID: ${_id}`);
    }

    await SearchAnalytics.updateOne({ _id }, { $unset: { historicalData: "" } });
  }

  console.log('🎉 Historical data migration complete');
};

export const down = async () => {
  const allDocs = await HistoricalKeywordData.find({}).toArray();

  const groupedMap = new Map<
    string,
    Record<string, { keywordData: { data: KeywordData } }>
    >();

  for (const doc of allDocs) {
    const { id, date, keywordData } = doc;
    const key = id.toString(); // use _id string as map key

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {});
    }

    groupedMap.get(key)![date] = {
      keywordData: { data: keywordData },
      organicResultsCount: doc.organicResultsCount,
      kgmid: doc.kgmid,
      kgmTitle: doc.kgmTitle,
      kgmWebsite: doc.kgmWebsite,
      backlinksNeeded: doc.backlinksNeeded,
      difficulty:doc.difficulty,
      volume: doc.volume,
      timestamp: doc.timestamp,
    };

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


