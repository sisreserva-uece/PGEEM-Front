import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';
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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      useAuthStore.getState().clearAuth();
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
