import type { Settings } from '@/types';
import { toLocalDateStr } from '../dateUtils';

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getCapacityForDate(settings: Settings, date: Date): number {
  const dateStr = toLocalDateStr(date);
  if (dateStr in settings.capacity_overrides) {
    return settings.capacity_overrides[dateStr];
  }
  const dayKey = WEEKDAY_KEYS[date.getDay()];
  return settings.capacity_week[dayKey] ?? 60;
}
