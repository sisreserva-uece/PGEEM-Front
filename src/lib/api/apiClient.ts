import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Env } from '../env';

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

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data: refreshData } = await authService.refreshToken({
          _showToastOnError: false,
          _retry: true,
        });
        const newAccessToken = refreshData.data?.token;
        if (!newAccessToken) {
          throw new Error('Token refresh failed');
        }
        useAuthStore.getState().setAccessToken(newAccessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    if (status === 403) {
      toast.error('Você não tem permissão para realizar esta ação.');
    } else {
      const shouldShowToast = originalRequest._showToastOnError !== false;
      if (error.response && shouldShowToast) {
        const errorData = error.response.data as { error?: string | { message?: string } };
        const message = typeof errorData.error === 'string'
          ? errorData.error
          : errorData?.error?.message || 'Erro inesperado.';
        toast.error(message);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
