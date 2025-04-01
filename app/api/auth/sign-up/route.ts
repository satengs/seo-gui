import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { fullName, email, password } = reqBody;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json({ message: 'User exist' }, { status: 400 });
    }
    const user = new User({ fullName, email, password });
    await user.save();
    return NextResponse.json(
      { message: 'User successfully registered' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}
