import { IItem, IColumn, IUser } from './models';

export interface Card extends Omit<IItem, '_id' | 'columnId'> {
  id: string;
  columnId?: string;
}

export interface Column extends Omit<IColumn, '_id' | 'projectId' | 'items'> {
  id: string;
  cards: Card[];
}

export interface User {
  user: Pick<IUser, 'username'>;
}

export interface CardProps {
  card: Card;
  index: number;
  user: User;
  onDelete?: (cardId: string) => void;
}

export interface KanbanBoardProps {
  columns: Column[];
}
