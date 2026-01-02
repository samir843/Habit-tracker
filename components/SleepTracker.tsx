
import React, { useState } from 'react';
import { Moon, Sun, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { SleepData } from '../types';
import { TRACKING_YEAR } from '../constants';

interface SleepTrackerProps {
  sleepData: SleepData;
  onUpdate: (dateStr: string, hours: number) => void;
}

const SleepTracker: React.FC<SleepTrackerProps> = ({ sleepData, onUpdate }) => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const getWeekDays = () => {
    const days = [];
    const curr = new Date(currentViewDate);
    const first = curr.getDate() - curr.getDay();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.setDate(first + i));
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const handleUpdateHours = (date: Date, delta: number) => {
    const dateStr = date.toISOString().split('T')[0];
    const current = sleepData[dateStr] || 0;
    const next = Math.max(0, Math.min(24, current + delta));
    onUpdate(dateStr, next);
  };

  const moveWeek = (delta: number) => {
    const next = new Date(currentViewDate);
    next.setDate(next.getDate() + (delta * 7));
    setCurrentViewDate(next);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Moon size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Sleep Wellness</h3>
              <p className="text-indigo-100 opacity-80">Track your rest to power your performance.</p>
            </div>
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1">
            <button onClick={() => moveWeek(-1)} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ArrowLeft size={18} /></button>
            <div className="px-6 font-bold">Week of {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
            <button onClick={() => moveWeek(1)} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date, idx) => {
          const dateStr = date.toISOString().split('T')[0];
          const hours = sleepData[dateStr] || 0;
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div 
              key={idx} 
              className={`bg-white p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 ${isToday ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' : 'border-slate-100 shadow-sm'}`}
            >
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <p className={`text-xl font-bold ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>{date.getDate()}</p>
              </div>

              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-50"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * Math.min(hours, 10) / 10)}
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-black text-slate-800 leading-none">{hours}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">hrs</span>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => handleUpdateHours(date, -0.5)}
                  className="flex-1 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl flex items-center justify-center font-bold transition-colors"
                >
                  -
                </button>
                <button 
                  onClick={() => handleUpdateHours(date, 0.5)}
                  className="flex-1 h-10 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 rounded-xl flex items-center justify-center font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sun size={14} /> Sleep Health Tip
          </div>
          <h4 className="text-2xl font-black text-slate-800">The Power of 8 Hours</h4>
          <p className="text-slate-500 leading-relaxed">
            Consistently sleeping 7-9 hours per night improves cognitive function, emotional regulation, and physical recovery. Use this tracker to identify patterns and optimize your rest cycle for peak performance in 2026.
          </p>
        </div>
        <div className="w-full md:w-64 aspect-square bg-slate-50 rounded-3xl flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
           <Moon size={100} className="text-slate-200 group-hover:text-indigo-200 transition-colors duration-500 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
