import { NextResponse } from 'next/server';
import { searchKeyword } from '@/lib/serpApi';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword') || '';
    const location = searchParams.get('location') || 'United States';
    const device = searchParams.get('device') || 'desktop';
    const keywordQ = keyword.replace(/-/g, ' ');
    const htmlData: any = await searchKeyword(
      keywordQ,
      location,
      device,
      'html'
    );

    return new Response(htmlData, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
