import api from './api';
import type { Agency } from './types';

export async function getAgencies(): Promise<Agency[]> {
  const { data } = await api.get('agencies');
  return data;
}

export async function getAgency(id: number): Promise<Agency> {
  const { data } = await api.get(`agencies/${id}`);
  return data;
}

export async function updateProfile(profile: Partial<Agency>): Promise<Agency> {
  const { data } = await api.put('agency/profile', profile);
  return data;
}

export async function toggleAgencyStatus(id: number): Promise<Agency> {
  const { data } = await api.put(`admin/agencies/${id}/toggle-status`);
  return data;
}

export async function toggleAgencyVerification(id: number): Promise<Agency> {
  const { data } = await api.put(`admin/agencies/${id}/toggle-verification`);
  return data;
}
