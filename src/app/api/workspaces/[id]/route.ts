import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Project from '@/models/Project';
import Column from '@/models/Column';
import Item from '@/models/Item';
import { connect } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { IProject, IColumn, IItem } from '@/types/models';
import mongoose from 'mongoose';

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
    const columns = (await Column.find({ projectId: id }).sort({ order: 1 }).lean() as unknown) as IColumn[];

    // Get all items for all columns
    const columnIds = columns.map(col => col._id);
    const items = (await Item.find({ columnId: { $in: columnIds } }).lean() as unknown) as IItem[];

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
          description: item.description || '',
          createdAt: item.createdAt,
        }))
      };
    });

    return NextResponse.json({
      workspace: {
        id: project._id.toString(),
        ownerId: project.owner.toString(),
        title: project.title,
        members: project.members.map(member => member.toString()),
        columns: columnsWithCards,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } = params;
    const { columns } = await req.json();

    const token = req.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Projeyi kontrol et
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Mevcut tüm kolonları ve kartları al
    const existingColumns = (await Column.find({ projectId: id }).lean() as unknown) as IColumn[];
    const existingColumnIds = existingColumns.map(col => col._id.toString());

    // Mevcut tüm kartları al
    const existingItems = (await Item.find({ columnId: { $in: existingColumnIds } }).lean() as unknown) as IItem[];

    // Gönderilen kartların ID'lerini topla
    const updatedCardIds = new Set();

    // Kolonları güncelle
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      // Kolon sırasını güncelle
      await Column.findByIdAndUpdate(column.id, { order: i });

      // Kartları güncelle
      for (let j = 0; j < column.cards.length; j++) {
        const card = column.cards[j];
        // Eğer kart mevcutsa güncelle, yoksa yeni oluştur
        if (card.id && mongoose.Types.ObjectId.isValid(card.id) && await Item.findById(card.id)) {
          await Item.findByIdAndUpdate(card.id, {
            columnId: column.id,
            order: j,
            title: card.title,
            description: card.description || ''
          });
          updatedCardIds.add(card.id.toString());
        } else {
          // Yeni kart oluştur
          const newItem = await Item.create({
            _id: mongoose.Types.ObjectId.isValid(card.id) ? card.id : new mongoose.Types.ObjectId(),
            title: card.title,
            order: j,
            columnId: card.columnId ? (typeof card.columnId === "string" ? new mongoose.Types.ObjectId(card.columnId) : card.columnId) : column.id,
            description: card.description || '',
            createdAt: card.createdAt || new Date()
          });
          updatedCardIds.add(newItem._id.toString());
        }
      }
    }

    // Silinen kartları tespit et ve sil
    const deletedItems = existingItems.filter(item => !updatedCardIds.has(item._id.toString()));
    for (const item of deletedItems) {
      await Item.findByIdAndDelete(item._id);
    }

    return NextResponse.json({ success: true, message: 'Workspace updated successfully' });
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to update workspace' },
      { status: 500 }
    );
  }
}
