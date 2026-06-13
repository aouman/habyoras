import api from './api';

export interface AgencyStats {
  total_views: number;
  total_properties: number;
  total_messages: number;
  available: number;
  pending: number;
  sold: number;
  top_properties: {
    id: number;
    title: string;
    images: string[] | null;
    views: number;
  }[];
}

export async function getMyStats(): Promise<AgencyStats> {
  const { data } = await api.get('my/stats');
  return data;
}
