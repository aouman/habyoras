import api from './api';

export interface Collaborator {
  id: number;
  agency_id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export async function getCollaborators(): Promise<Collaborator[]> {
  const { data } = await api.get('my/collaborators');
  return data;
}

export async function generateInviteCode(): Promise<{ invite_code: string; invite_link: string; max_collaborators: number; current_count: number }> {
  const { data } = await api.post('my/collaborators/generate-invite-code', { frontend_url: window.location.origin });
  return data;
}

export async function removeCollaborator(id: number): Promise<void> {
  await api.delete(`my/collaborators/${id}`);
}

export async function registerCollaborator(invite_code: string, name: string, email: string, password: string, password_confirmation: string): Promise<{ collaborator: Collaborator; token: string }> {
  const { data } = await api.post('auth/collaborator/register', {
    invite_code, name, email, password, password_confirmation,
  });
  return data;
}

export async function loginCollaborator(email: string, password: string): Promise<{ collaborator: Collaborator; token: string }> {
  const { data } = await api.post('auth/collaborator/login', { email, password });
  return data;
}
