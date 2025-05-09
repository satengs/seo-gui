import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleGraphEntity extends Document {
  keywordId: string;
  term: string;
  createdAt: Date;
  data: any;
}

const GoogleGraphEntitySchema: Schema = new Schema({
  keywordId: { type: String, required: true },
  term: { type: String, required: true },
  createdAt: { type: Date, required: true },
  data: { type: Schema.Types.Mixed, required: false },
});

export default mongoose.models.GoogleGraphData ||
  mongoose.model<IGoogleGraphEntity>('GoogleGraphData', GoogleGraphEntitySchema, 'googleGraphData');
