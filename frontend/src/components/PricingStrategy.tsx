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
    <section className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20">
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

          <div role="group" aria-label="Select stall speciality menu" className="space-y-3">
            {(Object.keys(MENU_ITEMS) as MenuType[]).map((menuKey) => {
              const item = MENU_ITEMS[menuKey];
              const isSelected = gameState.activeMenu === menuKey;
              const isMilkFree = item.milkFree;
              const itemCost = calculateUnitIngredientCost(gameState.inventory, item);

              return (
                <button
                  key={menuKey}
                  type="button"
                  onClick={() => onSelectMenu(menuKey)}
                  aria-pressed={isSelected}
                  className={`relative block w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${
                    isSelected
                      ? 'border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/30'
                      : 'border-stone-700/80 bg-stone-950/50 hover:border-stone-500 hover:bg-stone-900'
                  }`}
                >
                  {isMilkFree && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-300">
                      <ShieldCheck className="h-3 w-3" /> ZERO MILK
                    </span>
                  )}

                  <span className="block pr-20 sm:pr-24">
                    <span className={`block text-sm font-bold ${isSelected ? 'text-amber-200' : 'text-stone-100'}`}>
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-stone-400">{item.tagline}</span>
                  </span>

                  <span className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800 pt-3 text-xs">
                    <span className="text-stone-400">
                      Ingredient cost <strong className="font-mono font-semibold text-stone-100">₹{itemCost.toFixed(2)}</strong>
                    </span>
                    <span className="font-mono text-amber-300">Default ₹{item.defaultPrice}</span>
                  </span>
                  {isSelected && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Currently selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Price Slider & Live Margin Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-stone-950/60 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            {/* Price Header with Slider */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="chai-price-slider" className="block text-xs font-bold uppercase tracking-wider text-stone-200">
                  Chai Price Per Cup
                </label>
                <p className="mt-1 text-xs text-stone-400">Sweet spot is ₹12 - ₹20</p>
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
                id="chai-price-slider"
                type="range"
                aria-label="Chai price per cup"
                aria-valuetext={`₹${gameState.chaiPrice} per cup`}
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
                  type="button"
                  aria-pressed={gameState.chaiPrice === p}
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
            <div aria-label="Live price breakdown" className="grid grid-cols-3 gap-2.5 mt-5 bg-stone-900/90 rounded-xl p-3.5 border border-stone-800">
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
              type="button"
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

