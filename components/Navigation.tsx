
import React from 'react';

interface Props {
  activeTab: 'home' | 'track' | 'rank' | 'profile';
  setActiveTab: (tab: 'home' | 'track' | 'rank' | 'profile') => void;
}

const Navigation: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'track', label: 'Log', icon: '📝' },
    { id: 'rank', label: 'Ranks', icon: '🏆' },
    { id: 'profile', label: 'Me', icon: '👤' },
  ];

  return (
    <nav className="fixed md:hidden bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center py-2 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            activeTab === tab.id ? 'text-green-600 bg-green-50' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-medium mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
