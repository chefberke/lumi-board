import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connect } from '@/lib/db';
import Invite from '@/models/Invite';
import Project from '@/models/Project';
import User from '@/models/User';
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

    // Await params before using
    const { inviteId } = await Promise.resolve(params);

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(inviteId)) {
      return NextResponse.json(
        { error: 'Invalid invitation ID format' },
        { status: 400 }
      );
    }

    const invite = await Invite.findById(inviteId);
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
    invite.status = 'accepted';
    await invite.save();

    // Add user to workspace members
    const workspace = await Project.findById(invite.workspace);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    if (!workspace.members) {
      workspace.members = [];
    }

    workspace.members.push(decoded.userId);
    await workspace.save();

    // Add workspace to user's projects
    const user = await User.findById(decoded.userId);
    if (user) {
      if (!user.projects) {
        user.projects = [];
      }
      user.projects.push(workspace._id);
      await user.save();
    }

    return NextResponse.json({
      message: 'Invitation accepted successfully',
      workspace: {
        id: workspace._id,
        title: workspace.title
      }
    });
  } catch (error) {
    console.error('[INVITE_ACCEPT]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
