import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleGraph extends Document {
  keywordId: string;
  term: string;
  createdAt: Date;
  data: any;
}

const GoogleGraphSchema: Schema = new Schema(
  {
    keywordId: { type: String, required: true },
    term: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    data: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
GoogleGraphSchema.index({ keywordId: 1, createdAt: -1 });
GoogleGraphSchema.index({ term: 1, createdAt: -1 });
GoogleGraphSchema.index({ createdAt: -1 });

const GoogleGraphData =
  mongoose.models.GoogleGraphData ||
  mongoose.model<IGoogleGraph>(
    'GoogleGraphData',
    GoogleGraphSchema,
    'googleGraphData'
  );

export default GoogleGraphData;
