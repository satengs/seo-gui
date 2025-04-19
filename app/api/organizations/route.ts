import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getAuthUserId, getUserIdForSuper } from '@/utils/auth';
import Organization from '@/lib/db/models/Organization';
import Role from '@/lib/db/models/Role';
import { IUserPayload } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const authUser = (await getAuthUserId(req)) as IUserPayload;
    const role = await Role.findOne({ _id: authUser.roleId });
    let query =
      role?.name === 'admin'
        ? { admin: authUser.id }
        : { createdBy: authUser.id };
    const populatedField = role?.name === 'admin' ? 'admin' : 'createdBy';
    const organizations =
      await Organization.find(query).populate(populatedField);
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await req.json();
    const authUser = (await getAuthUserId(req)) as IUserPayload;
    const role = await Role.findOne({ _id: authUser.roleId });
    let query =
      role?.name === 'admin'
        ? { admin: authUser.id, name: reqBody.name }
        : { createdBy: authUser.id };
    const populatedField = role?.name === 'admin' ? 'admin' : 'createdBy';
    const existOrganization = await Organization.findOne(query);
    if (existOrganization) {
      return NextResponse.json(
        { message: 'Organization exist' },
        { status: 400 }
      );
    }
    const organization = new Organization(query);
    const newOrganization = await organization.save();
    const populatedOrganization = await newOrganization.populate('admin');
    return NextResponse.json(populatedOrganization);
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
