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
      userId: userPayloadSuper.id,
    }).populate('userId');
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
      userId: userPayloadSuper.id,
      name: reqBody.name,
    });
    if (existOrganization) {
      return NextResponse.json(
        { message: 'Organization exist' },
        { status: 400 }
      );
    }
    const organization = new Organization({
      name: reqBody.name,
      userId: userPayloadSuper.id,
    });
    const newOrganization = await organization.save();
    const populatedOrganization = await newOrganization.populate('userId');
    return NextResponse.json(populatedOrganization);
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
