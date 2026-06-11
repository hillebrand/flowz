import { create } from 'zustand';

interface SessionState {
  taskId: string | null;
  endTimestamp: number | null;
  startSession: (taskId: string, durationSeconds: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  taskId: null,
  endTimestamp: null,
  startSession: (taskId, durationSeconds) =>
    set({ taskId, endTimestamp: Date.now() + durationSeconds * 1000 }),
  clearSession: () => set({ taskId: null, endTimestamp: null }),
}));
