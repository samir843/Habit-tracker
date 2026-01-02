
import { MonthInfo, Habit } from './types';

export const TRACKING_YEAR = 2026;

export const MONTHS: MonthInfo[] = [
  { name: 'January', days: 31, monthIndex: 0 },
  { name: 'February', days: 28, monthIndex: 1 },
  { name: 'March', days: 31, monthIndex: 2 },
  { name: 'April', days: 30, monthIndex: 3 },
  { name: 'May', days: 31, monthIndex: 4 },
  { name: 'June', days: 30, monthIndex: 5 },
  { name: 'July', days: 31, monthIndex: 6 },
  { name: 'August', days: 31, monthIndex: 7 },
  { name: 'September', days: 30, monthIndex: 8 },
  { name: 'October', days: 31, monthIndex: 9 },
  { name: 'November', days: 30, monthIndex: 10 },
  { name: 'December', days: 31, monthIndex: 11 },
];

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Morning Meditation', emoji: '🧘', color: '#BDE0FE' },
  { id: '2', name: 'Read 20 Pages', emoji: '📚', color: '#FFC8DD' },
  { id: '3', name: 'Gym Workout', emoji: '💪', color: '#A2D2FF' },
  { id: '4', name: 'Drink 2L Water', emoji: '💧', color: '#CDB4DB' },
  { id: '5', name: 'Sleep by 11 PM', emoji: '🌙', color: '#FFCCBC' },
];

export const COLORS = [
  '#BDE0FE', // Soft blue
  '#FFC8DD', // Soft pink
  '#A2D2FF', // Sky blue
  '#CDB4DB', // Lavender
  '#FFCCBC', // Peach
  '#D4E157', // Lime
  '#E1BEE7', // Light purple
  '#B2DFDB', // Teal
];
