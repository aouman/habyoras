import api from './api';
import type { Message, PaginatedResponse } from './types';

export async function sendMessage(msg: { property_id: number; agency_id: number; name?: string; email?: string; phone?: string; message: string }): Promise<Message> {
  const { data } = await api.post('messages', msg);
  return data;
}

export async function getMyMessages(page = 1): Promise<PaginatedResponse<Message>> {
  const { data } = await api.get('my/messages', { params: { page } });
  return data;
}

export async function markMessageRead(id: number): Promise<Message> {
  const { data } = await api.put(`messages/${id}/read`);
  return data;
}

export async function deleteMessage(id: number): Promise<void> {
  await api.delete(`messages/${id}`);
}
