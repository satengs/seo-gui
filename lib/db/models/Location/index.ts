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
    //Country code
    //shorten name  (like tags)
  },
  { timestamps: true }
);

export default mongoose.models.Location ||
  mongoose.model('Location', locationSchema);
