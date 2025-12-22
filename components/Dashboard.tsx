
import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { EcoLog, EcoAdvice } from '../types';
import { getDailyEcoAdvice } from '../geminiService';

interface Props {
  logs: EcoLog[];
}

const Dashboard: React.FC<Props> = ({ logs }) => {
  const [advice, setAdvice] = useState<EcoAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (logs.length > 0) {
      setLoadingAdvice(true);
      getDailyEcoAdvice(logs)
        .then(setAdvice)
        .finally(() => setLoadingAdvice(false));
    }
  }, [logs.length]);

  const totalCarbon = logs.reduce((sum, log) => sum + log.carbonScore, 0).toFixed(1);
  const avgCarbon = logs.length > 0 ? (Number(totalCarbon) / logs.length).toFixed(1) : 0;

  const chartData = logs.slice(-7).map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
    carbon: log.carbonScore
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Carbon Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total CO2e</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-bold text-gray-800">{totalCarbon}</h3>
            <span className="text-gray-400 text-sm">kg</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Daily</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-bold text-gray-800">{avgCarbon}</h3>
            <span className="text-gray-400 text-sm">kg</span>
          </div>
        </div>
      </div>

      {/* AI Eco Insight */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-green-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✨</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Eco Insight</span>
          </div>
          {loadingAdvice ? (
            <div className="h-20 flex items-center justify-center">
              <div className="animate-pulse text-sm opacity-70">Calculating your impact...</div>
            </div>
          ) : advice ? (
            <>
              <h4 className="text-xl font-bold leading-tight mb-2">"{advice.tip}"</h4>
              <p className="text-sm opacity-90 font-medium">{advice.analysis}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="bg-white/20 rounded-full h-2 w-full max-w-[100px] overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${advice.impactScore}%` }}></div>
                </div>
                <span className="text-xs font-bold ml-2">Eco Score: {advice.impactScore}</span>
              </div>
            </>
          ) : (
            <p className="text-sm">Log your activities to see personalized tips!</p>
          )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="text-lg">📊</span> Carbon Footprint Trend
        </h4>
        <div className="h-48 w-full">
          {logs.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
                />
                <Area type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No data yet. Start tracking!
            </div>
          )}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700 px-1">Active Challenges</h4>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 text-xl w-12 h-12 flex items-center justify-center rounded-2xl">🚲</div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-gray-800">Bike to Campus</h5>
            <p className="text-xs text-gray-500">Log 3 bike trips this week</p>
          </div>
          <div className="text-xs font-bold text-green-600">+50 XP</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 text-xl w-12 h-12 flex items-center justify-center rounded-2xl">💧</div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-gray-800">No Meat Monday</h5>
            <p className="text-xs text-gray-500">Avoid meat for one full day</p>
          </div>
          <div className="text-xs font-bold text-green-600">+30 XP</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
