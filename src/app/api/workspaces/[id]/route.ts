import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Project from '@/models/Project';
import Column from '@/models/Column';
import Item from '@/models/Item';
import { connect } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { IProject, IColumn, IItem } from '@/types/models';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } = await params;

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Find the project
    const project = await Project.findById(id).lean() as IProject | null;
    if (!project) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Find all columns for this project
    const columns = await Column.find({ projectId: id }).sort({ order: 1 }).lean();
    
    // Get all items for all columns
    const columnIds = columns.map(col => col._id);
    const items = await Item.find({ columnId: { $in: columnIds } }).lean();
    
    // Group items by column
    const columnsWithCards = columns.map(column => {
      const columnItems = items.filter(item => 
        item.columnId.toString() === column?._id?.toString()
      );
      
      return {
        id: column._id,
        title: column.title,
        cards: columnItems.map(item => ({
          id: item._id,
          title: item.title,
          description: item.description || ''
        }))
      };
    });

    return NextResponse.json({
      workspace: {
        id: project._id.toString(),
        title: project.title,
        columns: columnsWithCards
      }
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}