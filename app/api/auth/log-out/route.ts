import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: 'Log out successfully done' },
      { status: 200 }
    );
    response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Log out failed' },
      { status: 500 }
    );
  }
}
