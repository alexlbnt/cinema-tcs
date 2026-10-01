import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api';

export interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  loadSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('jwt_token');
      const userData = await SecureStore.getItemAsync('user_data');
      if (token && userData) {
        set({
          token,
          user: JSON.parse(userData),
          isAuthenticated: true,
        });
      }
    } catch {
      // Sessão inválida, ignora
    }
  },

  login: async (email, senha) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login(email, senha);
      const { access_token, user } = data;

      await SecureStore.setItemAsync('jwt_token', access_token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));

      set({ token: access_token, user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (nome, email, senha) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register(nome, email, senha);
      const { access_token, user } = data;

      await SecureStore.setItemAsync('jwt_token', access_token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));

      set({ token: access_token, user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      await authApi.forgotPassword(email);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    await SecureStore.deleteItemAsync('user_data');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
