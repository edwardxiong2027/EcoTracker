
export enum TransportType {
  WALK = 'Walk',
  BIKE = 'Bike',
  BUS = 'Bus',
  TRAIN = 'Train',
  CAR_GAS = 'Gas Car',
  CAR_EV = 'EV',
}

export enum FoodType {
  VEGAN = 'Vegan',
  VEGETARIAN = 'Vegetarian',
  LOW_MEAT = 'Low Meat',
  MEAT_HEAVY = 'Meat Heavy',
}

export interface EcoLog {
  id: string;
  date: string;
  transport: {
    type: TransportType;
    distanceKm: number;
  };
  food: FoodType;
  homeEnergyKwh?: number;
  wasteKg?: number;
  waterLiters?: number;
  carbonScore: number; // in kg CO2e
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  totalPoints: number;
  totalCarbon: number;
  totalLogs: number;
  streak: number;
  lastLogDate: string | null;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
}

export interface EcoAdvice {
  tip: string;
  impactScore: number;
  analysis: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  totalPoints: number;
  totalCarbon: number;
  totalLogs: number;
  streak: number;
  rank: number;
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  reward: number;
  target: number;
  metric: 'logs' | 'transport' | 'food' | 'water';
  transportType?: TransportType;
  foodTypes?: FoodType[];
  icon: string;
}

export type ChallengeStatus = 'available' | 'active' | 'completed';

export interface UserChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  target: number;
  progress: number;
  status: ChallengeStatus;
  metric?: ChallengeConfig['metric'];
  transportType?: TransportType;
  foodTypes?: FoodType[];
  icon: string;
  completedAt?: string | null;
}
