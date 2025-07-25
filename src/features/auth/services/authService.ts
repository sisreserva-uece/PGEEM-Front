import type { AxiosRequestConfig } from 'axios';
import type { MeResponse, SignInRequest, SignInResponse, SignUpRequest } from '../types';
import apiClient from '@/lib/api/apiClient';

export const authService = {
  signIn(credentials: SignInRequest) {
    return apiClient.post<SignInResponse>('/auth/login', credentials);
  },
  signUp(userData: SignUpRequest) {
    return apiClient.post<void>('/auth/usuario', userData);
  },
  getMe(config?: AxiosRequestConfig) {
    return apiClient.get<MeResponse>('/auth/usuario/me', config);
  },
  refreshToken: (config?: AxiosRequestConfig) => {
    return apiClient.post('/auth/refresh', undefined, config);
  },
  logout: () => {
    return apiClient.post('/auth/logout');
  },
};
