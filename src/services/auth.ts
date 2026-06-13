import api from './api';
import type { AuthUser } from './types';

export async function loginAgency(email: string, password: string): Promise<{ agency: AuthUser; token: string }> {
  const { data } = await api.post('auth/agency/login', { email, password });
  return data;
}

export async function registerAgency(name: string, email: string, password: string, city?: string): Promise<{ agency: AuthUser; token: string }> {
  const { data } = await api.post('auth/agency/register', { name, email, password, city });
  return data;
}

export async function loginAdmin(email: string, password: string): Promise<{ admin: any; token: string }> {
  const { data } = await api.post('auth/admin/login', { email, password });
  return data;
}

export async function meAgency(): Promise<AuthUser> {
  const { data } = await api.get('auth/me');
  return data;
}

export async function logoutAgency(): Promise<void> {
  await api.post('auth/logout');
}

export async function changePassword(current_password: string, new_password: string, new_password_confirmation: string): Promise<void> {
  await api.put('auth/change-password', { current_password, new_password, new_password_confirmation });
}
