import { create } from 'zustand';

import type { AppData, Settings } from '@/types';

const WORKER_URL = 'https://flowstate-proxy.flowstate-evelien.workers.dev';

interface DataState {
  data: AppData | null;
  isLoading: boolean;
  fetchData: (token: string) => Promise<void>;
  saveData: (data: AppData, token: string) => Promise<void>;
}

const WEEKDAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function migrateSettings(settings: Record<string, unknown>): Settings {
  const defaultWeek: Record<string, number> = {
    monday: 60, tuesday: 60, wednesday: 60, thursday: 60,
    friday: 60, saturday: 120, sunday: 0,
  };

  if ('blocked_days' in settings && !('capacity_week' in settings)) {
    const blocked = settings['blocked_days'] as { recurring?: string[]; specific?: string[] };
    const capacity_week = { ...defaultWeek };
    for (const day of (blocked.recurring ?? [])) {
      if (day in capacity_week) capacity_week[day] = 0;
    }
    const capacity_overrides: Record<string, number> = {};
    for (const date of (blocked.specific ?? [])) {
      capacity_overrides[date] = 0;
    }
    const { blocked_days: _removed, ...rest } = settings as Record<string, unknown>;
    void _removed;
    return { ...(rest as Partial<Settings>), capacity_week, capacity_overrides } as Settings;
  }

  return settings as unknown as Settings;
}

const DEFAULT_SETTINGS: Settings = {
  shortlist_size: 5,
  session_length_min: 45,
  break_length_min: 10,
  reminder_enabled: true,
  reminder_time: '18:00',
  magister_connected: false,
  magister_email: null,
  capacity_week: {
    monday: 60, tuesday: 60, wednesday: 60, thursday: 60,
    friday: 60, saturday: 120, sunday: 0,
  },
  capacity_overrides: {},
};

const DEFAULT_DATA: AppData = {
  tasks: [],
  settings: DEFAULT_SETTINGS,
  sessions_log: [],
  study_days: [],
  completed_days: [],
  daily_plans: {},
};

export { WEEKDAY_NAMES, DEFAULT_SETTINGS };

export const useDataStore = create<DataState>((set) => ({
  data: null,
  isLoading: false,

  fetchData: async (token) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${WORKER_URL}/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const raw = (await res.json()) as AppData;
        const migratedSettings = migrateSettings({
          ...DEFAULT_SETTINGS,
          ...(raw.settings as unknown as Record<string, unknown>),
        });
        set({
          data: { ...DEFAULT_DATA, ...raw, settings: migratedSettings },
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
    await fetch(`${WORKER_URL}/data`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
}));
