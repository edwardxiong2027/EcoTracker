
import React, { useMemo, useState } from 'react';
import { TransportType, FoodType, EcoLog } from '../types';
import { TRANSPORT_FACTORS, FOOD_FACTORS, ENERGY_FACTOR_PER_KWH, WASTE_FACTOR_PER_KG, WATER_FACTOR_PER_LITER } from '../constants.tsx';

interface Props {
  onAddLog: (log: EcoLog) => Promise<void>;
}

const Track: React.FC<Props> = ({ onAddLog }) => {
  const [transport, setTransport] = useState<TransportType>(TransportType.WALK);
  const [distance, setDistance] = useState<number>(1);
  const [food, setFood] = useState<FoodType>(FoodType.VEGAN);
  const [loading, setLoading] = useState(false);
  const [homeEnergy, setHomeEnergy] = useState<number>(0);
  const [waste, setWaste] = useState<number>(0);
  const [water, setWater] = useState<number>(0);
  const [error, setError] = useState('');

  const presets = [
    { label: 'Dorm Day', transport: TransportType.WALK, distance: 1, food: FoodType.VEGAN, homeEnergy: 6, waste: 0.3, water: 60 },
    { label: 'Commute + Gym', transport: TransportType.TRAIN, distance: 12, food: FoodType.LOW_MEAT, homeEnergy: 8, waste: 0.6, water: 110 },
    { label: 'Road Trip', transport: TransportType.CAR_GAS, distance: 80, food: FoodType.MEAT_HEAVY, homeEnergy: 10, waste: 0.8, water: 120 },
  ];

  const breakdown = useMemo(() => {
    const transportCarbon = distance * TRANSPORT_FACTORS[transport];
    const foodCarbon = FOOD_FACTORS[food];
    const energyCarbon = homeEnergy * ENERGY_FACTOR_PER_KWH;
    const wasteCarbon = waste * WASTE_FACTOR_PER_KG;
    const waterCarbon = water * WATER_FACTOR_PER_LITER;
    const total = transportCarbon + foodCarbon + energyCarbon + wasteCarbon + waterCarbon;
    return {
      transportCarbon,
      foodCarbon,
      energyCarbon,
      wasteCarbon,
      waterCarbon,
      total: Number(total.toFixed(2)),
    };
  }, [distance, food, homeEnergy, transport, waste, water]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newLog: EcoLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      transport: { type: transport, distanceKm: distance },
      food: food,
      homeEnergyKwh: homeEnergy,
      wasteKg: waste,
      waterLiters: water,
      carbonScore: breakdown.total
    };

    try {
      await onAddLog(newLog);
    } catch (err: any) {
      setError(err?.message || 'Unable to save your log right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto space-y-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Log Daily Action</h2>
        <p className="text-gray-500 text-sm mb-6">Track your commute, food, and resources today to earn points.</p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

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
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-400 mb-2">Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="How many kilometers?"
                min="0"
                step="0.1"
              />
              <p className="text-[11px] text-gray-400 mt-1">Counts for all modes (walk, bike, transit, car).</p>
            </div>
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

          {/* Energy & Sustainability */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Home Energy (kWh)</label>
              <input
                type="number"
                value={homeEnergy}
                onChange={(e) => setHomeEnergy(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 6"
                min="0"
              />
              <p className="text-[11px] text-gray-400 mt-1">Grid average: {ENERGY_FACTOR_PER_KWH} kg CO2e/kWh</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Waste (kg)</label>
              <input
                type="number"
                value={waste}
                onChange={(e) => setWaste(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 0.3"
                min="0"
                step="0.1"
              />
              <p className="text-[11px] text-gray-400 mt-1">Lower by composting and recycling.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Water (L)</label>
              <input
                type="number"
                value={water}
                onChange={(e) => setWater(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 60"
                min="0"
              />
              <p className="text-[11px] text-gray-400 mt-1">Showers + dishes count toward conservation.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Carbon Preview</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Transport</span><span>{breakdown.transportCarbon.toFixed(2)} kg</span></div>
                <div className="flex justify-between"><span>Food</span><span>{breakdown.foodCarbon.toFixed(2)} kg</span></div>
                <div className="flex justify-between"><span>Energy</span><span>{breakdown.energyCarbon.toFixed(2)} kg</span></div>
                <div className="flex justify-between"><span>Waste</span><span>{breakdown.wasteCarbon.toFixed(2)} kg</span></div>
                <div className="flex justify-between"><span>Water</span><span>{breakdown.waterCarbon.toFixed(2)} kg</span></div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                <span className="text-lg font-black text-green-600">{breakdown.total} kg</span>
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
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Quick Fills</h4>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTransport(preset.transport);
                  setDistance(preset.distance);
                  setFood(preset.food);
                  setHomeEnergy(preset.homeEnergy);
                  setWaste(preset.waste);
                  setWater(preset.water);
                }}
                className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-100 hover:bg-green-100"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3">Pick a mood to auto-fill typical numbers, then tweak and submit.</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-3xl border border-yellow-100 flex gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h4 className="text-sm font-bold text-yellow-800">Earn Badges!</h4>
            <p className="text-xs text-yellow-700/80">Every log boosts challenges and unlocks XP faster.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
