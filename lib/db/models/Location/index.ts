import * as mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    longitude: {
      type: Number,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Location ||
  mongoose.model('Location', locationSchema);
