import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';
import { Env } from '../env';
import bffClient from './bffClient';
import { extractErrorMessage } from './extractErrorMessage';

declare module 'axios' {
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface AxiosRequestConfig {
    _showToastOnError?: boolean;
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: Env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

function onRefreshed(): void {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
}

function subscribeToRefresh(cb: () => void): void {
  refreshSubscribers.push(cb);
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        window.location.href = '/signin';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeToRefresh(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await bffClient.post('/api/auth/refresh');
        isRefreshing = false;
        onRefreshed();
        return apiClient(originalRequest);
      } catch {
        isRefreshing = false;
        refreshSubscribers = [];
        window.location.href = '/signin';
        return Promise.reject(error);
      }
    }

    if (status === 403) {
      toast.error('Você não tem permissão para realizar esta ação.');
      return Promise.reject(error);
    }

    const shouldShowToast = originalRequest?._showToastOnError !== false;
    if (shouldShowToast && error.response) {
      const message = extractErrorMessage(error.response.data);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
