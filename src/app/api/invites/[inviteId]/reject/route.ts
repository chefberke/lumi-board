import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connect } from '@/lib/db';
import Invite from '@/models/Invite';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  try {
    await connect();

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(params.inviteId)) {
      return NextResponse.json(
        { error: 'Invalid invitation ID format' },
        { status: 400 }
      );
    }

    const invite = await Invite.findById(params.inviteId);
    if (!invite) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (invite.invitedUser.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - This invitation is not for you' },
        { status: 403 }
      );
    }

    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation has already been processed' },
        { status: 400 }
      );
    }

    // Update invite status
    invite.status = 'rejected';
    await invite.save();

    return NextResponse.json({
      message: 'Invitation rejected successfully'
    });
  } catch (error) {
    console.error('[INVITE_REJECT]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
