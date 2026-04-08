import type { AxiosRequestConfig } from 'axios';
import type { InternalSignInFormValues, MeResponse, SignInRequest, SignUpRequest } from '../types';
import apiClient from '@/lib/api/apiClient';
import bffClient from '@/lib/api/bffClient';

export const authService = {
  signIn(credentials: SignInRequest) {
    return bffClient.post('/bff/auth/login', credentials);
  },

  internalSignIn(credentials: InternalSignInFormValues) {
    return bffClient.post('/bff/auth/internal-login', credentials);
  },

  internalOnboarding(data: any) {
    return bffClient.post('/bff/auth/onboarding', data);
  },

  signUp(userData: SignUpRequest) {
    return apiClient.post('/auth/usuario', userData);
  },

  getMe(config?: AxiosRequestConfig) {
    return apiClient.get<MeResponse>('/auth/usuario/me', config);
  },

  logout() {
    return bffClient.post('/bff/auth/logout');
  },
};
