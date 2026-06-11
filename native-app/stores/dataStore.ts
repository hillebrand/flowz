import { create } from 'zustand';

import type { AppData, CheckinData, Settings } from '@/types';

const WORKER_URL = 'https://flowstate-proxy.flowstate-evelien.workers.dev';

interface DataState {
  data: AppData | null;
  checkin: CheckinData | null;
  isLoading: boolean;
  fetchData: (token: string) => Promise<void>;
  saveData: (data: AppData, token: string) => Promise<void>;
  setCheckin: (checkin: CheckinData) => void;
  getTodayCheckin: () => CheckinData | null;
}

const DEFAULT_SETTINGS: Settings = {
  shortlist_size: 5,
  session_length_min: 45,
  break_length_min: 10,
  reminder_enabled: true,
  reminder_time: '18:00',
  magister_connected: false,
  magister_email: null,
  blocked_days: { recurring: ['saturday', 'sunday'], specific: [] },
};

const DEFAULT_DATA: AppData = {
  tasks: [],
  settings: DEFAULT_SETTINGS,
  sessions_log: [],
  study_days: [],
  completed_days: [],
  daily_plans: {},
};

export const useDataStore = create<DataState>((set, get) => ({
  data: null,
  checkin: null,
  isLoading: false,

  fetchData: async (token) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${WORKER_URL}/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as AppData;
        set({
          data: {
            ...DEFAULT_DATA,
            ...data,
            settings: { ...DEFAULT_SETTINGS, ...data.settings },
          },
          isLoading: false,
        });
      } else {
        set({ data: DEFAULT_DATA, isLoading: false });
      }
    } catch {
      set({ data: DEFAULT_DATA, isLoading: false });
    }
  },

  saveData: async (data, token) => {
    set({ data });
    try {
      await fetch(`${WORKER_URL}/data`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Sync failure is non-fatal in the foundation scaffold.
    }
  },

  setCheckin: (checkin) => set({ checkin }),

  getTodayCheckin: () => {
    const today = new Date().toISOString().slice(0, 10);
    const checkin = get().checkin;
    return checkin?.date === today ? checkin : null;
  },
}));
