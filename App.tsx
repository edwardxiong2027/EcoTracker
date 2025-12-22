
import React, { useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  signOut 
} from './firebase';
import { EcoLog } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Track from './components/Track';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'track' | 'rank' | 'profile'>('home');
  const [logs, setLogs] = useState<EcoLog[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const savedLogs = localStorage.getItem('eco_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    return () => unsubscribe();
  }, []);

  const handleAddLog = (newLog: EcoLog) => {
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem('eco_logs', JSON.stringify(updatedLogs));
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );
  }

  // Handle Landing Page vs Login vs App
  if (!user) {
    if (showLogin) {
      return (
        <div className="relative">
          <button 
            onClick={() => setShowLogin(false)}
            className="absolute top-6 left-6 z-50 text-slate-500 font-bold hover:text-green-600 transition-colors"
          >
            ← Back
          </button>
          <Login />
        </div>
      );
    }
    return <Landing onStart={() => setShowLogin(true)} />;
  }

  const userLevel = Math.floor(logs.length / 5) + 1;

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-inter">
      <div className="w-full max-w-md mx-auto flex-1 bg-white shadow-2xl relative flex flex-col min-h-screen">
        <Header 
          user={user} 
          level={userLevel} 
          onTabChange={setActiveTab} 
          onSignOut={() => signOut(auth)} 
        />

        <main className="p-4 pb-24 overflow-y-auto flex-1">
          {activeTab === 'home' && <Dashboard logs={logs} />}
          {activeTab === 'track' && <Track onAddLog={handleAddLog} />}
          {activeTab === 'rank' && <Leaderboard />}
          {activeTab === 'profile' && (
            <Profile 
              user={user} 
              logsCount={logs.length} 
              onSignOut={() => signOut(auth)} 
            />
          )}
        </main>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Full width footer for the "App" container if desired, 
          but usually apps have the bottom nav. 
          We already have a footer on the Landing page. */}
    </div>
  );
};

export default App;
