import api from './api';
import type { Property, PaginatedResponse } from './types';

export interface PropertyFilters {
  type?: string;
  transaction?: string;
  city?: string;
  min?: number;
  max?: number;
  beds?: number;
  q?: string;
  page?: number;
}

export async function getProperties(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get('properties', { params: filters });
  return data;
}

export async function getProperty(id: number): Promise<Property> {
  const { data } = await api.get(`properties/${id}`);
  return data;
}

export async function getMyProperties(page = 1): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get('my/properties', { params: { page } });
  return data;
}

export async function getDraftProperties(page = 1): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get('my/properties', { params: { page, draft: true } });
  return data;
}

export async function createProperty(formData: FormData | Record<string, any>): Promise<Property> {
  const { data } = await api.post('properties', formData);
  return data;
}

export async function updateProperty(id: number, formData: FormData | Record<string, any>): Promise<Property> {
  const { data } = await api.put(`properties/${id}`, formData);
  return data;
}

export async function deleteProperty(id: number): Promise<void> {
  await api.delete(`properties/${id}`);
}

export async function reportProperty(id: number): Promise<void> {
  await api.post(`properties/${id}/report`);
}

export async function moderateProperty(id: number, moderation: 'En attente' | 'Approuvé'): Promise<Property> {
  const { data } = await api.put(`admin/properties/${id}/moderate`, { moderation });
  return data;
}

export async function getAdminProperties(params: { moderation?: string; reported?: boolean; q?: string; page?: number } = {}): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get('admin/properties', { params });
  return data;
}
