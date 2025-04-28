import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/index';
import Keyword from '@/lib/db/models/schemas/Keyword';

export async function GET() {
  try {
    await dbConnect();

    const keywordsWithHistoricalData = await Keyword.aggregate([
      {
        $lookup: {
          from: "keywordHistoricalData", // Make sure this collection name is correct
          localField: "_id",
          foreignField: "id",
          as: "historicalData"
        }
      },
      {
        $unwind: {
          path: "$historicalData",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    return NextResponse.json(keywordsWithHistoricalData);
  } catch (error) {
    console.error("[GET KEYWORDS ERROR]:", error);
    return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
  }
}
