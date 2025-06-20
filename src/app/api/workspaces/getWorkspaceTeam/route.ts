import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Get workspace ID from query parameters
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('id');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(workspaceId)) {
      return NextResponse.json(
        { error: 'Invalid workspace ID format' },
        { status: 400 }
      );
    }

    // Find the workspace
    const workspace = await Project.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this workspace (owner or member)
    const userId = new Types.ObjectId(decoded.userId);
    const isOwner = workspace.owner.toString() === userId.toString();
    const isMember = workspace.members.some((memberId: Types.ObjectId) =>
      memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: 'Access denied - You are not a member of this workspace' },
        { status: 403 }
      );
    }

    // Get owner information
    const owner = await User.findById(workspace.owner).select('username');
    if (!owner) {
      return NextResponse.json(
        { error: 'Workspace owner not found' },
        { status: 404 }
      );
    }

    // Get members information
    const members = await User.find({
      _id: { $in: workspace.members }
    }).select('username');

    // Combine owner and members into a team list
    const team = [
      {
        id: owner._id.toString(),
        username: owner.username,
        role: 'owner'
      },
      ...members.map(member => ({
        id: member._id.toString(),
        username: member.username,
        role: 'member'
      }))
    ];

    return NextResponse.json({
      workspaceId: workspaceId,
      workspaceTitle: workspace.title,
      team: team
    });

  } catch (error) {
    console.error('GetWorkspaceTeam error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred while getting workspace team" },
      { status: 500 }
    );
  }
}
