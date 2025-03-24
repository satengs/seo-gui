import mongoose, { Document } from 'mongoose';
import dbConnect from '../index';
import Keyword from '../models/Keyword/Keyword';

interface IKeywordDoc extends Document {
  organicResultsHistoricalData: Map<string, { id: number; data: any }>;
}

async function addOrganicResultsHistoricalDataKeyword() {
  try {
    await dbConnect();
    const keywords: IKeywordDoc[] = await Keyword.find({});
    for (const keyword of keywords) {
      if (!keyword.organicResultsHistoricalData) {
        keyword.organicResultsHistoricalData = new Map();
        await keyword.save();
      }
    }
    console.log(
      'Add organic results historical data into keyword migration is done'
    );
  } catch (err) {
    console.log(
      'Add organic results historical data into keyword migration is failed'
    );
  } finally {
    await mongoose.connection.close();
  }
}

addOrganicResultsHistoricalDataKeyword();
