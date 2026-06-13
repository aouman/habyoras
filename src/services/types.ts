export interface Agency {
  id: number;
  name: string;
  email: string;
  phone_call: string | null;
  phone_whatsapp: string | null;
  city: string | null;
  description: string | null;
  logo: string | null;
  verified: boolean;
  active: boolean;
  created_at: string;
  properties_count?: number;
  properties?: Property[];
}

export interface Property {
  id: number;
  agency_id: number;
  title: string;
  price: number;
  type: 'Appartement' | 'Villa' | 'Terrain' | 'Bureau' | 'Immeuble';
  transaction: 'Location' | 'Vente';
  city: string;
  commune: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  parking: number;
  furnished: boolean;
  description: string;
  images: string[];
  amenities: string[];
  google_maps_link: string | null;
  status: 'Actif' | 'En pause' | 'Loué' | 'Vendu';
  moderation: 'En attente' | 'Approuvé';
  featured: boolean;
  reported: boolean;
  draft?: boolean;
  views: number;
  rating: number;
  created_at: string;
  agency?: Agency;
  messages?: Message[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  path: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface Message {
  id: number;
  property_id: number;
  agency_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
  property?: Property;
  agency?: Agency;
}

export interface Subscription {
  id: number;
  agency_id: number;
  plan: string;
  amount: string | null;
  max_properties: number | null;
  start_date: string;
  end_date: string | null;
  status: string;
  agency?: Agency;
}

export interface AdminDashboard {
  total_agencies: number;
  total_properties: number;
  total_messages: number;
  active_subscriptions: number;
  reported_properties: number;
  pending_properties: number;
  properties_by_type: { type: string; count: number }[];
  latest_properties: Property[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone_call: string | null;
  phone_whatsapp: string | null;
  city: string | null;
  description: string | null;
  logo: string | null;
  verified: boolean;
  active: boolean;
  created_at: string;
};
