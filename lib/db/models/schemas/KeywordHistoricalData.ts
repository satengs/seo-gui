import mongoose from 'mongoose';
import { DynamicData } from './DailyData';

const KeywordHistoricalDataSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Keyword',
      required: true,
    },
    date: { type: String, required: true },
    keywordData: DynamicData,
    organicResultsCount: { type: Number },
    kgmid: { type: String },
    kgmTitle: { type: String },
    kgmWebsite: { type: String },
    backlinksNeeded: { type: Number, default: null },
    difficulty: { type: Number, default: null },
    volume: { type: Number, default: null },
    timestamp: { type: Date, required: true },
  },
  { collection: 'keywordHistoricalData' }
);

KeywordHistoricalDataSchema.index({ id: 1, date: 1 }, { unique: true });

export default mongoose.models.KeywordHistoricalData ||
  mongoose.model('KeywordHistoricalData', KeywordHistoricalDataSchema);
