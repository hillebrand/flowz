export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  deadline: string;
  sessions_total: number;
  sessions_done: number;
  complexity: 'low' | 'medium' | 'high';
  priority?: 'low' | 'normal' | 'high';
  subtasks: Subtask[];
  materials: string[];
  status: 'pending' | 'in_progress' | 'done';
  source: 'magister' | 'manual';
  magister_id: string | null;
  created_at: string;
  recurring?: boolean;
  recurring_type?: 'daily' | 'interval' | 'weekly';
  recurring_interval?: number;
  last_completed?: string | null;
  session_duration_min?: number;
  task_type?: string;
  type?: string;
}

export interface Settings {
  shortlist_size: number;
  session_length_min: number;
  break_length_min: number;
  reminder_enabled: boolean;
  reminder_time: string;
  magister_connected: boolean;
  magister_email: string | null;
  name?: string;
  capacity_week: Record<string, number>;
  capacity_overrides: Record<string, number>;
}

export interface ZoneThresholds {
  thresholdRed: number;
  thresholdGreen: number;
}

export interface CheckinData {
  energy: 'low' | 'normal' | 'high' | null;
  selectedMinutes: number | null;
  date: string;
}

export interface SessionLog {
  task_id: string;
  date: string;
}

export interface AppData {
  tasks: Task[];
  settings: Settings;
  sessions_log: SessionLog[];
  study_days: string[];
  completed_days: string[];
  daily_plans: Record<string, number>;
}

export interface DailyPlan {
  required: Task[];
  optional: Task | null;
  dailyTarget: number;
  todayAvailable: boolean;
  minutesPlanned: number;
  timeBudget: number;
  timeOverBudget: boolean;
}
