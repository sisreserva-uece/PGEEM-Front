import type { AxiosRequestConfig } from 'axios';
import type { MeResponse, SignInRequest, SignUpRequest } from '../types';
import apiClient from '@/lib/api/apiClient';
import bffClient from '@/lib/api/bffClient';

export const authService = {
  signIn(credentials: SignInRequest) {
    return bffClient.post<{ success: boolean }>('/api/auth/login', credentials);
  },
  signUp(userData: SignUpRequest) {
    return apiClient.post<void>('/auth/usuario', userData);
  },
  getMe(config?: AxiosRequestConfig) {
    return apiClient.get<MeResponse>('/auth/usuario/me', config);
  },
  logout() {
    return bffClient.post<{ success: boolean }>('/api/auth/logout');
  },
  refresh() {
    return bffClient.post<{ success: boolean }>('/api/auth/refresh');
  },
};
