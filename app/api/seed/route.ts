import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import { seedInitialKeywords } from '@/lib/db/models/Keyword/InitialKeywords';

export async function POST() {
    try {
        await dbConnect();
        console.log('Connected to MongoDB, starting to seed keywords...');
        const result = await seedInitialKeywords();

        return NextResponse.json({
            message: 'Keywords seeded successfully',
            result
        });
    } catch (error) {
        console.error('Failed to seed keywords. Error:', error);
        return NextResponse.json(
            { error: 'Failed to seed keywords' },
            { status: 500 }
        );
    }
}