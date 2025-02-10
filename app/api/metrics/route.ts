import { NextResponse } from 'next/server';

// Mock data for keyword metrics
const keywordMetrics = new Map([
    ['keyword 1', {
        difficulty: 47,
        volume: 12500,
        backlinksNeeded: 74,
        lastUpdated: new Date().toISOString()
    }],
    ['keyword 2', {
        difficulty: 67,
        volume: 8300,
        backlinksNeeded: 98,
        lastUpdated: new Date().toISOString()
    }],
    ['keyword 3', {
        difficulty: 23,
        volume: 22000,
        backlinksNeeded: 35,
        lastUpdated: new Date().toISOString()
    }],
]);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json(
            { error: 'Keyword parameter is required' },
            { status: 400 }
        );
    }

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate consistent mock data for unknown keywords
    const metrics = keywordMetrics.get(keyword) || {
        difficulty: Math.floor(Math.random() * 100),
        volume: Math.floor(Math.random() * 50000),
        backlinksNeeded: Math.floor(Math.random() * 100) + 20,
        lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(metrics);
}