import { User } from 'firebase/auth';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  ChallengeConfig,
  EcoLog, 
  LeaderboardEntry, 
  UserChallenge, 
  UserProfile 
} from './types';

const USERS_COLLECTION = 'users';

const getDayKey = (dateString: string) => dateString.slice(0, 10);

const getYesterdayKey = (dayKey: string) => {
  const d = new Date(`${dayKey}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const calculatePoints = (carbonScore: number) => {
  const base = Math.max(10, Math.round((12 - carbonScore) * 12));
  return Math.min(base, 500);
};

export const ensureUserProfile = async (user: User) => {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || 'Eco Explorer',
      photoURL: user.photoURL || '',
      totalCarbon: 0,
      totalLogs: 0,
      totalPoints: 0,
      streak: 0,
      lastLogDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      userRef,
      {
        email: user.email,
        displayName: user.displayName || 'Eco Explorer',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
};

export const addEcoLog = async (user: User, log: EcoLog) => {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const logsRef = collection(db, USERS_COLLECTION, user.uid, 'logs');
  const todayKey = getDayKey(log.date);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const rawData = userSnap.data() as Partial<UserProfile> | undefined;
    const userData: Partial<UserProfile> = rawData || {};
    const lastLogDate = userData.lastLogDate || undefined;

    let streak = userData.streak || 0;
    if (lastLogDate !== todayKey) {
      streak = lastLogDate === getYesterdayKey(todayKey) ? streak + 1 : 1;
    }

    const pointsEarned = calculatePoints(log.carbonScore);
    const totals = {
      totalCarbon: (userData.totalCarbon || 0) + log.carbonScore,
      totalLogs: (userData.totalLogs || 0) + 1,
      totalPoints: (userData.totalPoints || 0) + pointsEarned,
    };

    const logRef = doc(logsRef);
    transaction.set(logRef, {
      ...log,
      id: logRef.id,
      pointsEarned,
      dayKey: todayKey,
      createdAt: serverTimestamp(),
    });

    transaction.set(
      userRef,
      {
        email: user.email,
        displayName: user.displayName || 'Eco Explorer',
        photoURL: user.photoURL || '',
        ...totals,
        streak,
        lastLogDate: todayKey,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
};

export const subscribeToUserProfile = (
  uid: string,
  onChange: (profile: UserProfile | null) => void
): Unsubscribe => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  return onSnapshot(userRef, (snap) => {
    if (!snap.exists()) {
      onChange(null);
      return;
    }
    const data = snap.data() as Partial<UserProfile>;
    onChange({ ...data, uid: snap.id } as UserProfile);
  });
};

export const subscribeToUserLogs = (
  uid: string,
  onChange: (logs: EcoLog[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, USERS_COLLECTION, uid, 'logs'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snap) => {
    const parsed: EcoLog[] = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        date: data.date,
        transport: data.transport || { type: data.transportType, distanceKm: data.distanceKm || 0 },
        food: data.food,
        homeEnergyKwh: data.homeEnergyKwh,
        wasteKg: data.wasteKg,
        waterLiters: data.waterLiters,
        carbonScore: Number(data.carbonScore || 0),
      };
    });
    onChange(parsed);
  });
};

export const subscribeToLeaderboard = (
  onChange: (leaders: LeaderboardEntry[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, USERS_COLLECTION),
    orderBy('totalPoints', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const leaders: LeaderboardEntry[] = snap.docs.map((docSnap, idx) => {
      const data = docSnap.data() as Partial<UserProfile>;
      return {
        uid: docSnap.id,
        displayName: data.displayName || 'Eco Explorer',
        photoURL: data.photoURL || '',
        totalPoints: data.totalPoints || 0,
        totalCarbon: data.totalCarbon || 0,
        totalLogs: data.totalLogs || 0,
        streak: data.streak || 0,
        rank: idx + 1,
      };
    });
    onChange(leaders);
  });
};

export const subscribeToUserChallenges = (
  uid: string,
  onChange: (challenges: UserChallenge[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, USERS_COLLECTION, uid, 'challenges'),
    orderBy('status', 'asc')
  );
  return onSnapshot(q, (snap) => {
    const items: UserChallenge[] = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        reward: data.reward,
        target: data.target,
        progress: data.progress || 0,
        status: data.status,
        metric: data.metric,
        transportType: data.transportType,
        foodTypes: data.foodTypes,
        icon: data.icon,
        completedAt: data.completedAt || null,
      };
    });
    onChange(items);
  });
};

export const joinChallenge = async (user: User, challenge: ChallengeConfig) => {
  const ref = doc(db, USERS_COLLECTION, user.uid, 'challenges', challenge.id);
  await setDoc(ref, {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    reward: challenge.reward,
    target: challenge.target,
    progress: 0,
    status: 'active',
    metric: challenge.metric,
    transportType: challenge.transportType || null,
    foodTypes: challenge.foodTypes || [],
    icon: challenge.icon,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const completeChallenge = async (user: User, challenge: UserChallenge) => {
  if (challenge.status === 'completed') return;
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const challengeRef = doc(db, USERS_COLLECTION, user.uid, 'challenges', challenge.id);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const userData = (userSnap.data() as Partial<UserProfile>) || {};
    const newPoints = (userData.totalPoints || 0) + (challenge.reward || 0);

    transaction.set(challengeRef, {
      ...challenge,
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    transaction.set(userRef, {
      totalPoints: newPoints,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
};

export const incrementChallengeProgress = async (user: User, challengeId: string, amount: number) => {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const challengeRef = doc(db, USERS_COLLECTION, user.uid, 'challenges', challengeId);

  await runTransaction(db, async (transaction) => {
    const challengeSnap = await transaction.get(challengeRef);
    if (!challengeSnap.exists()) return;
    const challengeData = challengeSnap.data() as UserChallenge;

    const previousStatus = challengeData.status;
    const target = challengeData.target || 1;
    const progress = (challengeData.progress || 0) + amount;
    const status = progress >= target ? 'completed' : 'active';

    transaction.set(challengeRef, {
      progress,
      status,
      updatedAt: serverTimestamp(),
      completedAt: status === 'completed' ? serverTimestamp() : challengeData.completedAt || null,
    }, { merge: true });

    if (status === 'completed' && previousStatus !== 'completed') {
      const userSnap = await transaction.get(userRef);
      const userData = (userSnap.data() as Partial<UserProfile>) || {};
      const newPoints = (userData.totalPoints || 0) + (challengeData.reward || 0);
      transaction.set(userRef, { totalPoints: newPoints, updatedAt: serverTimestamp() }, { merge: true });
    }
  });
};

export const updateChallengesFromLog = async (user: User, log: EcoLog) => {
  const activeSnap = await getDocs(
    query(
      collection(db, USERS_COLLECTION, user.uid, 'challenges'),
      where('status', '==', 'active')
    )
  );

  if (activeSnap.empty) return;

  const updates: Promise<void>[] = [];

  activeSnap.forEach((docSnap) => {
    const challenge = docSnap.data() as UserChallenge;
    let amount = 0;

    switch (challenge.metric) {
      case 'logs':
        amount = 1;
        break;
      case 'transport':
        if (challenge.transportType && log.transport?.type === challenge.transportType) {
          amount = 1;
        }
        break;
      case 'food':
        if (challenge.foodTypes?.includes(log.food)) {
          amount = 1;
        }
        break;
      case 'water':
        amount = log.waterLiters || 0;
        break;
      default:
        break;
    }

    if (amount > 0) {
      updates.push(incrementChallengeProgress(user, challenge.id, amount));
    }
  });

  if (updates.length) {
    await Promise.all(updates);
  }
};
