import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid workspace ID format' },
        { status: 400 }
      );
    }

    // Find the workspace
    const workspace = await Project.findById(params.id);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (workspace.owner.toString() === decoded.userId) {
      return NextResponse.json(
        { error: 'Workspace owner cannot leave the workspace. Please transfer ownership or delete the workspace.' },
        { status: 403 }
      );
    }

    // Check if user is a member
    if (!workspace.members.some((memberId: Types.ObjectId) => memberId.toString() === decoded.userId)) {
      return NextResponse.json(
        { error: 'You are not a member of this workspace' },
        { status: 403 }
      );
    }

    // Remove user from workspace members
    workspace.members = workspace.members.filter(
      (memberId: Types.ObjectId) => memberId.toString() !== decoded.userId
    );
    await workspace.save();

    // Remove workspace from user's projects
    const user = await User.findById(decoded.userId);
    if (user) {
      user.projects = user.projects.filter(
        (projectId: Types.ObjectId) => projectId.toString() !== params.id
      );
      try {
        await user.save();
      } catch (userSaveError) {
        console.error('[LEAVE_WORKSPACE] Failed to update user projects:', userSaveError);
        // Continue execution as workspace removal was successful
      }
    }

    return NextResponse.json({
      message: 'Successfully left the workspace'
    });
  } catch (error) {
    console.error('[LEAVE_WORKSPACE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
