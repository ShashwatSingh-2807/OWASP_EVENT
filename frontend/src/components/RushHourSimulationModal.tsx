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
        const next = Math.min(100, prev + 3);
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
    <div role="dialog" aria-modal="true" aria-labelledby="simulation-heading" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211713]/90 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#493027] to-[#211713] border border-[#76503B] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#493027]/10 overflow-hidden text-[#F0DFCE]">
        {/* Decorative Steam / Glow Background */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-[#A87557]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#76503B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#A87557]/30 text-[#F0DFCE] border border-[#76503B]/40 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 id="simulation-heading" className="text-xl sm:text-2xl font-black text-[#F0DFCE] font-serif">
                Simulating Day {finalReport.day} Sales
              </h3>
              <p className="text-xs text-[#D0A98B]">
                Weather: {weather.icon} {weather.name} • Stall Menu: {MENU_ITEMS[finalReport.activeMenu]?.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#493027] hover:bg-[#76503B] text-[#F0DFCE] border border-[#76503B] text-xs font-semibold transition-all active:scale-95"
            title="Skip directly to the Day Report"
          >
            <FastForward className="w-4 h-4 text-[#F0DFCE]" />
            <span>Skip to Report</span>
          </button>
        </div>

        {/* Animated Tapri Rush Visual Scene */}
        <div className="my-6 bg-[#493027]/80 border border-[#76503B] rounded-2xl p-5 text-center relative overflow-hidden">
          {/* Animated Tapri Boiling Kettle Graphic */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-5xl animate-bounce">
              🫖
            </div>
            <div className="text-3xl text-[#F0DFCE] font-mono font-bold animate-pulse">
              ➔ ☕
            </div>
            <div className="text-5xl">
              🧑‍🤝‍🧑
            </div>
          </div>

          {/* Current Rush Shift Banner */}
          <div role="status" aria-live="polite" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A87557]/20 text-[#F0DFCE] border border-[#76503B]/30 text-xs font-semibold mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{activeShift.name}</span>
          </div>
          <p className="text-xs text-[#D0A98B] mt-1 max-w-md mx-auto">
            {activeShift.desc}
          </p>

          {/* Speech Bubble from crowd */}
          <div className="mt-4 p-3 rounded-xl bg-[#493027]/60 border border-[#76503B]/30 inline-block text-xs sm:text-sm text-[#F0DFCE] italic font-medium max-w-lg shadow-md animate-fadeIn">
            {SHOUTOUTS[shoutoutIndex].text}
            <span className="block text-[10px] text-[#F0DFCE]/80 not-italic font-normal mt-0.5">
              — {SHOUTOUTS[shoutoutIndex].author}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#D0A98B] font-medium">
            <span>Stall Progress</span>
            <span className="font-mono">{progress}% Complete</span>
          </div>
          <div
            role="progressbar"
            aria-label="Sales simulation progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="w-full bg-[#493027] h-3 rounded-full overflow-hidden p-0.5 border border-[#76503B]"
          >
            <div
              className="bg-gradient-to-r from-[#A87557] via-[#A87557] to-[#A87557] h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Ticker Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#493027]/90 border border-[#76503B] rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-[#D0A98B] uppercase font-semibold block">Cups Brewed & Sold</span>
            <span className="text-2xl sm:text-3xl font-black text-[#F0DFCE] font-mono">
              {currentCups} <span className="text-sm font-normal text-[#D0A98B]">/ {finalReport.cupsDemanded}</span>
            </span>
          </div>

          <div className="bg-[#493027]/90 border border-[#76503B] rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-[#D0A98B] uppercase font-semibold block">Cash Collected</span>
            <span className="text-2xl sm:text-3xl font-black text-[#F0DFCE] font-mono flex items-center justify-center">
              <IndianRupee className="w-6 h-6 inline -mr-1" />
              {currentRevenue.toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

