import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/db/models/User';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const dbUser = await User.findOne({ email: email }).populate('roleId');
    if (!dbUser) {
      return NextResponse.json(
        { message: "User doesn't registered" },
        { status: 400 }
      );
    }
    const isMatchPasswords = await bcrypt.compare(password, dbUser.password);
    if (!isMatchPasswords) {
      return NextResponse.json(
        { message: 'Password is incorrect' },
        { status: 400 }
      );
    }
    const tokenData = {
      id: dbUser._id,
      roleId: dbUser.roleId?._id,
      role: dbUser?.roleId?.name,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    const response = NextResponse.json(
      {
        message: 'Login successfully done!',
      },
      { status: 200 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}
