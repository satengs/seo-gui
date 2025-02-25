import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import User from '@/lib/db/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Get single user
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const token = cookies().get('auth_token')?.value;
        const decoded = token ? verifyToken(token) : null;
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser || (!['admin', 'superadmin'].includes(currentUser.role) && currentUser._id.toString() !== params.id)) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const user = await User.findById(params.id).select('-password');
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// Update user
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const token = cookies().get('auth_token')?.value;
        const decoded = token ? verifyToken(token) : null;
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser || (!['admin', 'superadmin'].includes(currentUser.role) && currentUser._id.toString() !== params.id)) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const updates = await request.json();

        // Remove sensitive fields if not admin
        if (!['admin', 'superadmin'].includes(currentUser.role)) {
            delete updates.role;
            delete updates.email;
        }

        const user = await User.findByIdAndUpdate(
            params.id,
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to update user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// Delete user
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const token = cookies().get('auth_token')?.value;
        const decoded = token ? verifyToken(token) : null;
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        // Prevent deleting the last superadmin
        if (currentUser.role === 'superadmin') {
            const superadminCount = await User.countDocuments({ role: 'superadmin' });
            if (superadminCount <= 1 && currentUser._id.toString() === params.id) {
                return NextResponse.json(
                    { error: 'Cannot delete the last superadmin' },
                    { status: 400 }
                );
            }
        }

        const user = await User.findByIdAndDelete(params.id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}