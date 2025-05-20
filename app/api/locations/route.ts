import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/lib/db/models/Location';
import { paginateLocationsByFilter } from '@/lib/db/helpers';
import { ILocation, IPaginateData } from '@/types';
import { SIZE } from '@/consts';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const searchKey = searchParams.get('searchKey') || '';
    const sortKey = searchParams.get('sortKey') || '';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    console.log('search params: ', searchParams);

    let _locations: IPaginateData<ILocation>;
    _locations = await paginateLocationsByFilter(
      page as number,
      size as number,
      Location,
      searchKey,
      { sortKey, sortDirection }
    );

    return NextResponse.json(_locations);
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
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const searchKey = searchParams.get('searchKey') || '';
    const sortKey = searchParams.get('sortKey') || '';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    if (data?.length) {
      for (let i = 0; i < data?.length; i++) {
        const existLocation = await Location.findOne({
          location: data[i].canonical_name,
        });
        if (!existLocation) {
          const newLocation = new Location({
            location: data[i]?.canonical_name,
            longitude: data[i]?.gps?.[0],
            latitude: data[i]?.gps?.[1],
            countryCode: data[i].country_code,
          });
          await newLocation.save();
        }
      }
    }
    const locations = await paginateLocationsByFilter(
      page as number,
      size as number,
      Location,
      searchKey,
      { sortKey, sortDirection }
    );
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to create location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const location = searchParams.get('location') || '';
    console.log('loctaion: ', location);
    const searchKey = searchParams.get('searchKey') || '';
    const sortKey = searchParams.get('sortKey') || '';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    await Location.deleteOne({ _id: location });
    const locations = await paginateLocationsByFilter(
      page as number,
      size as number,
      Location,
      searchKey,
      { sortKey, sortDirection }
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
