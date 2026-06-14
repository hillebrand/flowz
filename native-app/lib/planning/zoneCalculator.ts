import type { Task, Settings, ZoneThresholds } from '@/types';
import { getCapacityForDate } from './capacityResolver';

const LOOKAHEAD_DAYS = 14;
const GREEN_MULTIPLIER = 1.25;

export function calculateZones(tasks: Task[], settings: Settings, date: Date): ZoneThresholds {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  // Build a capacity map for the next LOOKAHEAD_DAYS days
  const capacityMap: Record<string, number> = {};
  for (let i = 0; i <= LOOKAHEAD_DAYS; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    capacityMap[key] = getCapacityForDate(settings, d);
  }

  // Find tasks with hard deadlines that need coverage today or soon
  const pendingTasks = tasks.filter(
    (t) => t.status !== 'done' && t.deadline && !t.recurring,
  );

  let thresholdRed = 0;

  for (const task of pendingTasks) {
    const remaining = Math.max(0, task.sessions_total - task.sessions_done);
    if (remaining === 0) continue;

    const deadline = new Date(task.deadline + 'T00:00:00');
    const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
    if (daysUntil < 0) continue;

    const sessionMinutes = task.session_duration_min ?? settings.session_length_min;

    // Count available study days between today and deadline (inclusive of today)
    let availableDays = 0;
    for (let i = 0; i <= Math.min(daysUntil, LOOKAHEAD_DAYS); i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if ((capacityMap[key] ?? 0) > 0) availableDays++;
    }

    if (availableDays === 0) {
      // No available days — all sessions must be done today
      thresholdRed += remaining * sessionMinutes;
      continue;
    }

    // Distribute sessions evenly; if today carries a share, add to red threshold
    const sessionsPerDay = remaining / availableDays;
    const todayCapacity = capacityMap[todayStr] ?? 0;
    if (todayCapacity > 0) {
      thresholdRed += Math.ceil(sessionsPerDay) * sessionMinutes;
    }
  }

  return {
    thresholdRed,
    thresholdGreen: Math.round(thresholdRed * GREEN_MULTIPLIER),
  };
}
