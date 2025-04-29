import mongoose from 'mongoose';

const KeywordHistoricalDataSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keyword',
    required: true,
  },
  date: { type: String, required: true },
  keywordData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  organicResultsCount: { type: Number },
  kgmid: { type: String },
  kgmTitle: { type: String },
  kgmWebsite: { type: String },
  backlinksNeeded: { type: Number, default: null },
  difficulty: { type: Number, default: null },
  volume: { type: Number, default: null },
  timestamp: { type: Date, required: true },
}, { collection: 'keywordHistoricalData' });

export default mongoose.models.KeywordHistoricalData ||
mongoose.model('KeywordHistoricalData', KeywordHistoricalDataSchema);
