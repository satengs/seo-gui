import mongoose from 'mongoose';

const DynamicData = new mongoose.Schema({
  id: {
    type: Number,
    autoIncrement: true,
  },
  data: {
    type: Object,
  },
});

const KeywordSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
    },
    kgmid: {
      type: String,
    },
    location: {
      type: String,
    },
    device: {
      type: String,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    dynamicData: DynamicData,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Keyword ||
  mongoose.model('Keyword', KeywordSchema);
