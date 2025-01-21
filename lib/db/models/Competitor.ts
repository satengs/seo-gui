import mongoose from 'mongoose';

const CompetitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Competitor ||
  mongoose.model('Competitor', CompetitorSchema);
