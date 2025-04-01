import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { IUserPayload } from '@/types';

export async function getAuthUserId(req: NextRequest) {
  try {
    const token = req.cookies.get('token');
    if (!token?.value) {
      throw new Error('Not Authenticated');
    }

    const userPayload = jwt.verify(
      token.value,
      process.env.JWT_SECRET!
    ) as IUserPayload;

    if (userPayload.exp < Math.floor(Date.now() / 1000) || !userPayload.id) {
      const response = NextResponse.json(
        { message: 'Token has expired' },
        { status: 401 }
      );
      response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      throw new Error('Token has expired');
    }

    return userPayload;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function getUserIdForSuper(req: NextRequest) {
  try {
    const userPayload = (await getAuthUserId(req)) as IUserPayload;
    if (userPayload.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'User does not have permission for this action' },
        { status: 403 }
      );
    }
    return userPayload;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}
