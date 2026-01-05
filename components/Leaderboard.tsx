
import React, { useEffect, useState } from 'react';
import { subscribeToLeaderboard } from '../dataService';
import { LeaderboardEntry } from '../types';

interface Props {
  currentUserId?: string | null;
}

const emojiSet = ['🦊', '🐼', '🐨', '🐯', '🦁', '🦓', '🐸', '🐧', '🦉', '🦋'];

const Leaderboard: React.FC<Props> = ({ currentUserId }) => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToLeaderboard((entries) => {
      setLeaders(entries);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const topThree = leaders.slice(0, 3);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-500">Be the first to log actions and claim the top spot! 🌍</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-1">Campus Ranks</h2>
          <p className="text-sm opacity-80 font-medium">Live points from real users</p>
          
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-4 mt-8">
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-1">🥈</div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border-2 border-white/40">
                    {topThree[1].photoURL ? <img src={topThree[1].photoURL} className="w-full h-full object-cover rounded-full" /> : emojiSet[(topThree[1].rank + 1) % emojiSet.length]}
                  </div>
                  <div className="mt-2 text-xs font-bold">{topThree[1].displayName}</div>
                </div>
              )}
              {topThree[0] && (
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-1">🥇</div>
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-3xl border-4 border-yellow-400">
                    {topThree[0].photoURL ? <img src={topThree[0].photoURL} className="w-full h-full object-cover rounded-full" /> : emojiSet[topThree[0].rank % emojiSet.length]}
                  </div>
                  <div className="mt-2 text-sm font-black">{topThree[0].displayName}</div>
                </div>
              )}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-1">🥉</div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border-2 border-white/40">
                    {topThree[2].photoURL ? <img src={topThree[2].photoURL} className="w-full h-full object-cover rounded-full" /> : emojiSet[(topThree[2].rank + 2) % emojiSet.length]}
                  </div>
                  <div className="mt-2 text-xs font-bold">{topThree[2].displayName}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-2">
          {leaders.map((leader) => (
            <div 
              key={leader.uid} 
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${leader.uid === currentUserId ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 text-center font-bold text-gray-400">#{leader.rank}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl overflow-hidden">
                {leader.photoURL ? (
                  <img src={leader.photoURL} alt={leader.displayName} className="w-full h-full object-cover" />
                ) : (
                  emojiSet[leader.rank % emojiSet.length]
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800">{leader.displayName}</h4>
                <div className="bg-gray-100 w-full h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${Math.min(100, (leader.totalPoints / (leaders[0]?.totalPoints || 1)) * 100)}%` }}></div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {leader.totalLogs} logs • {leader.streak}d streak • {leader.totalCarbon.toFixed(1)}kg CO2e
                </p>
              </div>
              <div className="text-sm font-black text-green-600 text-right">
                {leader.totalPoints} <span className="text-[10px] uppercase font-bold text-gray-400">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 p-4 rounded-3xl text-center">
        <p className="text-xs text-green-700 font-bold">Keep logging to climb the ranks. Team challenges coming soon! 🚀</p>
      </div>
    </div>
  );
};

export default Leaderboard;
