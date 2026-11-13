'use client';

import React from 'react';
import Image from 'next/image';
import { GameState } from '../types/game';
import { WEATHER_PROFILES } from '../lib/constants';
import { Wallet, Star, Calendar, AlertCircle } from 'lucide-react';

interface HeaderProps {
  gameState: GameState;
  onOpenMenu: () => void;
  onOpenDocs: () => void;
}

export default function Header({ gameState, onOpenMenu }: HeaderProps) {
  const weatherInfo = WEATHER_PROFILES[gameState.weather] || WEATHER_PROFILES.sunny;
  const isMilkShocked = gameState.shock.triggered;
  const milkUnitCost = gameState.inventory.milk.unitCost;

  // Calculate average rating from reports or current
  const latestReport = gameState.reports[gameState.reports.length - 1];
  const displayRating = latestReport ? latestReport.customerRating : 4.2;

  return (
    <header className="relative bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 text-white pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-amber-700/50 shadow-xl shadow-black/20 overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Brand identity: Logo + Title */}
        <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open the official Bawaal Chaiwala menu"
            className="group relative flex-shrink-0 rounded-full text-left transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-amber-950"
            title="Open the authentic Bawaal Chaiwala menu"
          >
            <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-amber-400 shadow-lg ring-4 ring-amber-700/40 sm:h-24 sm:w-24">
              <Image
                src="/bawaal-logo.jpg"
                alt="Bawaal Chaiwala Logo"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover group-hover:brightness-110 transition-all"
                priority
              />
            </span>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-full shadow-md">
              Tapri
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 font-serif">
                BAWAAL CHAIWALA
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                v1.0 MVP
              </span>
            </div>
            <p className="text-amber-300/90 text-sm sm:text-base font-medium italic mt-0.5">
              “Swaad aisa jo macha de bawaal!”
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center sm:justify-start text-xs text-stone-300">
              <span className="flex items-center gap-1 text-amber-200">
                ☕ Authentic Mumbai Cutting & Earthen Kulhad Stall Tycoon
              </span>
            </div>
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full lg:w-auto">
          {/* Metric 1: Day */}
          <div className="bg-stone-900/80 backdrop-blur border border-amber-600/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Stall Timeline</p>
              <p className="text-lg sm:text-xl font-bold text-amber-100 font-mono">Day {gameState.day}</p>
            </div>
          </div>

          {/* Metric 2: Wallet Budget */}
          <div className="bg-stone-900/80 backdrop-blur border border-emerald-600/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Available Budget</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-300 font-mono">₹{gameState.budget.toFixed(2)}</p>
            </div>
          </div>

          {/* Metric 3: Weather & Demand */}
          <div className="bg-stone-900/80 backdrop-blur border border-sky-600/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-sky-500/20 text-2xl">
              {weatherInfo.icon}
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Weather Forecast</p>
              <p className="text-sm sm:text-base font-bold text-sky-200 leading-tight">
                {weatherInfo.name}
              </p>
              <span className="text-[10px] text-sky-400 font-mono">
                {weatherInfo.multiplier}x Demand
              </span>
            </div>
          </div>

          {/* Metric 4: Customer Rating & Milk Warning */}
          <div className={`backdrop-blur border rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3 ${
            isMilkShocked
              ? 'bg-red-950/70 border-red-500/50 ring-1 ring-red-500/40'
              : 'bg-stone-900/80 border-amber-600/30'
          }`}>
            <div className={`p-2 sm:p-2.5 rounded-lg ${
              isMilkShocked ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isMilkShocked ? <AlertCircle className="w-5 h-5 text-red-400" /> : <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
            </div>
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                {isMilkShocked ? 'Milk Crisis' : 'Customer Vibe'}
              </p>
              {isMilkShocked ? (
                <p className="text-xs sm:text-sm font-bold text-red-300">
                  Surge: ₹{milkUnitCost}/L!
                </p>
              ) : (
                <p className="text-lg sm:text-xl font-bold text-amber-300 font-mono">
                  {displayRating.toFixed(1)} <span className="text-xs text-stone-400">/ 5.0</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

