import { NextResponse } from 'next/server';
import { searchLocations } from '@/lib/serpApi';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const loc = searchParams.get('q') || '';
    const locations = await searchLocations(loc, 10);
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
