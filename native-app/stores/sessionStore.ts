import { create } from 'zustand';

type Zone = 'red' | 'orange' | 'green';

interface SessionState {
  taskId: string | null;
  endTimestamp: number | null;
  selectedMinutes: number;
  selectedZone: Zone;
  checkinDate: string | null;
  startSession: (taskId: string, durationSeconds: number) => void;
  clearSession: () => void;
  setCheckinChoice: (minutes: number, zone: Zone) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  taskId: null,
  endTimestamp: null,
  selectedMinutes: 60,
  selectedZone: 'orange',
  checkinDate: null,
  startSession: (taskId, durationSeconds) =>
    set({ taskId, endTimestamp: Date.now() + durationSeconds * 1000 }),
  clearSession: () => set({ taskId: null, endTimestamp: null }),
  setCheckinChoice: (minutes, zone) =>
    set({
      selectedMinutes: minutes,
      selectedZone: zone,
      checkinDate: new Date().toISOString().slice(0, 10),
    }),
}));
