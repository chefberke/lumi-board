import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Invite from '@/models/Invite';
import { connect } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { inviteId } = await req.json();

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(inviteId)) {
      return NextResponse.json(
        { error: 'Invalid invitation ID format' },
        { status: 400 }
      );
    }

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Find the invitation
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if the invitation is for the current user
    if (invite.invitedUser.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - This invitation is not for you' },
        { status: 403 }
      );
    }

    // Check if the invitation is pending
    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation has already been processed' },
        { status: 400 }
      );
    }

    // Update invitation status
    invite.status = 'rejected';
    await invite.save();

    return NextResponse.json({
      message: 'Invitation rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to reject invitation' },
      { status: 500 }
    );
  }
}
