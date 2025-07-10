import type { SignInRequest, SignInResponse, SignUpRequest, UserProfile } from '../types';
import { apiClient } from '@/lib/api/apiClient';

export const authService = {
  signIn(credentials: SignInRequest): Promise<SignInResponse> {
    return apiClient.post<SignInResponse>('/auth/signin', credentials);
  },
  signUp(userData: SignUpRequest): Promise<void> {
    return apiClient.post<void>('/auth/signup', userData);
  },
  getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/auth/profile');
  },
};
