import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';

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
        
        const workspaces = await Project.find({ owner: decoded.userId })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            workspaces: workspaces.map(workspace => ({
                _id: workspace._id,
                title: workspace.title,
                owner: workspace.owner,
                columns: workspace.columns,
                createdAt: workspace.createdAt,
                updatedAt: workspace.updatedAt
            }))
        });

    } catch (error) {
        console.error('GetWorkspaces error:', error);
        
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "An error occurred while getting workspaces" },
            { status: 500 }
        );
    }
}