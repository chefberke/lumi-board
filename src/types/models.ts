import { Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  title: string;
  owner: Types.ObjectId;
  columns: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IColumn {
  _id: Types.ObjectId;
  title: string;
  order: number;
  projectId: Types.ObjectId;
  items: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IItem {
  _id: Types.ObjectId;
  title: string;
  order: number;
  columnId: Types.ObjectId;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}