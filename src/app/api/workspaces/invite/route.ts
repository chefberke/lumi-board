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
    const { workspaceId, email } = await req.json();

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(workspaceId)) {
      return NextResponse.json(
        { error: 'Invalid workspace ID format' },
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

    // Find the workspace
    const workspace = await Project.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if the user is the owner
    if (workspace.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Only workspace owner can invite members' },
        { status: 403 }
      );
    }

    // Find the user to invite
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize members array if it doesn't exist
    if (!workspace.members) {
      workspace.members = [];
    }

    // Check if user is already a member
    if (workspace.members.some((memberId: Types.ObjectId) => memberId.toString() === userToInvite._id.toString())) {
      return NextResponse.json(
        { error: 'User is already a member of this workspace' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invite
    const existingInvite = await Invite.findOne({
      workspace: workspaceId,
      invitedUser: userToInvite._id,
      status: 'pending'
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: 'User already has a pending invitation' },
        { status: 400 }
      );
    }

    // Create invitation
    const invite = await Invite.create({
      workspace: workspaceId,
      invitedUser: userToInvite._id,
      invitedBy: decoded.userId,
      status: 'pending'
    });

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invite: {
        id: invite._id,
        workspace: {
          id: workspace._id,
          title: workspace.title
        },
        invitedUser: {
          id: userToInvite._id,
          email: userToInvite.email
        },
        status: invite.status
      }
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}
