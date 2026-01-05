
import React, { useEffect, useMemo, useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { EcoLog, EcoAdvice, UserProfile, UserChallenge, ChallengeConfig } from '../types';
import { getDailyEcoAdvice } from '../geminiService';
import { CHALLENGES } from '../constants.tsx';

interface Props {
  logs: EcoLog[];
  profile: UserProfile | null;
  challenges: UserChallenge[];
  onJoinChallenge: (challenge: ChallengeConfig) => Promise<void>;
  onCompleteChallenge: (challenge: UserChallenge) => Promise<void>;
}

const Dashboard: React.FC<Props> = ({ logs, profile, challenges, onJoinChallenge, onCompleteChallenge }) => {
  const [advice, setAdvice] = useState<EcoAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    if (logs.length > 0) {
      setLoadingAdvice(true);
      getDailyEcoAdvice(logs)
        .then(setAdvice)
        .finally(() => setLoadingAdvice(false));
    }
  }, [logs.length]);

  const totalCarbonValue = profile?.totalCarbon ?? logs.reduce((sum, log) => sum + log.carbonScore, 0);
  const totalLogs = profile?.totalLogs ?? logs.length;
  const totalCarbon = totalCarbonValue.toFixed(1);
  const avgCarbon = totalLogs > 0 ? (totalCarbonValue / totalLogs).toFixed(1) : 0;

  const chartData = logs.slice(0, 7).reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
    carbon: log.carbonScore
  }));

  const totals = useMemo(() => {
    return logs.reduce(
      (acc, log) => {
        acc.energy += log.homeEnergyKwh || 0;
        acc.waste += log.wasteKg || 0;
        acc.water += log.waterLiters || 0;
        return acc;
      },
      { energy: 0, waste: 0, water: 0 }
    );
  }, [logs]);

  const activeUserChallenges = challenges.filter((c) => c.status === 'active');
  const completedChallenges = challenges.filter((c) => c.status === 'completed');
  const availableChallenges = CHALLENGES.filter((c) => !challenges.find((uc) => uc.id === c.id));

  const handleJoin = async (challenge: ChallengeConfig) => {
    setJoiningId(challenge.id);
    try {
      await onJoinChallenge(challenge);
    } finally {
      setJoiningId(null);
    }
  };

  const handleComplete = async (challenge: UserChallenge) => {
    setCompletingId(challenge.id);
    try {
      await onCompleteChallenge(challenge);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Carbon Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Daily Streak</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-1">
                  {profile?.streak || 0} <span className="text-lg">🔥</span>
                </h3>
                <span className="text-xs bg-orange-50 text-orange-600 font-bold px-2 py-1 rounded-full">
                  {profile?.totalPoints ? `${Math.round(profile.totalPoints / 50)} bonus XP` : '+25 XP/day'}
                </span>
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

          {/* Resource Tracker */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-lg">🌊</span> Resource Tracker
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Home Energy</p>
                <p className="text-2xl font-black text-slate-800">{totals.energy.toFixed(1)} kWh</p>
                <p className="text-[11px] text-gray-400 mt-1">Dorm avg ~6 kWh/day.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Waste</p>
                <p className="text-2xl font-black text-slate-800">{totals.waste.toFixed(1)} kg</p>
                <p className="text-[11px] text-gray-400 mt-1">Goal: under 0.5 kg/day.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Water</p>
                <p className="text-2xl font-black text-slate-800">{totals.water.toFixed(0)} L</p>
                <p className="text-[11px] text-gray-400 mt-1">Quick shower ≈ 50–70 L.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-700">My Challenges</h4>
              <p className="text-[11px] text-gray-400">Progress updates when you log matching actions.</p>
            </div>
            {activeUserChallenges.length === 0 && completedChallenges.length === 0 && (
              <p className="text-sm text-gray-500">No active challenges yet. Pick one below!</p>
            )}
            <div className="space-y-3">
              {activeUserChallenges.map((challenge) => {
                const percent = Math.min(100, (challenge.progress / (challenge.target || 1)) * 100);
                const isCompleting = completingId === challenge.id;
                return (
                  <div key={challenge.id} className="flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-gray-800">{challenge.title}</h5>
                        <span className="text-[10px] bg-white text-green-700 font-bold px-2 py-1 rounded-full">Active</span>
                      </div>
                      <p className="text-xs text-gray-500">{challenge.description}</p>
                      <div className="bg-white w-full h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-green-500 h-full transition-all" style={{ width: `${percent}%` }}></div>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{challenge.progress}/{challenge.target} • {challenge.reward} XP</p>
                    </div>
                    <button
                      disabled={isCompleting || percent < 100}
                      onClick={() => handleComplete(challenge)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                        percent < 100
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } ${isCompleting ? 'opacity-70' : ''}`}
                    >
                      {isCompleting ? '...' : percent < 100 ? 'Keep going' : 'Complete'}
                    </button>
                  </div>
                );
              })}
              {completedChallenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-gray-800">{challenge.title}</h5>
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <p className="text-xs text-gray-500">{challenge.description}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{challenge.progress}/{challenge.target} • +{challenge.reward} XP</p>
                  </div>
                  <div className="text-xs font-bold text-green-700">Earned</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-100 space-y-3">
            <h4 className="text-sm font-bold text-gray-700">Available Challenges</h4>
            {availableChallenges.length === 0 && <p className="text-sm text-gray-500">All challenges joined! Check back for new drops.</p>}
            {availableChallenges.map((challenge) => {
              const isJoining = joiningId === challenge.id;
              return (
                <div key={challenge.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl border border-green-100">{challenge.icon}</div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-gray-800">{challenge.title}</h5>
                    <p className="text-xs text-gray-500">{challenge.description}</p>
                    <p className="text-[11px] text-gray-400 mt-1">Reward {challenge.reward} XP</p>
                  </div>
                  <button
                    disabled={isJoining}
                    onClick={() => handleJoin(challenge)}
                    className="text-xs font-bold text-white bg-green-600 px-3 py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
