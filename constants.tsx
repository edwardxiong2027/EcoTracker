
import React from 'react';

export const BADGES_DB = [
  { id: '1', name: 'First Step', icon: '🌱' },
  { id: '2', name: 'Commuter Hero', icon: '🚲' },
  { id: '3', name: 'Plant Powered', icon: '🥗' },
  { id: '4', name: 'Week Streak', icon: '🔥' },
  { id: '5', name: 'Earth Warrior', icon: '🌍' },
];

export const TRANSPORT_FACTORS: Record<string, number> = {
  'Walk': 0,
  'Bike': 0,
  'Bus': 0.089,
  'Train': 0.035,
  'Gas Car': 0.17,
  'EV': 0.05,
};

export const FOOD_FACTORS: Record<string, number> = {
  'Vegan': 1.5,
  'Vegetarian': 2.0,
  'Low Meat': 3.5,
  'Meat Heavy': 7.0,
};
