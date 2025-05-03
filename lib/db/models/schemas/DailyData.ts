import mongoose from 'mongoose';

export const DynamicData = new mongoose.Schema({
  id: {
    type: Number,
    autoIncrement: true,
  },
  data: {
    type: Object,
  },
});

export const DailyData = new mongoose.Schema(
  {
    organicResultsCount: {
      type: Number,
    },
    kgmid: {
      type: String,
    },
    kgmTitle: {
      type: String,
    },
    kgmWebsite: {
      type: String,
    },
    difficulty: {
      type: Number,
    },
    volume: {
      type: Number,
    },
    backlinksNeeded: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    keywordData: DynamicData,
  },
  { _id: false }
); // Disable _id for subdocuments
