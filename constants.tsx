
import { TransportType, FoodType, ChallengeConfig } from './types';

export const BADGES_DB = [
  { id: '1', name: 'First Step', icon: '🌱' },
  { id: '2', name: 'Commuter Hero', icon: '🚲' },
  { id: '3', name: 'Plant Powered', icon: '🥗' },
  { id: '4', name: 'Week Streak', icon: '🔥' },
  { id: '5', name: 'Earth Warrior', icon: '🌍' },
];

export const TRANSPORT_FACTORS: Record<string, number> = {
  [TransportType.WALK]: 0,
  [TransportType.BIKE]: 0,
  [TransportType.BUS]: 0.089,
  [TransportType.TRAIN]: 0.035,
  [TransportType.CAR_GAS]: 0.17,
  [TransportType.CAR_EV]: 0.05,
};

export const FOOD_FACTORS: Record<string, number> = {
  [FoodType.VEGAN]: 1.5,
  [FoodType.VEGETARIAN]: 2.0,
  [FoodType.LOW_MEAT]: 3.5,
  [FoodType.MEAT_HEAVY]: 7.0,
};

export const ENERGY_FACTOR_PER_KWH = 0.42; // kg CO2e per kWh (approx grid average)
export const WASTE_FACTOR_PER_KG = 1.8; // kg CO2e per kg waste (landfill impact)
export const WATER_FACTOR_PER_LITER = 0.0003; // kg CO2e per liter of water

export const CHALLENGES: ChallengeConfig[] = [
  {
    id: 'bike-3',
    title: 'Bike to class 3 times',
    description: 'Log 3 bike commutes this week',
    reward: 120,
    target: 3,
    metric: 'transport',
    transportType: TransportType.BIKE,
    icon: '🚲',
  },
  {
    id: 'plant-2',
    title: '2 meatless days',
    description: 'Choose vegan/vegetarian meals twice',
    reward: 90,
    target: 2,
    metric: 'food',
    foodTypes: [FoodType.VEGAN, FoodType.VEGETARIAN],
    icon: '🥗',
  },
  {
    id: 'log-5',
    title: '5 logs this week',
    description: 'Track any actions five times',
    reward: 100,
    target: 5,
    metric: 'logs',
    icon: '🔥',
  },
  {
    id: 'water-200',
    title: 'Save 200L water',
    description: 'Keep showers shorter and log it',
    reward: 110,
    target: 200,
    metric: 'water',
    icon: '💧',
  },
];
