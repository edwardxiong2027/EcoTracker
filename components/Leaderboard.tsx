
import React from 'react';

const Leaderboard: React.FC = () => {
  const leaders = [
    { id: '1', name: 'EcoAlex', points: 2450, avatar: '🦊', rank: 1 },
    { id: '2', name: 'GreenSam', points: 2210, avatar: '🐨', rank: 2 },
    { id: '3', name: 'SustainableMia', points: 1980, avatar: '🐼', rank: 3 },
    { id: '4', name: 'NatureNate', points: 1540, avatar: '🐯', rank: 4 },
    { id: '5', name: 'PlanetPetra', points: 1200, avatar: '🦓', rank: 5 },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-1">Campus Ranks</h2>
          <p className="text-sm opacity-80 font-medium">Top Green Students this week</p>
          
          <div className="flex justify-center items-end gap-4 mt-8">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">🥈</div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border-2 border-white/40">{leaders[1].avatar}</div>
              <div className="mt-2 text-xs font-bold">{leaders[1].name}</div>
            </div>
            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-1">🥇</div>
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-3xl border-4 border-yellow-400">{leaders[0].avatar}</div>
              <div className="mt-2 text-sm font-black">{leaders[0].name}</div>
            </div>
            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">🥉</div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl border-2 border-white/40">{leaders[2].avatar}</div>
              <div className="mt-2 text-xs font-bold">{leaders[2].name}</div>
            </div>
          </div>
        </div>

        <div className="p-2">
          {leaders.map((leader) => (
            <div key={leader.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all">
              <div className="w-6 text-center font-bold text-gray-400">#{leader.rank}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {leader.avatar}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800">{leader.name}</h4>
                <div className="bg-gray-100 w-full h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(leader.points / 2500) * 100}%` }}></div>
                </div>
              </div>
              <div className="text-sm font-black text-green-600">
                {leader.points} <span className="text-[10px] uppercase font-bold text-gray-400">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 p-4 rounded-3xl text-center">
        <p className="text-xs text-green-700 font-bold">You are in the top 15% of your class! 🚀</p>
      </div>
    </div>
  );
};

export default Leaderboard;
