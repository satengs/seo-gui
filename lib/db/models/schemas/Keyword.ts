import mongoose from 'mongoose';
import { DailyData, DynamicData } from './DailyData';

const KeywordSchema = new mongoose.Schema(
  {
    // Core fields from original schema
    term: {
      type: String,
      required: true,
    },
    kgmid: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
      enum: ['desktop', 'mobile', 'tablet'],
    },
    // Unique identifier combining term, device, and location
    keywordTerm: {
      type: String,
      // unique: true,
    },
    kgmTitle: {
      type: String,
    },
    kgmWebsite: {
      type: String,
    },
    organicResultsCount: {
      type: Number,
    },
    isDefaultKeywords: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Historical data stored by date
    historicalData: {
      type: Map,
      of: DailyData,
      default: new Map(),
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    keywordData: DynamicData,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate keyword_term
KeywordSchema.pre('save', function (next) {
  this.keywordTerm =
    `${this.term}_${this.device}_${this.location}`.toLowerCase();
  next();
});

// Helper method to add daily data
KeywordSchema.methods.addDailyData = async function (date: string, data: any) {
  if (!this.historicalData) {
    this.historicalData = new Map();
  }
  this.historicalData.set(date, data);
  return this.save();
};

// Helper method to get historical data for a date range
KeywordSchema.methods.getHistoricalData = function (
  startDate: string,
  endDate: string
) {
  const result = new Map();
  for (const [date, data] of this.historicalData) {
    if (date >= startDate && date <= endDate) {
      result.set(date, data);
    }
  }
  return result;
};

// Create compound index for uniqueness
KeywordSchema.index({ term: 1, device: 1, location: 1 }, { unique: true });

export default mongoose.models.Keyword ||
  mongoose.model('Keyword', KeywordSchema);
