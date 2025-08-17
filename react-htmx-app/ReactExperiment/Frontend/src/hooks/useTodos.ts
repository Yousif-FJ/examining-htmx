import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { todoApi } from '../services/todoApi';

export interface UseTodosResult {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  updateTodo: (id: number, text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
  reorderTodos: (reorderedTodos: Todo[]) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTodos = (): UseTodosResult => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoApi.getAllTodos();
      // Sort todos by order
      const sortedTodos = todosData.sort((a, b) => a.order - b.order);
      setTodos(sortedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo({ text });
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: number, text: string) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, { text });
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);
      await todoApi.clearCompletedTodos();
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed todos');
      throw err;
    }
  };

  const reorderTodos = async (reorderedTodos: Todo[]) => {
    try {
      setError(null);
      // Optimistically update the local state
      setTodos(reorderedTodos);
      
      // Send the reorder request to the server
      const todoIds = reorderedTodos.map(todo => todo.id);
      await todoApi.reorderTodos({ todoIds });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder todos');
      // Revert the optimistic update by refetching
      await fetchTodos();
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    refetch: fetchTodos,
  };
};
