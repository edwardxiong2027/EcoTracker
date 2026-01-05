
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../firebase';

interface Props {
  user: User;
  level: number;
  activeTab: 'home' | 'track' | 'rank' | 'profile';
  onTabChange: (tab: any) => void;
  onSignOut: () => void;
}

const Header: React.FC<Props> = ({ user, level, activeTab, onTabChange, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'track', label: 'Log' },
    { id: 'rank', label: 'Ranks' },
    { id: 'profile', label: 'Profile' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b sticky top-0 z-50">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl font-bold text-green-700 flex items-center gap-2 hover:bg-slate-50 py-1 px-2 rounded-xl transition-colors"
        >
          <span>🌿</span> EcoTracker
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
            </div>
            <div className="p-2">
              <button 
                onClick={() => { onTabChange('profile'); setIsOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl flex items-center gap-3 transition-colors"
              >
                <span>👤</span> Profile
              </button>
              <button 
                onClick={() => { alert('Settings Coming Soon!'); setIsOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl flex items-center gap-3 transition-colors"
              >
                <span>⚙️</span> User Settings
              </button>
              <button 
                onClick={() => { onTabChange('rank'); setIsOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl flex items-center gap-3 transition-colors"
              >
                <span>🌍</span> Campus Stats
              </button>
              <hr className="my-2 border-slate-100" />
              <button 
                onClick={() => { onSignOut(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === tab.id ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-green-100 px-3 py-1 rounded-full text-xs font-bold text-green-700">
          Lv. {level}
        </div>
      </div>
    </header>
  );
};

export default Header;
