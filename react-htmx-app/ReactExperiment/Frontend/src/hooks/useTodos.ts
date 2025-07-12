import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { todoApi } from '../services/todoApi';

export interface UseTodosResult {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
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
      setTodos(todosData);
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

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    refetch: fetchTodos,
  };
};
