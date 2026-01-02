
import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, CheckSquare, BedDouble, Settings, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit, CompletionData, SleepData } from './types';
import { INITIAL_HABITS, MONTHS, TRACKING_YEAR } from './constants';
import HabitGrid from './components/HabitGrid';
import DashboardView from './components/DashboardView';
import SleepTracker from './components/SleepTracker';

const STORAGE_KEY_HABITS = 'habit_quest_habits';
const STORAGE_KEY_COMPLETIONS = 'habit_quest_completions';
const STORAGE_KEY_SLEEP = 'habit_quest_sleep';

const App: React.FC = () => {
  // State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HABITS);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [completions, setCompletions] = useState<CompletionData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
    return saved ? JSON.parse(saved) : {};
  });
  const [sleepData, setSleepData] = useState<SleepData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SLEEP);
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'sleep'>('tracker');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SLEEP, JSON.stringify(sleepData));
  }, [sleepData]);

  // Handlers
  const toggleCompletion = (habitId: string, dateStr: string) => {
    setCompletions(prev => {
      const habitData = { ...(prev[habitId] || {}) };
      habitData[dateStr] = !habitData[dateStr];
      return { ...prev, [habitId]: habitData };
    });
  };

  const updateSleep = (dateStr: string, hours: number) => {
    setSleepData(prev => ({ ...prev, [dateStr]: hours }));
  };

  const addHabit = (name: string, emoji: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setCompletions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col md:flex-row">
      {/* Sidebar - Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 h-auto md:h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <CheckSquare size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">HabitQuest <span className="text-indigo-500">2026</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tracker' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <CheckSquare size={20} />
            <span>Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'sleep' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BedDouble size={20} />
            <span>Sleep Logs</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Quote of the Day</p>
            <p className="text-sm text-slate-600 italic">"Focus on the process, not the outcome. The score takes care of itself."</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {activeTab === 'tracker' ? 'Daily Tracking' : activeTab === 'dashboard' ? 'Visual Analytics' : 'Sleep Trends'}
            </h2>
            <p className="text-slate-500 mt-1">Consistency is the bridge between goals and accomplishment.</p>
          </div>

          {activeTab === 'tracker' && (
            <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setSelectedMonthIndex(prev => Math.max(0, prev - 1))}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 font-semibold text-slate-700 min-w-[120px] text-center">
                {MONTHS[selectedMonthIndex].name} 2026
              </div>
              <button 
                onClick={() => setSelectedMonthIndex(prev => Math.min(11, prev + 1))}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </header>

        {activeTab === 'tracker' && (
          <HabitGrid 
            habits={habits} 
            month={MONTHS[selectedMonthIndex]} 
            completions={completions} 
            onToggle={toggleCompletion}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            habits={habits} 
            completions={completions} 
            sleepData={sleepData} 
          />
        )}

        {activeTab === 'sleep' && (
          <SleepTracker 
            sleepData={sleepData} 
            onUpdate={updateSleep} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
