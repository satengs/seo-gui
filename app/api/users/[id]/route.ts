import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserIdForSuper } from '@/utils/auth';
import { IUserPayload } from '@/types';
import User from '@/lib/db/models/User';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    await getUserIdForSuper(req);
    await User.deleteOne({ _id: id });

    return NextResponse.json({
      message: 'Delete successfully done',
    });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    const reqBody = await req.json();
    await getUserIdForSuper(req);
    const updatedData = await User.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    const populatedData = await updatedData.populate('roleId');
    return NextResponse.json(populatedData);
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
