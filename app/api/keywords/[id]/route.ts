import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';

export async function PATCH(
    request: Request,
    context: { params: { id?: string } } // Optional 'id' to avoid destructuring errors
) {
    try {
        await dbConnect();

        // Fix: Explicitly await params
        const params = await context.params;

        if (!params?.id) {
            return NextResponse.json(
                { error: 'Keyword ID is required' },
                { status: 400 }
            );
        }

        const { tags } = await request.json();

        if (!Array.isArray(tags)) {
            return NextResponse.json(
                { error: 'Tags must be an array' },
                { status: 400 }
            );
        }

        const keyword = await Keyword.findByIdAndUpdate(
            params.id.toString(),
            { $set: { tags } },
            { new: true }
        );

        if (!keyword) {
            return NextResponse.json(
                { error: 'Keyword not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(keyword);
    } catch (error) {
        console.error('Failed to update keyword:', error);
        return NextResponse.json(
            { error: 'Failed to update keyword' },
            { status: 500 }
        );
    }
}
