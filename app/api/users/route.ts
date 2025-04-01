import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserIdForSuper } from '@/utils/auth';
import User from '@/lib/db/models/User';
import { IUserPayload } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userPayloadSuper = (await getUserIdForSuper(req)) as IUserPayload;
    const usersBySuper = await User.find({
      _id: { $ne: userPayloadSuper.id },
    }).populate('roleId');
    return NextResponse.json(usersBySuper);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await req.json();
    const existUser = await User.findOne({ email: reqBody.email });
    if (existUser) {
      return NextResponse.json({ message: 'User exist' }, { status: 400 });
    }
    const user = new User({
      fullName: reqBody.fullName,
      email: reqBody.email,
      password: reqBody.password,
      roleId: reqBody.role,
    });
    const newUser = await user.save();
    const populatedUser = await newUser.populate('roleId');
    return NextResponse.json(populatedUser);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
