import { toast } from 'sonner';
import { Env } from '../env';
import { useAuthStore } from '../store/authStore';

class ApiClient {
  private baseURL: string;
  constructor() {
    this.baseURL = Env.NEXT_PUBLIC_API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const { token } = useAuthStore.getState();
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    if (!response.ok) {
      const errorMessage = await response.text();
      toast.error(errorMessage);
    }
    return response;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
