
import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  signOut 
} from './firebase';
import { EcoLog, UserProfile } from './types';
import { 
  addEcoLog, 
  ensureUserProfile, 
  subscribeToUserLogs, 
  subscribeToUserProfile 
} from './dataService';
import { Unsubscribe } from 'firebase/firestore';
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const logUnsubscribe = useRef<Unsubscribe | null>(null);
  const profileUnsubscribe = useRef<Unsubscribe | null>(null);

  const cleanupSubscriptions = () => {
    logUnsubscribe.current?.();
    profileUnsubscribe.current?.();
    logUnsubscribe.current = null;
    profileUnsubscribe.current = null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      cleanupSubscriptions();

      if (currentUser) {
        void ensureUserProfile(currentUser);
        logUnsubscribe.current = subscribeToUserLogs(currentUser.uid, setLogs);
        profileUnsubscribe.current = subscribeToUserProfile(currentUser.uid, setProfile);
      } else {
        setLogs([]);
        setProfile(null);
      }
    });

    return () => {
      cleanupSubscriptions();
      unsubscribe();
    };
  }, []);

  const handleAddLog = async (newLog: EcoLog) => {
    if (!user) return;
    await addEcoLog(user, newLog);
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

  const totalLogs = profile?.totalLogs || logs.length;
  const userLevel = Math.floor(totalLogs / 5) + 1;

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
          {activeTab === 'home' && <Dashboard logs={logs} profile={profile} />}
          {activeTab === 'track' && <Track onAddLog={handleAddLog} />}
          {activeTab === 'rank' && <Leaderboard currentUserId={user?.uid} />}
          {activeTab === 'profile' && (
            <Profile 
              user={user} 
              profile={profile}
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
