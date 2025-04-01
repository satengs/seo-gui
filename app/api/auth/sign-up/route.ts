import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/db/models/User';
import Roles from '../../../../lib/db/models/Role';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { fullName, email, password } = reqBody;
    const superAdminRole = await Roles.findOne({ name: 'super_admin' });
    if (superAdminRole) {
      const existUser = await User.findOne({ email });
      if (existUser) {
        return NextResponse.json({ message: 'User exist' }, { status: 400 });
      }
      const user = new User({
        fullName,
        email,
        password,
        roleId: superAdminRole._id,
      });
      await user.save();
      return NextResponse.json(
        { message: 'User successfully registered' },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err?.message : 'Server error' },
      { status: 500 }
    );
  }
}
