import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/lib/db/models/Location';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { seedInitialKeywords } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities, paginateEntitiesByFilter } from '@/lib/db/helpers';
import { IKeyword, IPaginatedKeywords } from '@/types';
import { SIZE } from '@/consts';
import User from '@/lib/db/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    // const fullList = searchParams.get('fullList');
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    // const searchTerm = searchParams.get('searchTerm') || '';
    // const sortKey = searchParams.get('sortKey') || '';
    // const sortDirection = searchParams.get('sortDirection') || 'asc';
    // const dateRangeFrom = searchParams.get('dateFrom');
    // const dateRangeTo = searchParams.get('dateTo');

    // Seed initial keywords if none exist

    // let _keywords: IPaginatedKeywords;
    // _keywords = await paginateEntitiesByFilter(
    //     page as number,
    //     size as number,
    //     Keyword,
    //     searchTerm,
    //     { sortKey, sortDirection },
    //     { from: dateRangeFrom, to: dateRangeTo }
    // );
    const locations = await paginateEntities(+page, +size, Location);

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

//Create new location
export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log('data: ', data);
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    // if (data?.['_id']) {
    //     await Keyword.findOneAndUpdate(
    //         {
    //             term: data.term,
    //             device: data?.device,
    //             location: data?.location,
    //         },
    //         {
    //             $set: {
    //                 isDefaultKeywords: true,
    //             },
    //         },
    //         { new: true, runValidators: true }
    //     );
    //     const keywords = await paginateEntities(
    //         page as number,
    //         size as number,
    //         Keyword
    //     );

    const newLocation = new Location({
      location: data.location,
      longitude: data.longitude,
      latitude: data.latitude,
    });
    await newLocation.save();

    const locations = await paginateEntities(+page, +size, Location);
    return NextResponse.json(locations);
    // }
  } catch (error) {
    console.error('Failed to create location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}

//Change location
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    // await Keyword.findOneAndUpdate(
    //     {
    //         term: data.term,
    //         location: data?.keywordData?.location,
    //         device: data?.keywordData?.device,
    //     },
    //     {
    //         $set: data.updatedData,
    //     },
    //     { new: true, runValidators: true }
    // );
    //
    // const keywords = await paginateEntities(
    //     page as number,
    //     size as number,
    //     Keyword
    // );

    return NextResponse.json({ message: true });
  } catch (error) {
    console.error('Failed to update location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

//Delete location
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const location = searchParams.get('location') || '';
    await Location.deleteOne({ _id: location });
    const locations = await paginateEntities(
      page as number,
      size as number,
      Location
    );
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to remove location:', error);

    return NextResponse.json(
      { error: 'Failed to remove location' },
      { status: 500 }
    );
  }
}
