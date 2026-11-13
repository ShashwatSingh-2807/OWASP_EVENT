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
    <header className="relative bg-gradient-to-br from-[#493027] via-[#2B1D17] to-[#211713] text-[#F0DFCE] pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#493027]/50 shadow-xl shadow-black/20 overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A87557]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#A87557]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Brand identity: Logo + Title */}
        <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open the official Bawaal Chaiwala menu"
            className="group relative flex-shrink-0 rounded-full text-left transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#493027] focus-visible:ring-offset-4 focus-visible:ring-offset-[#493027]"
            title="Open the authentic Bawaal Chaiwala menu"
          >
            <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-[#76503B] shadow-lg ring-4 ring-[#493027]/40 sm:h-24 sm:w-24">
              <Image
                src="/bawaal-logo.jpg"
                alt="Bawaal Chaiwala Logo"
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover group-hover:brightness-110 transition-all"
                priority
              />
            </span>
            <span className="absolute -bottom-1 -right-1 bg-[#D0A98B] text-[#211713] font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-full shadow-md">
              Tapri
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#76503B] via-[#A87557] to-[#493027] font-serif">
                BAWAAL CHAIWALA
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-[#A87557]/20 text-[#F0DFCE] border border-[#76503B]/40 font-mono">
                v1.0 MVP
              </span>
            </div>
            <p className="text-[#F0DFCE]/90 text-sm sm:text-base font-medium italic mt-0.5">
              “Swaad aisa jo macha de bawaal!”
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center sm:justify-start text-xs text-[#F0DFCE]">
              <span className="flex items-center gap-1 text-[#F0DFCE]">
                ☕ Authentic Mumbai Cutting & Earthen Kulhad Stall Tycoon
              </span>
            </div>
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full lg:w-auto">
          {/* Metric 1: Day */}
          <div className="bg-[#38261E]/90 backdrop-blur border border-[#76503B]/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[#A87557]/20 text-[#F0DFCE] border border-[#76503B]/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#D0A98B] uppercase tracking-wider font-semibold">Stall Timeline</p>
              <p className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">Day {gameState.day}</p>
            </div>
          </div>

          {/* Metric 2: Wallet Budget */}
          <div className="bg-[#38261E]/90 backdrop-blur border border-[#76503B]/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[#A87557]/20 text-[#F0DFCE] border border-[#493027]/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#D0A98B] uppercase tracking-wider font-semibold">Available Budget</p>
              <p className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">₹{gameState.budget.toFixed(2)}</p>
            </div>
          </div>

          {/* Metric 3: Weather & Demand */}
          <div className="bg-[#38261E]/90 backdrop-blur border border-[#493027]/30 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-[#A87557]/20 text-2xl">
              {weatherInfo.icon}
            </div>
            <div>
              <p className="text-[11px] text-[#D0A98B] uppercase tracking-wider font-semibold">Weather Forecast</p>
              <p className="text-sm sm:text-base font-bold text-[#F0DFCE] leading-tight">
                {weatherInfo.name}
              </p>
              <span className="text-[10px] text-[#F0DFCE] font-mono">
                {weatherInfo.multiplier}x Demand
              </span>
            </div>
          </div>

          {/* Metric 4: Customer Rating & Milk Warning */}
          <div className={`backdrop-blur border rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3 ${
            isMilkShocked
              ? 'bg-[#38261E]/85 border-[#493027]/50 ring-1 ring-[#493027]/40'
              : 'bg-[#38261E]/90 border-[#76503B]/30'
          }`}>
            <div className={`p-2 sm:p-2.5 rounded-lg ${
              isMilkShocked ? 'bg-[#A87557]/20 text-[#F0DFCE]' : 'bg-[#A87557]/20 text-[#F0DFCE]'
            }`}>
              {isMilkShocked ? <AlertCircle className="w-5 h-5 text-[#F0DFCE]" /> : <Star className="w-5 h-5 text-[#F0DFCE] fill-amber-400" />}
            </div>
            <div>
              <p className="text-[11px] text-[#D0A98B] uppercase tracking-wider font-semibold">
                {isMilkShocked ? 'Milk Crisis' : 'Customer Vibe'}
              </p>
              {isMilkShocked ? (
                <p className="text-xs sm:text-sm font-bold text-[#F0DFCE]">
                  Surge: ₹{milkUnitCost}/L!
                </p>
              ) : (
                <p className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">
                  {displayRating.toFixed(1)} <span className="text-xs text-[#D0A98B]">/ 5.0</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

