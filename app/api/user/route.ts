import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getAuthUserId } from '@/utils/auth';
import User from '@/lib/db/models/User';
import Role from '@/lib/db/models/Role';
import { IPermission, IUserPayload } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userPayload = (await getAuthUserId(req)) as IUserPayload;

    // const dbUser = await User.findOne({ _id: userPayload.id })
    //   .select('-password -createdAt -updatedAt -__v')
    //   .populate({
    //     path: 'roleId',
    //     populate: {
    //       path: 'permissions',
    //       model: 'Permission',
    //     },
    //   });
    const dbUser = await User.findOne({ _id: userPayload.id }).select(
      '-password -createdAt -updatedAt -__v'
    );
    console.log('user payload: ', userPayload);
    const permissionsByUserRole = await Role.findOne({
      _id: userPayload.roleId,
    }).populate('permissions');
    console.log('perm: ', permissionsByUserRole);
    let permissions: IPermission | [] = [];
    if (permissionsByUserRole._id) {
      permissions = permissionsByUserRole.permissions.map(
        (permission: IPermission) => permission.name
      );
    }
    const resp = {
      user: dbUser,
      permissions: permissions,
    };
    return NextResponse.json(resp);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
