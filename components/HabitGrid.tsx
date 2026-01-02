
import React, { useState } from 'react';
/* Added CheckSquare to the lucide-react imports */
import { Plus, Trash2, CheckCircle2, XCircle, TrendingUp, CheckSquare } from 'lucide-react';
import { Habit, CompletionData, MonthInfo } from '../types';
import { COLORS, TRACKING_YEAR } from '../constants';

interface HabitGridProps {
  habits: Habit[];
  month: MonthInfo;
  completions: CompletionData;
  onToggle: (habitId: string, dateStr: string) => void;
  onAddHabit: (name: string, emoji: string, color: string) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitGrid: React.FC<HabitGridProps> = ({ 
  habits, month, completions, onToggle, onAddHabit, onDeleteHabit 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const daysArray = Array.from({ length: month.days }, (_, i) => i + 1);

  const handleAdd = () => {
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName, '✨', selectedColor);
    setNewHabitName('');
    setIsAdding(false);
  };

  const getDayCompletion = (habitId: string, day: number) => {
    const dateStr = `${TRACKING_YEAR}-${String(month.monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return completions[habitId]?.[dateStr] || false;
  };

  const calculateStats = (habitId: string) => {
    let completed = 0;
    daysArray.forEach(day => {
      if (getDayCompletion(habitId, day)) completed++;
    });
    const accuracy = (completed / month.days) * 100;
    return { completed, missed: month.days - completed, accuracy };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="sticky left-0 z-20 bg-slate-50/50 w-64 p-4 text-left border-r border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Habit</th>
              {daysArray.map(day => (
                <th key={day} className="p-2 border-r border-slate-100 font-medium text-slate-400 w-10 text-center">{day}</th>
              ))}
              <th className="w-32 p-4 text-left border-l border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stats</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const { completed, missed, accuracy } = calculateStats(habit.id);
              return (
                <tr key={habit.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 p-4 border-r border-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl" style={{ textShadow: `0 0 10px ${habit.color}80` }}>{habit.emoji}</span>
                      <span className="font-semibold text-slate-700 truncate flex-1">{habit.name}</span>
                      <button 
                        onClick={() => onDeleteHabit(habit.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                  {daysArray.map(day => {
                    const isDone = getDayCompletion(habit.id, day);
                    const dateStr = `${TRACKING_YEAR}-${String(month.monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    return (
                      <td key={day} className="p-0 border-r border-slate-100 text-center">
                        <button
                          onClick={() => onToggle(habit.id, dateStr)}
                          className={`w-full h-10 flex items-center justify-center transition-all ${isDone ? 'bg-opacity-40' : 'bg-transparent hover:bg-slate-100/50'}`}
                          style={{ backgroundColor: isDone ? habit.color : undefined }}
                        >
                          {isDone && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-4 border-l border-slate-100">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>{Math.round(accuracy)}%</span>
                        <span className="flex items-center gap-1 text-emerald-500">
                           {completed} <CheckCircle2 size={10} />
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-700 ease-out rounded-full" 
                          style={{ width: `${accuracy}%`, backgroundColor: habit.color }} 
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {habits.length === 0 && (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4 text-slate-300">
              <CheckSquare size={32} />
            </div>
            <p className="text-slate-400 font-medium">No habits yet. Start by adding one below!</p>
          </div>
        )}
      </div>

      <div className="flex justify-start">
        {isAdding ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-lg font-bold mb-4">New Habit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Habit Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Drink water, workout, etc..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Theme Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button 
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === c ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleAdd}
                  className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Create Habit
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div className="w-6 h-6 bg-slate-50 group-hover:bg-indigo-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
              <Plus size={16} />
            </div>
            <span className="font-bold text-slate-600 group-hover:text-slate-800">Add a New Habit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HabitGrid;
