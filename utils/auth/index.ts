import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function getAuthUserId(req: NextRequest) {
  try {
    const token = req.cookies.get('token');
    if (!token?.value) {
      return NextResponse.json(
        { message: 'Not Authenticated' },
        { status: 401 }
      );
    }

    const userPayload = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: string;
      exp: number;
    };

    if (userPayload.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: 'Token has expired' },
        { status: 401 }
      );
    }

    return userPayload.id;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}
