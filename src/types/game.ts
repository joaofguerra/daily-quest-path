export type Priority = 'critical' | 'important' | 'normal' | 'optional';
export type Effort = 'quick' | 'medium' | 'large';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  effort: Effort;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface UserProgress {
  id: string;
  level: number;
  currentXP: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  tasksCompleted: number;
  lastActivityDate: Date;
  unlockedThemes: string[];
  activeTheme: string;
  achievements: string[];
}

export interface Combo {
  active: boolean;
  tasksInCombo: number;
  startTime: Date;
  multiplier: number;
  expiresAt: Date;
}

export interface DailyMission {
  id: string;
  date: Date;
  tasks: Task[];
  completed: boolean;
  totalXP: number;
}

export const XP_VALUES: Record<Effort, number> = {
  quick: 10,
  medium: 30,
  large: 70,
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 1,
  important: 2,
  normal: 3,
  optional: 4,
};

export const LEVEL_REQUIREMENTS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250,
  3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450, 11500
];

export function calculateLevelFromXP(totalXP: number): number {
  return LEVEL_REQUIREMENTS.findIndex(req => totalXP < req) - 1 || LEVEL_REQUIREMENTS.length - 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return LEVEL_REQUIREMENTS[currentLevel + 1] || LEVEL_REQUIREMENTS[LEVEL_REQUIREMENTS.length - 1];
}