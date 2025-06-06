import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupedByLocation extends Document {
  keywordId: mongoose.Types.ObjectId;
  keywordTerm: string;
  device: string;
  locationGroup: string;
  createdAt: Date;
}

const GroupedByLocationSchema: Schema<IGroupedByLocation> = new Schema({
  keywordId: { type: Schema.Types.ObjectId, required: true, ref: 'Keyword' },
  keywordTerm: { type: String, required: true },
  device: { type: String },
  locationGroup: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

GroupedByLocationSchema.index({ locationGroup: 1 });
GroupedByLocationSchema.index({ keywordId: 1 });

const GroupedByLocation: Model<IGroupedByLocation> =
  mongoose.models.GroupedByLocation ||
  mongoose.model<IGroupedByLocation>(
    'GroupedByLocation',
    GroupedByLocationSchema
  );

export default GroupedByLocation;
