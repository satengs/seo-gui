import mongoose from 'mongoose';

const KeywordHistoricalDataSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  keywordData: {
    volume: { type: Number, default: null },
    difficulty: { type: Number, default: null },
  },
  organicResultsCount: { type: Number },
  kgmid: { type: String },
  kgmTitle: { type: String },
  kgmWebsite: { type: String },
  backlinksNeeded: { type: Number, default: null },
  difficulty: { type: Number, default: null },
  volume: { type: Number, default: null },
  timestamp: { type: String },
}, { collection: 'keywordHistoricalData' }); // <--- ADD THIS


export default mongoose.models.KeywordHistoricalData || mongoose.model('KeywordHistoricalData', KeywordHistoricalDataSchema);
