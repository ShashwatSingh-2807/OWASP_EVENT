'use client';

import React, { useState } from 'react';
import { GameState, InventoryMap } from '../types/game';
import { MENU_ITEMS } from '../lib/constants';
import { calculateMaxBrewableCups } from '../lib/simulationEngine';
import { ShoppingCart, AlertCircle, Sparkles, Check, TrendingUp } from 'lucide-react';

interface InventoryMarketProps {
  gameState: GameState;
  onRestock: (ingredientKey: keyof InventoryMap, quantity: number) => void;
}

export default function InventoryMarket({ gameState, onRestock }: InventoryMarketProps) {
  const currentMenu = MENU_ITEMS[gameState.activeMenu] || MENU_ITEMS.kadak;
  const maxCapacity = calculateMaxBrewableCups(gameState.inventory, currentMenu);
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);

  const handleBuy = (key: keyof InventoryMap, amount: number) => {
    const item = gameState.inventory[key];
    const cost = amount * item.unitCost;
    if (cost > gameState.budget) {
      setPurchaseFeedback(`⚠️ Insufficient budget! Need ₹${cost.toFixed(2)}, have ₹${gameState.budget.toFixed(2)}.`);
      setTimeout(() => setPurchaseFeedback(null), 3000);
      return;
    }

    onRestock(key, amount);
    setPurchaseFeedback(`✓ Restocked +${amount} ${item.unit} of ${item.name} for ₹${cost.toFixed(2)}!`);
    setTimeout(() => setPurchaseFeedback(null), 2500);
  };

  const ingredientsList = Object.entries(gameState.inventory) as [keyof InventoryMap, typeof gameState.inventory['tea_leaves']][];

  return (
    <section className="bg-stone-900/90 border border-amber-600/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Title & Live Capacity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
              <span>Ingredient Inventory & Wholesale Mandi</span>
            </h2>
            <p className="text-xs text-stone-400">
              Manage stock levels, buy supplies, and avoid embarrassing stockouts during rush hours.
            </p>
          </div>
        </div>

        {/* Live Brewable Capacity Badge */}
        <div className="bg-stone-950 border border-amber-500/40 rounded-xl px-4 py-2 flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Max Brewable</p>
            <p className="text-lg font-black text-amber-400 font-mono">
              {maxCapacity.maxCups} <span className="text-xs font-normal text-stone-300">cups</span>
            </p>
          </div>
          <div className="border-l border-stone-800 pl-3">
            <span className="text-[11px] tracking-wide text-stone-400 uppercase font-semibold block">Bottleneck</span>
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400 inline" />
              {maxCapacity.bottleneckName.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Temporary purchase toast feedback */}
      {purchaseFeedback && (
        <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm font-medium text-amber-100 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{purchaseFeedback}</span>
        </div>
      )}

      {/* Ingredient Stock Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-5">
        {ingredientsList.map(([key, item]) => {
          const isBottleneck = maxCapacity.bottleneckIngredient === key;
          const isMilkShock = key === 'milk' && gameState.shock.triggered;
          const maxAffordable = Math.floor(gameState.budget / item.unitCost);

          // Common batch increment values per ingredient
          const increments = key === 'tea_leaves'
            ? [50, 100, 250]
            : key === 'milk'
            ? [2, 5, 10]
            : key === 'sugar'
            ? [1, 2, 5]
            : key === 'spices'
            ? [20, 50, 100]
            : [50, 100, 200];

          return (
            <div
              key={key}
              className={`relative bg-stone-950/70 border rounded-xl p-4 transition-all hover:border-amber-500/50 flex flex-col justify-between ${
                isBottleneck
                  ? 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                  : isMilkShock
                  ? 'border-red-500/70 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'border-stone-800'
              }`}
            >
              {/* Bottleneck Badge */}
              {isBottleneck && (
                <div className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Bottleneck Stock
                </div>
              )}

              {/* Milk Shock Badge */}
              {isMilkShock && (
                <div className="absolute -top-2.5 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                  <TrendingUp className="w-3 h-3" /> Price Doubled!
                </div>
              )}

              <div>
                {/* Item Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-stone-100 text-sm leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-amber-400 font-medium">{item.hindiName}</p>
                    </div>
                  </div>
                </div>

                {/* Stock Level & Wholesale Cost */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 bg-stone-900/80 rounded-lg p-2.5 border border-stone-800/80">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">In Stock</span>
                    <span className="text-base font-bold text-amber-200 font-mono">
                      {item.quantity} <span className="text-xs text-stone-400 font-normal">{item.unit}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Mandi Rate</span>
                    <span className={`text-base font-bold font-mono ${isMilkShock ? 'text-red-400 font-black' : 'text-stone-200'}`}>
                      ₹{item.unitCost.toFixed(2)} <span className="text-xs text-stone-400 font-normal">/{item.unit}</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 mt-2 line-clamp-1 italic">
                  {item.description}
                </p>
              </div>

              {/* Quick Restock Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-850">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1.5">
                  Restock from Wholesale:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {increments.map((inc) => {
                    const cost = inc * item.unitCost;
                    const canAfford = cost <= gameState.budget;
                    return (
                      <button
                        key={inc}
                        type="button"
                        aria-label={`Restock ${item.name}: add ${inc} ${item.unit} for ₹${cost.toFixed(2)}`}
                        onClick={() => handleBuy(key, inc)}
                        disabled={!canAfford}
                        className={`py-1.5 px-1 rounded-md text-xs font-medium text-center transition-all flex flex-col items-center justify-center ${
                          canAfford
                            ? 'bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-200 border border-stone-700 active:scale-95'
                            : 'bg-stone-900/50 text-stone-600 border border-stone-850 cursor-not-allowed opacity-50'
                        }`}
                        title={`Cost: ₹${cost.toFixed(2)}`}
                      >
                        <span className="font-bold">+{inc}</span>
                        <span className="text-[9px] text-stone-400 font-mono">₹{cost.toFixed(0)}</span>
                      </button>
                    );
                  })}

                  {/* Max Button */}
                  <button
                    type="button"
                    aria-label={`Restock ${item.name} with the maximum affordable quantity: ${maxAffordable} ${item.unit}`}
                    onClick={() => {
                      if (maxAffordable > 0) handleBuy(key, maxAffordable);
                    }}
                    disabled={maxAffordable <= 0}
                    className={`py-1.5 px-1 rounded-md text-xs font-semibold text-center transition-all flex flex-col items-center justify-center ${
                      maxAffordable > 0
                        ? 'bg-amber-700/60 hover:bg-amber-600 text-amber-200 border border-amber-600/40 active:scale-95'
                        : 'bg-stone-900/50 text-stone-600 border border-stone-850 cursor-not-allowed opacity-50'
                    }`}
                    title={maxAffordable > 0 ? `Buy max ${maxAffordable} ${item.unit} for ₹${(maxAffordable * item.unitCost).toFixed(2)}` : 'Cannot afford'}
                  >
                    <span>MAX</span>
                    <span className="text-[9px] font-mono">{maxAffordable > 0 ? maxAffordable : '0'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

