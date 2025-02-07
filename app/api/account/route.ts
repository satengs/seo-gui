import { NextResponse } from 'next/server';
import { getAccountInfo } from '@/lib/serpApi';

export async function GET() {
  try {
    const accountData = await getAccountInfo();
    return NextResponse.json(accountData);
  } catch (error) {
    console.error('Failed to fetch account data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
}
