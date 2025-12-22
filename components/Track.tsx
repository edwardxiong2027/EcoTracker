
import React, { useState } from 'react';
import { TransportType, FoodType, EcoLog } from '../types';
import { TRANSPORT_FACTORS, FOOD_FACTORS } from '../constants.tsx';

interface Props {
  onAddLog: (log: EcoLog) => void;
}

const Track: React.FC<Props> = ({ onAddLog }) => {
  const [transport, setTransport] = useState<TransportType>(TransportType.WALK);
  const [distance, setDistance] = useState<number>(0);
  const [food, setFood] = useState<FoodType>(FoodType.VEGAN);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const transportCarbon = distance * TRANSPORT_FACTORS[transport];
    const foodCarbon = FOOD_FACTORS[food];
    const totalCarbon = transportCarbon + foodCarbon;

    const newLog: EcoLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      transport: { type: transport, distanceKm: distance },
      food: food,
      carbonScore: totalCarbon
    };

    setTimeout(() => {
      onAddLog(newLog);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Log Daily Action</h2>
        <p className="text-gray-500 text-sm mb-6">Track your commute and food today to earn points.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transport Section */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Transportation</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(TransportType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransport(type)}
                  className={`py-3 px-1 rounded-2xl text-[10px] font-bold border transition-all ${
                    transport === type 
                      ? 'bg-green-600 text-white border-green-600 shadow-md' 
                      : 'bg-gray-50 text-gray-500 border-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {transport !== TransportType.WALK && transport !== TransportType.BIKE && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-400 mb-2">Distance (km)</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="How many kilometers?"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Food Section */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Food Choice</label>
            <div className="space-y-2">
              {Object.values(FoodType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFood(type)}
                  className={`w-full py-4 px-4 rounded-2xl text-sm font-bold border flex justify-between items-center transition-all ${
                    food === type 
                      ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' 
                      : 'bg-gray-50 text-gray-500 border-gray-100'
                  }`}
                >
                  {type}
                  <span className="text-xs opacity-60">
                    ~{FOOD_FACTORS[type]}kg CO2e
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><span>🌱</span> Submit Log</>
            )}
          </button>
        </form>
      </div>

      {/* Rewards Teaser */}
      <div className="bg-yellow-50 p-4 rounded-3xl border border-yellow-100 flex gap-3">
        <span className="text-2xl">🎁</span>
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Earn Badges!</h4>
          <p className="text-xs text-yellow-700/80">Every log brings you closer to the "Climate Hero" badge.</p>
        </div>
      </div>
    </div>
  );
};

export default Track;
