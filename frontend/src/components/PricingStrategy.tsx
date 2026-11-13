'use client';

import React from 'react';
import { GameState, MenuType } from '../types/game';
import { MENU_ITEMS, WEATHER_PROFILES } from '../lib/constants';
import { calculateUnitIngredientCost, calculateDemand } from '../lib/simulationEngine';
import { Flame, IndianRupee, Play, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface PricingStrategyProps {
  gameState: GameState;
  onSetPrice: (price: number) => void;
  onSelectMenu: (menu: MenuType) => void;
  onStartSimulation: () => void;
}

export default function PricingStrategy({
  gameState,
  onSetPrice,
  onSelectMenu,
  onStartSimulation
}: PricingStrategyProps) {
  const currentMenu = MENU_ITEMS[gameState.activeMenu] || MENU_ITEMS.kadak;
  const unitCost = calculateUnitIngredientCost(gameState.inventory, currentMenu);
  const profitPerCup = Math.max(0, gameState.chaiPrice - unitCost);
  const marginPercentage = gameState.chaiPrice > 0 ? Math.round((profitPerCup / gameState.chaiPrice) * 100) : 0;

  const { demandedCups, priceSensitivity } = calculateDemand(
    gameState.chaiPrice,
    gameState.weather,
    gameState.activeMenu
  );

  const weather = WEATHER_PROFILES[gameState.weather];

  // Common price presets
  const presets = [10, 12, 15, 20, 25, 30];

  return (
    <section className="bg-stone-900/90 border border-amber-600/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-100">
              Pricing & Menu Strategy
            </h2>
            <p className="text-xs text-stone-400">
              Set your cup price, balance profit margins against customer demand, and pick today’s tapri speciality.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
          <span className="text-stone-400">Today’s Forecast:</span>
          <span className="text-amber-300 font-semibold">{weather.icon} {weather.name} ({weather.multiplier}x demand)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left Column: Menu Focus Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <label className="text-xs uppercase tracking-wider font-bold text-stone-300 block">
            Select Stall Speciality Menu:
          </label>

          {(Object.keys(MENU_ITEMS) as MenuType[]).map((menuKey) => {
            const item = MENU_ITEMS[menuKey];
            const isSelected = gameState.activeMenu === menuKey;
            const isMilkFree = item.milkFree;
            const itemCost = calculateUnitIngredientCost(gameState.inventory, item);

            return (
              <div
                key={menuKey}
                onClick={() => onSelectMenu(menuKey)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all relative ${
                  isSelected
                    ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                }`}
              >
                {isMilkFree && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ZERO MILK
                  </span>
                )}

                <div className="flex items-start justify-between pr-14">
                  <div>
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{item.tagline}</p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-800/80">
                  <span className="text-stone-400">
                    Ingredient Cost: <span className="text-stone-200 font-mono font-semibold">₹{itemCost.toFixed(2)}</span>
                  </span>
                  <span className="text-amber-300 font-mono text-[11px]">
                    Default: ₹{item.defaultPrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Price Slider & Live Margin Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-stone-950/60 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            {/* Price Header with Slider */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-300 block">
                  Chai Price Per Cup
                </span>
                <p className="text-xs text-stone-400">Sweet spot is ₹12 - ₹20</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-amber-300 font-mono flex items-center justify-end">
                  <IndianRupee className="w-6 h-6 inline -mr-1" />
                  {gameState.chaiPrice}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="mt-4">
              <input
                type="range"
                min="8"
                max="45"
                step="1"
                value={gameState.chaiPrice}
                onChange={(e) => onSetPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
                <span>₹8 (Budget)</span>
                <span>₹15 (Standard)</span>
                <span>₹25 (Kulhad)</span>
                <span>₹45 (Fancy Tapri)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-stone-400 font-medium">Quick Set:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => onSetPrice(p)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                    gameState.chaiPrice === p
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>

            {/* Live Financial Breakdown Bar */}
            <div className="grid grid-cols-3 gap-2.5 mt-5 bg-stone-900/90 rounded-xl p-3 border border-stone-800">
              <div className="text-center border-r border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Unit Cost (COGS)</span>
                <span className="text-base font-bold text-red-300 font-mono">₹{unitCost.toFixed(2)}</span>
              </div>
              <div className="text-center border-r border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Unit Profit</span>
                <span className="text-base font-bold text-emerald-300 font-mono">₹{profitPerCup.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Gross Margin</span>
                <span className="text-base font-bold text-amber-300 font-mono">{marginPercentage}%</span>
              </div>
            </div>

            {/* Demand & Elasticity Insight */}
            <div className="mt-3.5 p-3 rounded-xl bg-stone-900/50 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-300">
                  Estimated Customer Demand: <strong className="text-amber-200 font-mono">{demandedCups} cups</strong>
                </span>
              </div>
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                priceSensitivity >= 1.0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
              }`}>
                {priceSensitivity >= 1.0 ? 'High Volume' : 'Price Sensitive'}
              </span>
            </div>
          </div>

          {/* Action Trigger: Open Stall & Start Rush Hour */}
          <div className="mt-5 pt-4 border-t border-stone-800">
            <button
              onClick={onStartSimulation}
              disabled={gameState.gameStatus === 'simulating'}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 active:scale-98 text-white font-bold text-base sm:text-lg shadow-xl shadow-amber-900/30 flex items-center justify-center gap-3 transition-all border border-amber-400/40"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Open Chai Stall & Start Day {gameState.day} Sales!</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

