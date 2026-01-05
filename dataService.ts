import { User } from 'firebase/auth';
import { 
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { EcoLog, LeaderboardEntry, UserProfile } from './types';

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
