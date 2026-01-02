
export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type CompletionData = Record<string, Record<string, boolean>>; // habitId -> dateStr (YYYY-MM-DD) -> completed

export type SleepData = Record<string, number>; // dateStr -> hours

export interface MonthInfo {
  name: string;
  days: number;
  monthIndex: number; // 0-11
}
