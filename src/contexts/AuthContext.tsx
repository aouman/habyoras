import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '@/services/auth';
import * as collaboratorService from '@/services/collaborators';
import api from '@/services/api';
import type { AuthUser } from '@/services/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isCollaborator: boolean;
  setUser: (user: AuthUser | null) => void;
  signUp: (name: string, email: string, password: string, city?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInAdmin: (email: string, password: string) => Promise<{ error: string | null }>;
  signInCollaborator: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('auth_role');
    if (token) {
      setIsAdmin(role === 'admin');
      setIsCollaborator(role === 'collaborator');
      if (role === 'agency') {
        api.get('auth/me').then(({ data }) => setUser(data)).catch(() => { clearAuth(); }).finally(() => setLoading(false));
      } else if (role === 'admin') {
        api.get('auth/admin/me').then(({ data }) => setUser(data)).catch(() => { clearAuth(); }).finally(() => setLoading(false));
      } else if (role === 'collaborator') {
        api.get('auth/collaborator/me').then(({ data }) => setUser({ ...data, name: data.agency_name })).catch(() => { clearAuth(); }).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_role');
    setUser(null);
    setIsAdmin(false);
    setIsCollaborator(false);
  };

  const signUp = async (name: string, email: string, password: string, city?: string) => {
    try {
      const data = await authService.registerAgency(name, email, password, city);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.agency));
      localStorage.setItem('auth_role', 'agency');
      setUser(data.agency);
      setIsAdmin(false);
      setIsCollaborator(false);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Erreur d'inscription" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authService.loginAgency(email, password);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.agency));
      localStorage.setItem('auth_role', 'agency');
      setUser(data.agency);
      setIsAdmin(false);
      setIsCollaborator(false);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Email ou mot de passe incorrect' };
    }
  };

  const signInCollaborator = async (email: string, password: string) => {
    try {
      const data = await collaboratorService.loginCollaborator(email, password);
      const collabUser: AuthUser = {
        id: data.collaborator.id,
        name: data.collaborator.name,
        email: data.collaborator.email,
        phone_call: null,
        phone_whatsapp: null,
        city: null,
        description: null,
        logo: null,
        verified: false,
        active: true,
        created_at: data.collaborator.created_at,
      };
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(collabUser));
      localStorage.setItem('auth_role', 'collaborator');
      setUser(collabUser);
      setIsAdmin(false);
      setIsCollaborator(true);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Email ou mot de passe incorrect' };
    }
  };

  const signInAdmin = async (email: string, password: string) => {
    try {
      const data = await authService.loginAdmin(email, password);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.admin));
      localStorage.setItem('auth_role', 'admin');
      setUser(data.admin);
      setIsAdmin(true);
      setIsCollaborator(false);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Email ou mot de passe incorrect' };
    }
  };

  const signOut = async () => {
    const role = localStorage.getItem('auth_role');
    try {
      if (role === 'admin') {
        await api.post('auth/admin/logout');
      } else if (role === 'collaborator') {
        await api.post('auth/collaborator/logout');
      } else {
        await authService.logoutAgency();
      }
    } catch { }
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isCollaborator, setUser, signUp, signIn, signInAdmin, signInCollaborator, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
