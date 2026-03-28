import { api } from './api';
import type { LoginPayload, LoginResponse } from 'src/types/auth';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}
