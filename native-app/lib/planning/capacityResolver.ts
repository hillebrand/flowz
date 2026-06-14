import type { Settings } from '@/types';

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getCapacityForDate(settings: Settings, date: Date): number {
  const dateStr = date.toISOString().slice(0, 10);
  if (dateStr in settings.capacity_overrides) {
    return settings.capacity_overrides[dateStr];
  }
  const dayKey = WEEKDAY_KEYS[date.getDay()];
  return settings.capacity_week[dayKey] ?? 60;
}
