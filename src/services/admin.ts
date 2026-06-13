import api from './api';
import type { AdminDashboard, Agency, PaginatedResponse } from './types';

export async function getDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get('admin/dashboard');
  return data;
}

export async function getAdminAgencies(): Promise<Agency[]> {
  const { data } = await api.get('admin/agencies');
  return data;
}
