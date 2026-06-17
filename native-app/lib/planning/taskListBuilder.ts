import type { Task, SessionLog } from '@/types';
import { toLocalDateStr } from '../dateUtils';

type Zone = 'red' | 'orange' | 'green';

function getUrgencyScore(task: Task): number {
  if (!task.deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(task.deadline + 'T00:00:00');
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
  const remaining = Math.max(1, task.sessions_total - task.sessions_done);
  return remaining / Math.max(1, daysUntil);
}

export function isUrgent(task: Task): boolean {
  if (!task.deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(task.deadline + 'T00:00:00');
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
  const remaining = Math.max(0, task.sessions_total - task.sessions_done);
  return daysUntil <= remaining && remaining > 0;
}

function hasSessionToday(taskId: string, sessionsLog: SessionLog[]): boolean {
  const today = toLocalDateStr();
  return sessionsLog.some((s) => s.task_id === taskId && s.date === today);
}

export function buildDailyList(
  tasks: Task[],
  selectedMinutes: number,
  zone: Zone,
  sessionsLog: SessionLog[],
  sessionLengthMin: number = 45,
): Task[] {
  const pending = tasks.filter(
    (t) => t.status !== 'done' && Math.max(0, t.sessions_total - t.sessions_done) > 0,
  );

  // Sort: urgent first, then by urgency score descending
  const sorted = [...pending].sort((a, b) => {
    const aU = isUrgent(a) ? 1 : 0;
    const bU = isUrgent(b) ? 1 : 0;
    if (aU !== bU) return bU - aU;
    return getUrgencyScore(b) - getUrgencyScore(a);
  });

  const result: Task[] = [];
  let accumulated = 0;

  for (const task of sorted) {
    const sessionMin = task.session_duration_min ?? sessionLengthMin;
    const alreadyDone = hasSessionToday(task.id, sessionsLog);

    // Urgent tasks are always included in red zone even if over budget
    if (zone === 'red' && isUrgent(task)) {
      result.push(task);
      if (!alreadyDone) accumulated += sessionMin;
      continue;
    }

    if (accumulated + sessionMin <= selectedMinutes || alreadyDone) {
      result.push(task);
      if (!alreadyDone) accumulated += sessionMin;
    }
  }

  return result;
}
