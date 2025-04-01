import { NextResponse } from 'next/server';

import Project from '@/models/Project';
import { connect } from '@/lib/db';

export async function PATCH(req: Request) {
  try {

    await connect();
    const { id, title } = await req.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: 'Project ID and title are required' },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    project.title = title;
    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to update workspace' },
      { status: 500 }
    );
  }
}