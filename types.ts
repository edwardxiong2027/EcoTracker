
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
  carbonScore: number; // in kg CO2e
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  totalPoints: number;
  level: number;
  streak: number;
  badges: Badge[];
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
