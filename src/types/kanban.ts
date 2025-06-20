import { IItem, IColumn, IUser } from './models';

export interface Card extends Omit<IItem, '_id' | 'columnId' | 'assignee'> {
  id: string;
  columnId?: string;
  assignee?: {
    _id: string;
    username: string;
  };
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
