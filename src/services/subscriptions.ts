import api from './api';
import type { Subscription } from './types';

export async function getSubscriptions(): Promise<Subscription[]> {
  const { data } = await api.get('admin/subscriptions');
  return data;
}

export async function getMySubscription(): Promise<Subscription | null> {
  const { data } = await api.get('my/subscription');
  return data;
}

export async function createSubscription(sub: { agency_id: number; plan: string; amount?: string; max_properties?: number; start_date: string; end_date?: string }): Promise<Subscription> {
  const { data } = await api.post('admin/subscriptions', sub);
  return data;
}

export async function updateSubscription(id: number, sub: { plan?: string; status?: string; end_date?: string }): Promise<Subscription> {
  const { data } = await api.put(`admin/subscriptions/${id}`, sub);
  return data;
}
