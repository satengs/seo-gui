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
    timestamps: true, // This option will add both createdAt and updatedAt fields automatically
  }
);

export default mongoose.models.Keyword ||
  mongoose.model('Keyword', KeywordSchema);
