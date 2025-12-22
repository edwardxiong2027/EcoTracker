
import React from 'react';
import { User } from '../firebase';
import { BADGES_DB } from '../constants.tsx';

interface Props {
  user: User;
  logsCount: number;
  onSignOut: () => void;
}

const Profile: React.FC<Props> = ({ user, logsCount, onSignOut }) => {
  const points = logsCount * 125;
  const level = Math.floor(logsCount / 5) + 1;
  const progressToNextLevel = ((logsCount % 5) / 5) * 100;

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-md">
            {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" /> : '👤'}
          </div>
          <div className="absolute bottom-0 right-0 bg-green-600 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold">
            {level}
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user.displayName || 'Eco Explorer'}</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</p>
            <p className="text-xl font-black text-green-600">{points}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logs</p>
            <p className="text-xl font-black text-green-600">{logsCount}</p>
          </div>
        </div>

        <div className="mt-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-gray-500">Progress to Level {level + 1}</p>
            <p className="text-xs font-bold text-green-600">{progressToNextLevel}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${progressToNextLevel}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span>Your Badges</span>
          <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded-full text-gray-500">{Math.min(level, BADGES_DB.length)} / {BADGES_DB.length}</span>
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {BADGES_DB.map((badge, idx) => (
            <div key={badge.id} className="flex flex-col items-center gap-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                idx < level ? 'bg-yellow-100 grayscale-0 border-2 border-yellow-200' : 'bg-gray-100 grayscale opacity-40'
              }`}>
                {badge.icon}
              </div>
              <span className={`text-[9px] font-bold text-center ${idx < level ? 'text-gray-700' : 'text-gray-400'}`}>
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 font-bold py-4 rounded-3xl transition-all"
      >
        Sign Out
      </button>

      <p className="text-center mt-6 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
        EcoTracker v1.0.2 • Build for Earth 🌍
      </p>
    </div>
  );
};

export default Profile;
