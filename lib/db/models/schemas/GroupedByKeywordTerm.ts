import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupedByKeywordTerm extends Document {
  keywordId: mongoose.Types.ObjectId;
  keywordTerm: string;
  termGroup: string;
  device: string;
  location: string;
  createdAt: Date;
}

const GroupedByKeywordTermSchema: Schema<IGroupedByKeywordTerm> = new Schema({
  keywordId: { type: Schema.Types.ObjectId, required: true, ref: 'Keyword' },
  keywordTerm: { type: String, required: true },
  termGroup: { type: String, required: true, index: true },
  device: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

GroupedByKeywordTermSchema.index({ termGroup: 1 });
GroupedByKeywordTermSchema.index({ keywordId: 1 });

const GroupedByKeywordTerm: Model<IGroupedByKeywordTerm> =
  mongoose.models.GroupedByKeywordTerm ||
  mongoose.model<IGroupedByKeywordTerm>(
    'GroupedByKeywordTerm',
    GroupedByKeywordTermSchema
  );

export default GroupedByKeywordTerm;
