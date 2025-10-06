import { Todo } from '../types/Todo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}

export interface ClearCompletedResponse {
  deletedCount: number;
}

export interface ReorderTodosRequest {
  todoIds: number[];
}

class TodoApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    // Handle No Content responses
    if (response.status === 204) {
      return null as T;
    }
    
    return response.json();
  }

  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      credentials: 'include', // Include cookies for authentication
    });
    return this.handleResponse<Todo[]>(response);
  }

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(request),
    });
    return this.handleResponse<Todo>(response);
  }

  async updateTodo(id: number, request: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(request),
    });
    return this.handleResponse<Todo>(response);
  }

  async toggleTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
      credentials: 'include', // Include cookies for authentication
    });
    return this.handleResponse<Todo>(response);
  }

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });
    return this.handleResponse<void>(response);
  }

  async clearCompletedTodos(): Promise<ClearCompletedResponse> {
    const response = await fetch(`${API_BASE_URL}/todos/completed`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for authentication
    });
    return this.handleResponse<ClearCompletedResponse>(response);
  }

  async reorderTodos(request: ReorderTodosRequest): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(request),
    });
    return this.handleResponse<Todo[]>(response);
  }
}

export const todoApi = new TodoApiService();
