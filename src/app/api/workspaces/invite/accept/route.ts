import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Project from '@/models/Project';
import User from '@/models/User';
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

    // Find the workspace
    const workspace = await Project.findById(invite.workspace);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Initialize members array if it doesn't exist
    if (!workspace.members) {
      workspace.members = [];
    }

    // Add user to members array
    workspace.members.push(invite.invitedUser);
    await workspace.save();

    // Add workspace to user's projects array
    const user = await User.findById(invite.invitedUser);
    if (user) {
      if (!user.projects) {
        user.projects = [];
      }
      user.projects.push(workspace._id);
      await user.save();
    }

    // Update invitation status
    invite.status = 'accepted';
    await invite.save();

    return NextResponse.json({
      message: 'Invitation accepted successfully',
      workspace: {
        id: workspace._id,
        title: workspace.title
      }
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
