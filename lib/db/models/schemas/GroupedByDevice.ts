import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupedByDevice extends Document {
  keywordId: mongoose.Types.ObjectId;
  keywordTerm: string;
  deviceGroup: string;
  location: string;
  createdAt: Date;
}

const GroupedByDeviceSchema: Schema<IGroupedByDevice> = new Schema({
  keywordId: { type: Schema.Types.ObjectId, required: true, ref: 'Keyword' },
  keywordTerm: { type: String, required: true },
  deviceGroup: { type: String, required: true, index: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

GroupedByDeviceSchema.index({ deviceGroup: 1 });
GroupedByDeviceSchema.index({ keywordId: 1 });

const GroupedByDevice: Model<IGroupedByDevice> =
  mongoose.models.GroupedByDevice ||
  mongoose.model<IGroupedByDevice>('GroupedByDevice', GroupedByDeviceSchema);

export default GroupedByDevice;
