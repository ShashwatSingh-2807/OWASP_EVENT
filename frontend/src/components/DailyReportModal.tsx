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
    <div role="dialog" aria-modal="true" aria-labelledby="daily-report-heading" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#211713]/80 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#493027] via-[#493027] to-[#211713] border border-[#493027] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F0DFCE] my-8 max-h-[90vh] overflow-y-auto">
        {/* Step 02 Judge Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#493027] flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#A87557]/20 text-[#F0DFCE] border border-[#493027]/40 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              JUDGE DEMO STEP 02 VERIFIED
            </span>
            <h3 id="daily-report-heading" className="text-xs font-semibold text-[#F0DFCE] sm:text-sm">
              Daily P&L & Feedback Audit
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#F0DFCE] font-mono">
            <span>Day {report.day}</span> • <span>{weather.icon} {weather.name}</span>
          </div>
        </div>

        {/* Big Profit / Loss Hero Banner */}
        <div className={`mt-5 p-5 rounded-2xl border text-center relative overflow-hidden ${
          isProfitable
            ? 'bg-gradient-to-r from-[#493027]/60 via-[#76503B] to-[#493027]/60 border-[#493027]/60 shadow-lg'
            : 'bg-gradient-to-r from-[#493027]/60 via-[#76503B] to-[#493027]/60 border-[#493027]/60 shadow-lg'
        }`}>
          <span className="text-xs uppercase tracking-widest text-[#D0A98B] font-semibold block">
            Net Daily Profit
          </span>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-1 flex items-center justify-center gap-2">
            {isProfitable ? (
              <TrendingUp className="w-9 h-9 text-[#F0DFCE] inline" />
            ) : (
              <TrendingDown className="w-9 h-9 text-[#F0DFCE] inline" />
            )}
            <span className={isProfitable ? 'text-[#F0DFCE]' : 'text-[#F0DFCE]'}>
              {isProfitable ? `+₹${report.netProfit.toFixed(2)}` : `-₹${Math.abs(report.netProfit).toFixed(2)}`}
            </span>
          </div>
          <p className="text-xs text-[#D0A98B] mt-2">
            Closing Stall Wallet: <strong className="text-[#F0DFCE] font-mono text-sm">₹{report.closingBudget.toFixed(2)}</strong>
          </p>
        </div>

        {/* Financial Breakdown Grid (STEP 02 REQUIREMENTS) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Revenue */}
          <div className="bg-[#493027]/90 border border-[#493027] rounded-xl p-3 text-center">
            <span className="text-[10px] text-[#D0A98B] uppercase font-semibold block">Gross Revenue</span>
            <span className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">
              ₹{report.grossRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#D0A98B] block mt-0.5">
              {report.cupsSold} cups @ ₹{report.chaiPrice}
            </span>
          </div>

          {/* Ingredient Costs */}
          <div className="bg-[#493027]/90 border border-[#493027] rounded-xl p-3 text-center">
            <span className="text-[10px] text-[#D0A98B] uppercase font-semibold block">Ingredient Cost (COGS)</span>
            <span className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">
              -₹{report.ingredientCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#D0A98B] block mt-0.5">
              Stock consumed
            </span>
          </div>

          {/* Fixed Overhead */}
          <div className="bg-[#493027]/90 border border-[#493027] rounded-xl p-3 text-center">
            <span className="text-[10px] text-[#D0A98B] uppercase font-semibold block">Tapri Overhead</span>
            <span className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono">
              -₹{report.overheadCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#D0A98B] block mt-0.5">
              Rent, cleaning, gas
            </span>
          </div>

          {/* Customer Rating */}
          <div className="bg-[#493027]/90 border border-[#493027] rounded-xl p-3 text-center">
            <span className="text-[10px] text-[#D0A98B] uppercase font-semibold block">Customer Rating</span>
            <span className="text-lg sm:text-xl font-bold text-[#F0DFCE] font-mono flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-[#F0DFCE]" />
              {report.customerRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-[#D0A98B] block mt-0.5">
              Out of 5.0 stars
            </span>
          </div>
        </div>

        {/* Stockout / Demand Gap Alert */}
        {hasLostDemand && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#493027]/40 border border-[#76503B]/40 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-[#F0DFCE] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#F0DFCE]">
                Stockout Bottleneck: Lost {report.cupsLostToStockout} Customers!
              </p>
              <p className="text-[#F0DFCE] mt-0.5">
                Total demand was {report.cupsDemanded} cups, but your stall ran out of <strong>{report.limitingIngredient}</strong>.
                You missed out on an estimated <span className="font-mono font-semibold text-[#F0DFCE]">₹{(report.cupsLostToStockout * report.chaiPrice).toFixed(0)}</span> in potential revenue!
              </p>
            </div>
          </div>
        )}

        {/* Customer Voice & Reviews */}
        <div className="mt-6">
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#F0DFCE] mb-3 flex items-center gap-2">
            <span>Customer Feedback & Street Word of Mouth:</span>
          </h4>

          <div className="space-y-2.5">
            {report.feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-[#493027]/85 border border-[#493027]/80 rounded-xl p-3 flex items-start gap-3"
              >
                <div className="text-2xl p-1.5 rounded-lg bg-[#493027] border border-[#493027] shrink-0">
                  {fb.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-[#F0DFCE]">
                      {fb.name} <span className="text-xs font-normal text-[#D0A98B]">• {fb.role}</span>
                    </p>
                    <div className="flex items-center gap-0.5 text-[#F0DFCE] text-xs">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#F0DFCE] mt-1 italic leading-relaxed">
                    “{fb.comment}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#493027] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Step 03 Quick Trigger Button for Judges */}
          {!gameState.shock.triggered && (
            <button
              type="button"
              onClick={onTriggerShock}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#D0A98B] hover:bg-[#F0DFCE] active:scale-95 text-[#211713] font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all border border-[#76503B]"
            >
              <Zap className="w-4 h-4 text-[#F0DFCE]" />
              <span>Proceed to STEP 03: Trigger Milk Shock!</span>
            </button>
          )}

          {/* Continue Planning Next Day */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#76503B] hover:bg-[#A87557] active:scale-95 text-[#F0DFCE] font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all border border-[#76503B]/40 ml-auto"
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

