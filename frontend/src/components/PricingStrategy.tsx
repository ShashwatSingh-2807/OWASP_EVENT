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
    <section className="bg-gradient-to-br from-white to-slate-50 border border-slate-300/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-600/20 text-sky-700 border border-sky-300/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Pricing & Menu Strategy
            </h2>
            <p className="text-xs text-slate-600">
              Set your cup price, balance profit margins against customer demand, and pick today’s tapri speciality.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-600">Today’s Forecast:</span>
          <span className="text-sky-800 font-semibold">{weather.icon} {weather.name} ({weather.multiplier}x demand)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left Column: Menu Focus Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <label className="text-xs uppercase tracking-wider font-bold text-slate-700 block">
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
                  className={`relative block w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 ${
                    isSelected
                      ? 'border-sky-300/80 bg-sky-600/10 shadow-lg shadow-sky-50/30 ring-1 ring-sky-300/30'
                      : 'border-slate-300/80 bg-slate-50/50 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  {isMilkFree && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-200/30 bg-emerald-600/10 px-2 py-1 text-[11px] font-bold text-emerald-800">
                      <ShieldCheck className="h-3 w-3" /> ZERO MILK
                    </span>
                  )}

                  <span className="block pr-20 sm:pr-24">
                    <span className={`block text-sm font-bold ${isSelected ? 'text-sky-800' : 'text-slate-900'}`}>
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.tagline}</span>
                  </span>

                  <span className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs">
                    <span className="text-slate-600">
                      Ingredient cost <strong className="font-mono font-semibold text-slate-900">₹{itemCost.toFixed(2)}</strong>
                    </span>
                    <span className="font-mono text-sky-800">Default ₹{item.defaultPrice}</span>
                  </span>
                  {isSelected && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-300" /> Currently selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Price Slider & Live Margin Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/60 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            {/* Price Header with Slider */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="chai-price-slider" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Chai Price Per Cup
                </label>
                <p className="mt-1 text-xs text-slate-600">Sweet spot is ₹12 - ₹20</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-sky-800 font-mono flex items-center justify-end">
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
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>₹8 (Budget)</span>
                <span>₹15 (Standard)</span>
                <span>₹25 (Kulhad)</span>
                <span>₹45 (Fancy Tapri)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-slate-600 font-medium">Quick Set:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={gameState.chaiPrice === p}
                  onClick={() => onSetPrice(p)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                    gameState.chaiPrice === p
                      ? 'bg-sky-600 text-slate-950'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>

            {/* Live Financial Breakdown Bar */}
            <div aria-label="Live price breakdown" className="grid grid-cols-3 gap-2.5 mt-5 bg-white/90 rounded-xl p-3.5 border border-slate-200">
              <div className="text-center border-r border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Unit Cost (COGS)</span>
                <span className="text-base font-bold text-red-800 font-mono">₹{unitCost.toFixed(2)}</span>
              </div>
              <div className="text-center border-r border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Unit Profit</span>
                <span className="text-base font-bold text-emerald-800 font-mono">₹{profitPerCup.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Gross Margin</span>
                <span className="text-base font-bold text-sky-800 font-mono">{marginPercentage}%</span>
              </div>
            </div>

            {/* Demand & Elasticity Insight */}
            <div className="mt-3.5 p-3 rounded-xl bg-white/50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="text-slate-700">
                  Estimated Customer Demand: <strong className="text-sky-800 font-mono">{demandedCups} cups</strong>
                </span>
              </div>
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                priceSensitivity >= 1.0 ? 'bg-emerald-600/20 text-emerald-800' : 'bg-sky-600/20 text-sky-800'
              }`}>
                {priceSensitivity >= 1.0 ? 'High Volume' : 'Price Sensitive'}
              </span>
            </div>
          </div>

          {/* Action Trigger: Open Stall & Start Rush Hour */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onStartSimulation}
              disabled={gameState.gameStatus === 'simulating'}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-700 hover:to-blue-700 active:scale-98 text-white font-bold text-base sm:text-lg shadow-xl shadow-sky-50/30 flex items-center justify-center gap-3 transition-all border border-sky-300/40"
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

