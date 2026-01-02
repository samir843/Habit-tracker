
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie 
} from 'recharts';
import { Habit, CompletionData, SleepData } from '../types';
import { MONTHS, TRACKING_YEAR } from '../constants';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';

interface DashboardViewProps {
  habits: Habit[];
  completions: CompletionData;
  sleepData: SleepData;
}

const DashboardView: React.FC<DashboardViewProps> = ({ habits, completions, sleepData }) => {
  
  // 1. Monthly Performance Data
  const monthlyData = MONTHS.map(m => {
    let totalPossible = m.days * habits.length;
    let completedCount = 0;
    
    habits.forEach(h => {
      for (let d = 1; d <= m.days; d++) {
        const dateStr = `${TRACKING_YEAR}-${String(m.monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (completions[h.id]?.[dateStr]) completedCount++;
      }
    });

    const completionRate = totalPossible > 0 ? (completedCount / totalPossible) * 100 : 0;
    
    return {
      name: m.name.substring(0, 3),
      completionRate: Math.round(completionRate),
    };
  });

  // 2. Yearly Total & Accuracy
  let totalCompletions = 0;
  let totalDaysElapsed = 0;
  const today = new Date();
  
  habits.forEach(h => {
    Object.keys(completions[h.id] || {}).forEach(date => {
      if (completions[h.id][date]) totalCompletions++;
    });
  });

  // Rough estimation of elapsed possible completions up to now for current year
  const startOfYear = new Date(TRACKING_YEAR, 0, 1);
  const diffTime = today.getTime() - startOfYear.getTime();
  const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  totalDaysElapsed = diffDays * habits.length;
  const yearlyAccuracy = totalDaysElapsed > 0 ? Math.round((totalCompletions / totalDaysElapsed) * 100) : 0;

  // 3. Sleep Trend Data (Last 14 days)
  const sleepTrend = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr.split('-').slice(1).join('/'),
      hours: sleepData[dateStr] || 0,
    };
  });

  // 4. Habit Breakdown (Pie chart of total contributions)
  const habitBreakdown = habits.map(h => {
    let count = 0;
    Object.values(completions[h.id] || {}).forEach(v => { if (v) count++; });
    return { name: h.name, value: count, color: h.color };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Zap className="text-amber-500" />} 
          title="Yearly Accuracy" 
          value={`${yearlyAccuracy}%`} 
          subtitle="Consistency Score"
        />
        <StatCard 
          icon={<Award className="text-indigo-500" />} 
          title="Total Check-ins" 
          value={totalCompletions.toString()} 
          subtitle="All habits combined"
        />
        <StatCard 
          icon={<Calendar className="text-emerald-500" />} 
          title="Active Habits" 
          value={habits.length.toString()} 
          subtitle="Current tracking goals"
        />
        <StatCard 
          icon={<TrendingUp className="text-rose-500" />} 
          title="Peak Month" 
          value={monthlyData.sort((a,b) => b.completionRate - a.completionRate)[0]?.name || "N/A"} 
          subtitle="Highest performance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Progress Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Monthly Performance</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">2026 Overview</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completionRate > 60 ? '#6366f1' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Habit Distribution</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yearly Volume</span>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={habitBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {habitBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-2">
              {habitBreakdown.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className="text-xs font-medium text-slate-500 truncate">{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sleep Trends Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Sleep Trends (Last 14 Days)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-xs font-medium text-slate-400">Hours Recorded</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtitle: string }> = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
    <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
  </div>
);

export default DashboardView;
