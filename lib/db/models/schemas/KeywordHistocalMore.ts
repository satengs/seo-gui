import mongoose from 'mongoose';

const HistoricalMoreSchema = new mongoose.Schema({
  id: {
    type: Number,
    autoIncrement: true,
  },
  data: {
    type: Object,
  },
});

const KeywordHistoricalMoreSchema = new mongoose.Schema(
  {
    keywordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Keyword',
      required: true,
    },
    historicalMore: HistoricalMoreSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.KeywordHistoricalMore ||
mongoose.model('KeywordHistoricalMore', KeywordHistoricalMoreSchema);
