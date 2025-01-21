import mongoose from 'mongoose';

const DailyRunSchema = new mongoose.Schema({
  keyword: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keyword',
    required: true,
  },
  ranking: {
    type: Number,
    required: true,
  },
  impressions: {
    type: Number,
    required: true,
  },
  ctr: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DailyRun ||
  mongoose.model('DailyRun', DailyRunSchema);
