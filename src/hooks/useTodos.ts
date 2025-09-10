import { useState, useEffect } from 'react';
import { Todo, TodoFilter, TodoStats } from '@/types/todo';

const STORAGE_KEY = 'taskflow-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar todos desde localStorage al montar el componente
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Guardar todos en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // Crear nueva tarea
  const addTodo = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      status: 'todo',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  // Actualizar tarea
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  };

  // Eliminar tarea
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Cambiar estado de tarea
  const toggleTodoStatus = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        let newStatus: Todo['status'];
        switch (todo.status) {
          case 'todo':
            newStatus = 'progress';
            break;
          case 'progress':
            newStatus = 'done';
            break;
          case 'done':
            newStatus = 'todo';
            break;
          default:
            newStatus = 'todo';
        }
        return { ...todo, status: newStatus, updatedAt: new Date() };
      }
      return todo;
    }));
  };

  // Reordenar todos (para drag & drop)
  const reorderTodos = (startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const filteredTodos = getFilteredTodos(prev);
      const result = Array.from(filteredTodos);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Reconstruir el array completo manteniendo los elementos filtrados
      const otherTodos = prev.filter(todo => !filteredTodos.includes(todo));
      return [...result, ...otherTodos];
    });
  };

  // Filtrar todos
  const getFilteredTodos = (todoList: Todo[] = todos): Todo[] => {
    return todoList.filter(todo => {
      // Filtro por estado
      if (filter.status !== 'all' && todo.status !== filter.status) {
        return false;
      }
      
      // Filtro por prioridad
      if (filter.priority && todo.priority !== filter.priority) {
        return false;
      }
      
      // Filtro por búsqueda
      if (filter.search && !todo.text.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Obtener estadísticas
  const getStats = (): TodoStats => {
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.status === 'done').length,
      inProgress: todos.filter(todo => todo.status === 'progress').length,
      pending: todos.filter(todo => todo.status === 'todo').length,
    };
  };

  return {
    todos: getFilteredTodos(),
    allTodos: todos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    reorderTodos,
    stats: getStats(),
    isLoading,
  };
};