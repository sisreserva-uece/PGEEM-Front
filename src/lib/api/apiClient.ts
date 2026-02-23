import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';
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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = '/signin';
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error('Você não tem permissão para realizar esta ação.');
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const shouldShowToast = originalRequest?._showToastOnError !== false;

    if (error.response && shouldShowToast) {
      const errorData = error.response.data as { error?: string | { message?: string } };
      const message
        = typeof errorData.error === 'string'
          ? errorData.error
          : errorData?.error?.message || 'Erro inesperado.';
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
