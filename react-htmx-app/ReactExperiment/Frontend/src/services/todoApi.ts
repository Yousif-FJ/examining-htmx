import { Todo } from '../types/Todo';

const API_BASE_URL = 'http://localhost:5116/api';

export interface CreateTodoRequest {
  text: string;
}

export interface ClearCompletedResponse {
  deletedCount: number;
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
    const response = await fetch(`${API_BASE_URL}/todos/`);
    return this.handleResponse<Todo[]>(response);
  }

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse<Todo>(response);
  }

  async toggleTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return this.handleResponse<Todo>(response);
  }

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse<void>(response);
  }

  async clearCompletedTodos(): Promise<ClearCompletedResponse> {
    const response = await fetch(`${API_BASE_URL}/todos/completed`, {
      method: 'DELETE',
    });
    return this.handleResponse<ClearCompletedResponse>(response);
  }
}

export const todoApi = new TodoApiService();
