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
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];
let isRefreshing = false;

// TODO: fix the refresh logic not working when token expires, and also make it smarter to auto refresh when jwt expires not only after a error api (but also always try it on a error) 401 403
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;
    if (originalRequest.url?.endsWith('/refresh')) {
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const shouldAttemptRefresh = status === 401 || status === 500;
    if (shouldAttemptRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      isRefreshing = true;
      try {
        const { data } = await authService.refreshToken();
        const token = data.data?.token;
        useAuthStore.getState().setAccessToken(token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        failedQueue.forEach(prom => prom.resolve(token));
        return apiClient(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(prom => prom.reject(refreshError));

        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        failedQueue = [];
      }
    }
    const shouldShowToast = originalRequest._showToastOnError !== false;
    if (error.response && shouldShowToast) {
      const errorData = error.response.data as { error?: { message?: string } };
      const errorMessage
                = errorData?.error?.message
                  || 'Um erro inesperado ocorreu, por favor tente novamente ou contate o suporte.';
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
