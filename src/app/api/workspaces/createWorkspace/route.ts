import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Project from '@/models/Project';
import Column from '@/models/Column';
import Item from '@/models/Item';
import { connect } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { title } = await req.json();

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const project = await Project.create({
      title,
      owner: decoded.userId,
    });

    // Create default columns
    const todoColumn = await Column.create({
      title: 'Todo',
      order: 0,
      projectId: project._id,
    });

    const inProgressColumn = await Column.create({
      title: 'In Progress',
      order: 1,
      projectId: project._id,
    });

    const doneColumn = await Column.create({
      title: 'Done',
      order: 2,
      projectId: project._id,
    });

    // Add completion message item to Done column
    const completionItem = await Item.create({
      title: 'The project was successfully created!',
      order: 0,
      columnId: doneColumn._id,
    });

    // Update columns with items
    doneColumn.items = [completionItem._id];
    await doneColumn.save();

    // Update project with columns
    project.columns = [todoColumn._id, inProgressColumn._id, doneColumn._id];
    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}
