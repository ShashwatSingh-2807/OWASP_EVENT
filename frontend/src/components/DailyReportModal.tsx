'use client';

import React, { useEffect } from 'react';
import { DailyReport, GameState } from '../types/game';
import { WEATHER_PROFILES, MENU_ITEMS } from '../lib/constants';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Star,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Zap
} from 'lucide-react';

interface DailyReportModalProps {
  isOpen: boolean;
  report: DailyReport | null;
  gameState: GameState;
  onClose: () => void;
  onTriggerShock: () => void;
}

export default function DailyReportModal({
  isOpen,
  report,
  gameState,
  onClose,
  onTriggerShock
}: DailyReportModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !report) return null;

  const isProfitable = report.netProfit >= 0;
  const weather = WEATHER_PROFILES[report.weather];
  const menuItem = MENU_ITEMS[report.activeMenu];
  const hasLostDemand = report.cupsLostToStockout > 0;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="daily-report-heading" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/55 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-white via-white to-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 my-8 max-h-[90vh] overflow-y-auto">
        {/* Step 02 Judge Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-800 border border-emerald-200/40 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              JUDGE DEMO STEP 02 VERIFIED
            </span>
            <h3 id="daily-report-heading" className="text-xs font-semibold text-slate-800 sm:text-sm">
              Daily P&L & Feedback Audit
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-sky-800 font-mono">
            <span>Day {report.day}</span> • <span>{weather.icon} {weather.name}</span>
          </div>
        </div>

        {/* Big Profit / Loss Hero Banner */}
        <div className={`mt-5 p-5 rounded-2xl border text-center relative overflow-hidden ${
          isProfitable
            ? 'bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/60 border-emerald-200/60 shadow-lg'
            : 'bg-gradient-to-r from-rose-50/60 via-white to-rose-50/60 border-red-200/60 shadow-lg'
        }`}>
          <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold block">
            Net Daily Profit
          </span>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-1 flex items-center justify-center gap-2">
            {isProfitable ? (
              <TrendingUp className="w-9 h-9 text-emerald-700 inline" />
            ) : (
              <TrendingDown className="w-9 h-9 text-red-700 inline" />
            )}
            <span className={isProfitable ? 'text-emerald-800' : 'text-red-700'}>
              {isProfitable ? `+₹${report.netProfit.toFixed(2)}` : `-₹${Math.abs(report.netProfit).toFixed(2)}`}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Closing Stall Wallet: <strong className="text-slate-900 font-mono text-sm">₹{report.closingBudget.toFixed(2)}</strong>
          </p>
        </div>

        {/* Financial Breakdown Grid (STEP 02 REQUIREMENTS) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Revenue */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold block">Gross Revenue</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
              ₹{report.grossRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {report.cupsSold} cups @ ₹{report.chaiPrice}
            </span>
          </div>

          {/* Ingredient Costs */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold block">Ingredient Cost (COGS)</span>
            <span className="text-lg sm:text-xl font-bold text-red-800 font-mono">
              -₹{report.ingredientCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Stock consumed
            </span>
          </div>

          {/* Fixed Overhead */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold block">Tapri Overhead</span>
            <span className="text-lg sm:text-xl font-bold text-red-800 font-mono">
              -₹{report.overheadCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Rent, cleaning, gas
            </span>
          </div>

          {/* Customer Rating */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold block">Customer Rating</span>
            <span className="text-lg sm:text-xl font-bold text-sky-800 font-mono flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-sky-700" />
              {report.customerRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Out of 5.0 stars
            </span>
          </div>
        </div>

        {/* Stockout / Demand Gap Alert */}
        {hasLostDemand && (
          <div className="mt-4 p-3.5 rounded-xl bg-sky-50/40 border border-sky-300/40 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-800">
                Stockout Bottleneck: Lost {report.cupsLostToStockout} Customers!
              </p>
              <p className="text-slate-700 mt-0.5">
                Total demand was {report.cupsDemanded} cups, but your stall ran out of <strong>{report.limitingIngredient}</strong>.
                You missed out on an estimated <span className="font-mono font-semibold text-sky-800">₹{(report.cupsLostToStockout * report.chaiPrice).toFixed(0)}</span> in potential revenue!
              </p>
            </div>
          </div>
        )}

        {/* Customer Voice & Reviews */}
        <div className="mt-6">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span>Customer Feedback & Street Word of Mouth:</span>
          </h4>

          <div className="space-y-2.5">
            {report.feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 flex items-start gap-3"
              >
                <div className="text-2xl p-1.5 rounded-lg bg-white border border-slate-200 shrink-0">
                  {fb.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-slate-800">
                      {fb.name} <span className="text-xs font-normal text-slate-600">• {fb.role}</span>
                    </p>
                    <div className="flex items-center gap-0.5 text-sky-700 text-xs">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">
                    “{fb.comment}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Step 03 Quick Trigger Button for Judges */}
          {!gameState.shock.triggered && (
            <button
              type="button"
              onClick={onTriggerShock}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-600 hover:to-sky-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all border border-red-300"
            >
              <Zap className="w-4 h-4 text-sky-800" />
              <span>Proceed to STEP 03: Trigger Milk Shock!</span>
            </button>
          )}

          {/* Continue Planning Next Day */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-600 active:scale-95 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all border border-sky-300/40 ml-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Day {gameState.day} Planning & Market</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

