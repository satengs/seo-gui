import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';

export async function PATCH(
    request: Request,
    { params }: { params: { id?: string } } // Direct destructuring of 'params'
) {
    try {
        await dbConnect();

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
