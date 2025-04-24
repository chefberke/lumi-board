import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import Column from '@/models/Column';
import Item from '@/models/Item';
import { connect } from '@/lib/db';

export async function DELETE(req: Request) {
  try {

    await connect();

    const { id } = await req.json();
    const projectId = id; // Assuming id is passed in the reque

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }



    // Delete all items in all columns
    const columns = await Column.find({ projectId });
    for (const column of columns) {
      await Item.deleteMany({ columnId: column._id });
    }

    // Delete all columns
    await Column.deleteMany({ projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return NextResponse.json(
      { error: 'Failed to delete workspace' },
      { status: 500 }
    );
  }
}
