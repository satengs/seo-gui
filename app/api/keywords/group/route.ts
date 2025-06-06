import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { searchKeyword } from '@/lib/serpApi';
import GroupedByKeywordTerm from '@/lib/db/models/schemas/GroupedByKeywordTerm';
import GroupedByDevice from '@/lib/db/models/schemas/GroupedByDevice';
import GroupedByLocation from '@/lib/db/models/schemas/GroupedByLocation';
import dbConnect from '@/lib/db';
import KeywordHistoricalData from '@/lib/db/models/schemas/KeywordHistoricalData';

function normalizeGroupValue(value: string) {
  return value
    .split(',')
    .map((part) => part.trim())
    .join(',');
}

async function fetchGroupsWithKeywordsEx(
  model: mongoose.Model<any>,
  groupField: string
) {
  const groups = await model.distinct(groupField);

  const result = await Promise.all(
    groups.map(async (groupValue) => {
      const keywords = await model
        .find({ [groupField]: groupValue })
        .select(
          'keywordTerm device locationGroup deviceGroup termGroup location'
        )
        .lean();
      return {
        group: groupValue,
        keywords,
      };
    })
  );

  return result;
}

async function fetchGroupsWithKeywords(
  model: mongoose.Model<any>,
  groupField: string
) {
  const allDocs = await model
    .find()
    .select(
      `keywordTerm keywordId device locationGroup deviceGroup termGroup location ${groupField}`
    )
    .lean();

  // Normalize group values and group the documents
  const groupMap: Record<string, any[]> = {};
  const keywordIdSet = new Set<string>();

  for (const doc of allDocs) {
    const rawValue = doc[groupField];
    if (!rawValue) continue;

    const normalized = normalizeGroupValue(rawValue);
    if (!groupMap[normalized]) {
      groupMap[normalized] = [];
    }
    groupMap[normalized].push(doc);
    keywordIdSet.add(String(doc.keywordId));
  }
  const historicalDataList = await KeywordHistoricalData.find({
    id: { $in: Array.from(keywordIdSet) },
  })
    .lean()
    .select(
      '-_id id date keywordData organicResultsCount kgmid kgmTitle kgmWebsite backlinksNeeded difficulty volume timestamp'
    );
  const historicalMap: Record<string, any[]> = {};
  for (const hist of historicalDataList) {
    const key = String(hist.id);
    if (!historicalMap[key]) historicalMap[key] = [];
    historicalMap[key].push(hist);
  }

  return Object.entries(groupMap).map(([group, keywords]) => ({
    group,
    keywords: keywords.map((k) => ({
      ...k,
      historicalData: historicalMap[String(k.keywordId)] || [],
    })),
  }));
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const groupBy = searchParams.get('groupBy') || '';
    let data;
    if (groupBy === 'location') {
      data = await fetchGroupsWithKeywords(GroupedByLocation, 'locationGroup');
    } else if (groupBy === 'device') {
      data = await fetchGroupsWithKeywords(GroupedByDevice, 'deviceGroup');
    } else if (groupBy === 'term') {
      data = await fetchGroupsWithKeywords(GroupedByKeywordTerm, 'termGroup');
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
