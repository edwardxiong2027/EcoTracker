
import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  signOut 
} from './firebase';
import { EcoLog, UserProfile, UserChallenge, ChallengeConfig } from './types';
import { 
  addEcoLog, 
  ensureUserProfile, 
  subscribeToUserLogs, 
  subscribeToUserProfile,
  subscribeToUserChallenges,
  joinChallenge,
  completeChallenge,
  updateChallengesFromLog,
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'track' | 'rank' | 'profile'>('home');
  const [logs, setLogs] = useState<EcoLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const logUnsubscribe = useRef<Unsubscribe | null>(null);
  const profileUnsubscribe = useRef<Unsubscribe | null>(null);
  const challengeUnsubscribe = useRef<Unsubscribe | null>(null);

  const cleanupSubscriptions = () => {
    logUnsubscribe.current?.();
    profileUnsubscribe.current?.();
    challengeUnsubscribe.current?.();
    logUnsubscribe.current = null;
    profileUnsubscribe.current = null;
    challengeUnsubscribe.current = null;
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
        challengeUnsubscribe.current = subscribeToUserChallenges(currentUser.uid, setChallenges);
      } else {
        setLogs([]);
        setProfile(null);
        setChallenges([]);
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
    await updateChallengesFromLog(user, newLog);
    setActiveTab('home');
  };

  const handleJoinChallenge = async (challenge: ChallengeConfig) => {
    if (!user) return;
    await joinChallenge(user, challenge);
  };

  const handleCompleteChallenge = async (challenge: UserChallenge) => {
    if (!user) return;
    await completeChallenge(user, challenge);
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
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8">
        <div className="flex-1 bg-white shadow-2xl rounded-3xl relative flex flex-col min-h-[80vh]">
          <Header 
            user={user} 
            level={userLevel} 
            activeTab={activeTab}
            onTabChange={setActiveTab} 
            onSignOut={() => signOut(auth)} 
          />

          <main className="p-4 md:p-8 pb-24 overflow-y-auto flex-1">
            {activeTab === 'home' && (
              <Dashboard 
                logs={logs} 
                profile={profile} 
                challenges={challenges}
                onJoinChallenge={handleJoinChallenge}
                onCompleteChallenge={handleCompleteChallenge}
              />
            )}
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
      </div>
      
      {/* Full width footer for the "App" container if desired, 
          but usually apps have the bottom nav. 
          We already have a footer on the Landing page. */}
    </div>
  );
};

export default App;
