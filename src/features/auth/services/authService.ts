import type { MeResponse, SignInRequest, SignInResponse, SignUpRequest } from '../types';
import apiClient from '@/lib/api/apiClient';

export const authService = {
  signIn(credentials: SignInRequest) {
    return apiClient.post<SignInResponse>('/auth/login', credentials);
  },
  signUp(userData: SignUpRequest) {
    return apiClient.post<void>('/auth/cadastrar', userData);
  },
  getMe() {
    return apiClient.get<MeResponse>('/auth/usuario/me');
  },
};
