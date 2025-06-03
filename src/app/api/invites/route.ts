import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connect } from '@/lib/db';
import Invite from '@/models/Invite';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
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

    const invites = await Invite.find({
      invitedUser: decoded.userId,
    })
    .populate('workspace', 'title')
    .populate('invitedBy', 'username')
    .sort({ createdAt: -1 });

    const formattedInvites = invites.map(invite => ({
      id: invite._id,
      boardId: invite.workspace._id,
      boardName: invite.workspace.title,
      inviterId: invite.invitedBy._id,
      inviterName: invite.invitedBy.username,
      status: invite.status,
      createdAt: invite.createdAt
    }));

    return NextResponse.json(formattedInvites);
  } catch (error) {
    console.error('[INVITES_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
