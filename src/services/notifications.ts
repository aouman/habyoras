import api from './api';

export interface Notification {
  id: number;
  message: string;
  active: boolean;
  target_type: 'all' | 'agency' | 'plan';
  target_identifier: string | null;
  created_at: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get('notifications');
  return data;
}

export async function getAdminNotifications(): Promise<Notification[]> {
  const { data } = await api.get('admin/notifications');
  return data;
}

export async function createNotification(message: string, target_type: string, target_identifier?: string): Promise<Notification> {
  const { data } = await api.post('admin/notifications', { message, target_type, target_identifier });
  return data;
}

export async function toggleNotification(id: number): Promise<Notification> {
  const { data } = await api.put(`admin/notifications/${id}`);
  return data;
}

export async function deleteNotification(id: number): Promise<void> {
  await api.delete(`admin/notifications/${id}`);
}

export async function getAgencies(): Promise<{ id: number; name: string }[]> {
  const { data } = await api.get('admin/agencies');
  return data;
}
