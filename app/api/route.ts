import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { mockKeywords } from '@/lib/mockData';
import { PaginationResult } from '@/types';

async function paginateKeywords(page: number, size: number): Promise<PaginationResult<any>> {
    const skip = (page - 1) * size;
    const [keywords, totalCount] = await Promise.all([
        Keyword.find()
            .skip(skip)
            .limit(size)
            .sort({ createdAt: -1 })
            .lean(),
        Keyword.countDocuments()
    ]);

    return {
        entitiesData: keywords,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page
    };
}

export async function GET(request: Request) {
    try {
        console.log('Connecting to database...');
        let dbConnected = false;
        try {
            await dbConnect();
            console.log('Database connected successfully');
            dbConnected = true;
        } catch (error) {
            console.error('Database connection failed:', error);
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '10');

        let result;
        if (dbConnected) {
            try {
                result = await paginateKeywords(page, size);
                console.log('Successfully fetched keywords from database');
            } catch (error) {
                console.error('Failed to fetch keywords from database:', error);
                result = null;
            }
        }

        // Use mock data if database connection or query fails
        if (!result) {
            console.log('Using mock data');
            result = {
                entitiesData: mockKeywords,
                totalCount: mockKeywords.length,
                totalPages: 1,
                currentPage: page
            };
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to fetch keywords:', error);
        return NextResponse.json({
            entitiesData: mockKeywords,
            totalCount: mockKeywords.length,
            totalPages: 1,
            currentPage: 1,
            error: 'Using mock data due to database error'
        });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();
        const keyword = await Keyword.create(data);

        const result = await paginateKeywords(1, 10);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to create keyword:', error);
        return NextResponse.json(
            { error: 'Failed to create keyword' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '10');

        const data = await request.json();
        const { term, keywordData, updatedData } = data;

        await Keyword.findOneAndUpdate(
            { term, device: keywordData.device, location: keywordData.location },
            updatedData,
            { new: true }
        );

        const result = await paginateKeywords(page, size);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to update keyword:', error);
        return NextResponse.json(
            { error: 'Failed to update keyword' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const keywordId = searchParams.get('keyword');
        const page = parseInt(searchParams.get('page') || '1');
        const size = parseInt(searchParams.get('size') || '10');

        await Keyword.findByIdAndDelete(keywordId);

        const result = await paginateKeywords(page, size);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to delete keyword:', error);
        return NextResponse.json(
            { error: 'Failed to delete keyword' },
            { status: 500 }
        );
    }
}