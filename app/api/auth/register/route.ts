import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import User from '@/lib/db/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { email, password, name } = await request.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        const user = await User.create({
            email,
            password,
            name
        });

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}