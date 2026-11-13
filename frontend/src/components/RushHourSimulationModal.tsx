'use client';

import React, { useEffect, useState } from 'react';
import { GameState, DailyReport } from '../types/game';
import { MENU_ITEMS, WEATHER_PROFILES } from '../lib/constants';
import { Flame, Clock, FastForward, CheckCircle2, IndianRupee } from 'lucide-react';

interface RushHourSimulationModalProps {
  isOpen: boolean;
  gameState: GameState;
  finalReport: DailyReport | null;
  onFinish: () => void;
}

const SHIFTS = [
  { name: 'Morning Rush (08:30 AM)', desc: 'Commuters, auto drivers & office goers grabbing their wake-up cutting.', share: 0.35 },
  { name: 'Afternoon Adda (01:30 PM)', desc: 'Lunch break crowd craving digestive ginger chai.', share: 0.25 },
  { name: 'Evening Peak (05:30 PM)', desc: 'Golden hour tapri adda! Friends gathering for bun-maska & kulhad.', share: 0.40 }
];

const SHOUTOUTS = [
  { text: '“Ek bawaal kadak cutting, bhaiya!”', author: 'Metro Commuter' },
  { text: '“Adrak aur elaichi thoda kadak rakhna!”', author: 'College Student' },
  { text: '“Clay kulhad me pine ka maza hi alag hai!”', author: 'Sharma Ji' },
  { text: '“UPI qr scanner kidhar hai bhai?”', author: 'Techie' },
  { text: '“Swaad aisa jo macha de bawaal!”', author: 'Tapri Regular' }
];

export default function RushHourSimulationModal({
  isOpen,
  gameState,
  finalReport,
  onFinish
}: RushHourSimulationModalProps) {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentShiftIndex, setCurrentShiftIndex] = useState(0);
  const [shoutoutIndex, setShoutoutIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentShiftIndex(0);
      setShoutoutIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 400);
          return 100;
        }
        const next = prev + 3;
        if (next > 65) setCurrentShiftIndex(2);
        else if (next > 30) setCurrentShiftIndex(1);
        else setCurrentShiftIndex(0);

        if (next % 20 === 0) {
          setShoutoutIndex((s) => (s + 1) % SHOUTOUTS.length);
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isOpen, onFinish]);

  if (!isOpen || !finalReport) return null;

  const currentCups = Math.round((progress / 100) * finalReport.cupsSold);
  const currentRevenue = Math.round((progress / 100) * finalReport.grossRevenue);
  const activeShift = SHIFTS[currentShiftIndex];
  const weather = WEATHER_PROFILES[finalReport.weather];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="simulation-heading" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 to-amber-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-white">
        {/* Decorative Steam / Glow Background */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600/30 text-orange-400 border border-orange-500/40 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 id="simulation-heading" className="text-xl sm:text-2xl font-black text-amber-100 font-serif">
                Simulating Day {finalReport.day} Sales
              </h3>
              <p className="text-xs text-stone-400">
                Weather: {weather.icon} {weather.name} • Stall Menu: {MENU_ITEMS[finalReport.activeMenu]?.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-semibold transition-all active:scale-95"
            title="Skip directly to the Day Report"
          >
            <FastForward className="w-4 h-4 text-amber-400" />
            <span>Skip to Report</span>
          </button>
        </div>

        {/* Animated Tapri Rush Visual Scene */}
        <div className="my-6 bg-stone-950/80 border border-stone-800 rounded-2xl p-5 text-center relative overflow-hidden">
          {/* Animated Tapri Boiling Kettle Graphic */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-5xl animate-bounce">
              🫖
            </div>
            <div className="text-3xl text-amber-400 font-mono font-bold animate-pulse">
              ➔ ☕
            </div>
            <div className="text-5xl">
              🧑‍🤝‍🧑
            </div>
          </div>

          {/* Current Rush Shift Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{activeShift.name}</span>
          </div>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            {activeShift.desc}
          </p>

          {/* Speech Bubble from crowd */}
          <div className="mt-4 p-3 rounded-xl bg-amber-950/60 border border-amber-600/30 inline-block text-xs sm:text-sm text-amber-200 italic font-medium max-w-lg shadow-md animate-fadeIn">
            {SHOUTOUTS[shoutoutIndex].text}
            <span className="block text-[10px] text-amber-400/80 not-italic font-normal mt-0.5">
              — {SHOUTOUTS[shoutoutIndex].author}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-stone-400 font-medium">
            <span>Stall Progress</span>
            <span className="font-mono">{progress}% Complete</span>
          </div>
          <div
            role="progressbar"
            aria-label="Sales simulation progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="w-full bg-stone-800 h-3 rounded-full overflow-hidden p-0.5 border border-stone-700"
          >
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Ticker Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-stone-400 uppercase font-semibold block">Cups Brewed & Sold</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {currentCups} <span className="text-sm font-normal text-stone-400">/ {finalReport.cupsDemanded}</span>
            </span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-stone-400 uppercase font-semibold block">Cash Collected</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono flex items-center justify-center">
              <IndianRupee className="w-6 h-6 inline -mr-1" />
              {currentRevenue.toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

