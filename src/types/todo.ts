export interface Todo {
  id: string;
  text: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags?: string[];
}

export interface TodoFilter {
  status: 'all' | 'todo' | 'progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}