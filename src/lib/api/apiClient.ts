import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Env } from '../env';

const apiClient = axios.create({
  baseURL: Env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
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
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as { error?: { message?: string } };
      const errorMessage = errorData?.error?.message || 'Um erro inesperado ocorreu, por favor tente novamente'
        + ' ou contate o suporte.';
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
