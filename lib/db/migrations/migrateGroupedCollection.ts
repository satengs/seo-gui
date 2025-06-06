import mongoose from 'mongoose';
import Keyword from '../models/schemas/Keyword';
import GroupedByKeywordTerm from '@/lib/db/models/schemas/GroupedByKeywordTerm';
import GroupedByLocation from '@/lib/db/models/schemas/GroupedByLocation';
import GroupedByDevice from '@/lib/db/models/schemas/GroupedByDevice';

async function migrate() {
  await mongoose.connect('mongodb://localhost:27017/seo-dashboard');
  console.log('connected to db!');
  const keywords = await Keyword.find({});
  console.log('Fetched keywords count ', keywords.length);

  const locationEntries = [];
  const deviceEntries = [];
  const keywordTermEntries = [];

  for (const kw of keywords) {
    locationEntries.push({
      insertOne: {
        document: {
          keywordId: kw._id,
          keywordTerm: kw.term,
          device: kw.device,
          locationGroup: kw.location,
          createdAt: kw.createdAt,
        },
      },
    });
    deviceEntries.push({
      insertOne: {
        document: {
          keywordId: kw._id,
          keywordTerm: kw.term,
          deviceGroup: kw.device,
          location: kw.location,
          createdAt: kw.createdAt,
        },
      },
    });
    keywordTermEntries.push({
      insertOne: {
        document: {
          keywordId: kw._id,
          keywordTerm: kw.term,
          termGroup: kw.term,
          device: kw.device,
          location: kw.location,
          createdAt: kw.createdAt,
        },
      },
    });
  }

  if (locationEntries.length > 0) {
    await GroupedByLocation.bulkWrite(locationEntries);
    console.log('GroupedByLocation collection seeded');
  }
  if (deviceEntries.length > 0) {
    await GroupedByDevice.bulkWrite(deviceEntries);
    console.log('GroupedByDevice collection seeded');
  }
  if (keywordTermEntries.length > 0) {
    await GroupedByKeywordTerm.bulkWrite(keywordTermEntries);
    console.log('GroupedByKeywordTerm collection seeded');
  }

  await mongoose.disconnect();
  console.log('Disconnected from DB');
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  mongoose.disconnect();
});
