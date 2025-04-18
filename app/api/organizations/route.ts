import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserIdForSuper } from '@/utils/auth';
import Organization from '@/lib/db/models/Organization';
import { IUserPayload } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userPayloadSuper = (await getUserIdForSuper(req)) as IUserPayload;
    const organizationsBySuper = await Organization.find({
      createdBy: userPayloadSuper.id,
    }).populate('admin');
    return NextResponse.json(organizationsBySuper);
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
    const userPayloadSuper = (await getUserIdForSuper(req)) as IUserPayload;
    const existOrganization = await Organization.findOne({
      createdBy: userPayloadSuper.id,
      name: reqBody.name,
      admin: reqBody.admin,
    });
    if (existOrganization) {
      return NextResponse.json(
        { message: 'Organization exist' },
        { status: 400 }
      );
    }
    const organization = new Organization({
      name: reqBody.name,
      createdBy: userPayloadSuper.id,
      admin: reqBody.admin,
    });
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
