import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Role from '@/lib/db/models/Role';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const roles = await Role.find({ name: { $ne: 'super_admin' } });
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
