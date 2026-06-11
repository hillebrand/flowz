import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const TOKEN_KEY = 'flowz_auth_token';

interface AuthState {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  setToken: (token: string, email: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  isLoading: true,

  setToken: async (token, email) => {
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({ token, email }));
    set({ token, email });
  },

  loadToken: async () => {
    try {
      const raw = await SecureStore.getItemAsync(TOKEN_KEY);
      if (raw) {
        const { token, email } = JSON.parse(raw) as { token: string; email: string | null };
        set({ token, email, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, email: null, isLoading: false });
  },
}));
