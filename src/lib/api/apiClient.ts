import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';
import { Env } from '../env';
import bffClient from './bffClient';
import { extractErrorMessage } from './extractErrorMessage';
import { updateSessionAction } from '@/features/auth/actions/authActions';

declare module 'axios' {
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface AxiosRequestConfig {
    _showToastOnError?: boolean;
    _retry?: boolean;
  }
}

const apiClient = axios.create({
<<<<<<< Updated upstream
  baseURL: Env.NEXT_PUBLIC_API_BASE_URL,
=======
  baseURL: isServer 
    ? (process.env.API_INTERNAL_URL || Env.NEXT_PUBLIC_API_BASE_URL)
    : Env.NEXT_PUBLIC_API_BASE_URL,
>>>>>>> Stashed changes
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

    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/logout')){
      isRefreshing = false;

      if (!isServer){
        window.location.href = '/signin'
        return Promise.reject(error);
      }
    } 

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeToRefresh(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await bffClient.post('/api/auth/refresh');
        const newToken = response.data?.token || response.data?.data?.token || response.data?.accessToken;

        if (newToken) {
          await updateSessionAction(newToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          isRefreshing = false;
          onRefreshed();
          return apiClient(originalRequest);
        } else {
          throw new Error('No token received');
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        if (!isServer) window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && originalRequest._retry) {
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
