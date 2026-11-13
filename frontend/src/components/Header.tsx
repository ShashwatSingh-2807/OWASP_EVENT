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
    <header className="relative bg-gradient-to-br from-white via-sky-50 to-slate-50 text-slate-900 pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-sky-200/50 shadow-xl shadow-black/20 overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Brand identity: Logo + Title */}
        <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open the official Bawaal Chaiwala menu"
            className="group relative flex-shrink-0 rounded-full text-left transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-4 focus-visible:ring-offset-sky-100"
            title="Open the authentic Bawaal Chaiwala menu"
          >
            <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-sky-300 shadow-lg ring-4 ring-sky-200/40 sm:h-24 sm:w-24">
              <Image
                src="/bawaal-logo.jpg"
                alt="Bawaal Chaiwala Logo"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover group-hover:brightness-110 transition-all"
                priority
              />
            </span>
            <span className="absolute -bottom-1 -right-1 bg-sky-600 text-slate-950 font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-full shadow-md">
              Tapri
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-50 via-sky-100 to-slate-900 font-serif">
                BAWAAL CHAIWALA
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-600/20 text-sky-800 border border-sky-300/40 font-mono">
                v1.0 MVP
              </span>
            </div>
            <p className="text-sky-800/90 text-sm sm:text-base font-medium italic mt-0.5">
              “Swaad aisa jo macha de bawaal!”
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center sm:justify-start text-xs text-slate-700">
              <span className="flex items-center gap-1 text-sky-800">
                ☕ Authentic Mumbai Cutting & Earthen Kulhad Stall Tycoon
              </span>
            </div>
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full lg:w-auto">
          {/* Metric 1: Day */}
          <div className="bg-white/80 backdrop-blur border border-sky-300/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-sky-600/20 text-sky-700 border border-sky-300/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Stall Timeline</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">Day {gameState.day}</p>
            </div>
          </div>

          {/* Metric 2: Wallet Budget */}
          <div className="bg-white/80 backdrop-blur border border-emerald-300/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-600/20 text-emerald-700 border border-emerald-200/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Available Budget</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-800 font-mono">₹{gameState.budget.toFixed(2)}</p>
            </div>
          </div>

          {/* Metric 3: Weather & Demand */}
          <div className="bg-white/80 backdrop-blur border border-sky-200/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-sky-600/20 text-2xl">
              {weatherInfo.icon}
            </div>
            <div>
              <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Weather Forecast</p>
              <p className="text-sm sm:text-base font-bold text-sky-800 leading-tight">
                {weatherInfo.name}
              </p>
              <span className="text-[10px] text-sky-700 font-mono">
                {weatherInfo.multiplier}x Demand
              </span>
            </div>
          </div>

          {/* Metric 4: Customer Rating & Milk Warning */}
          <div className={`backdrop-blur border rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3 ${
            isMilkShocked
              ? 'bg-rose-50/70 border-red-200/50 ring-1 ring-red-200/40'
              : 'bg-white/80 border-sky-300/30'
          }`}>
            <div className={`p-2 sm:p-2.5 rounded-lg ${
              isMilkShocked ? 'bg-red-600/20 text-red-700' : 'bg-sky-600/20 text-sky-700'
            }`}>
              {isMilkShocked ? <AlertCircle className="w-5 h-5 text-red-700" /> : <Star className="w-5 h-5 text-sky-700 fill-amber-400" />}
            </div>
            <div>
              <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">
                {isMilkShocked ? 'Milk Crisis' : 'Customer Vibe'}
              </p>
              {isMilkShocked ? (
                <p className="text-xs sm:text-sm font-bold text-red-800">
                  Surge: ₹{milkUnitCost}/L!
                </p>
              ) : (
                <p className="text-lg sm:text-xl font-bold text-sky-800 font-mono">
                  {displayRating.toFixed(1)} <span className="text-xs text-slate-600">/ 5.0</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

