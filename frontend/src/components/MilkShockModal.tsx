'use client';

import React, { useState } from 'react';
import { GameState, ShockDecision } from '../types/game';
import { SHOCK_DECISION_DETAILS } from '../lib/constants';
import {
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Leaf
} from 'lucide-react';

interface MilkShockModalProps {
  isOpen: boolean;
  gameState: GameState;
  onSelectDecision: (decision: ShockDecision) => void;
  onClose: () => void;
}

export default function MilkShockModal({
  isOpen,
  gameState,
  onSelectDecision,
  onClose
}: MilkShockModalProps) {
  const [selected, setSelected] = useState<ShockDecision | null>(gameState.shock.decision);
  const [confirmed, setConfirmed] = useState(gameState.shock.resolved);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onSelectDecision(selected);
    setConfirmed(true);
  };

  const oldPrice = gameState.shock.oldMilkPrice || 60;
  const newPrice = gameState.shock.newMilkPrice || 120;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-stone-900 via-stone-950 to-red-950/40 border-3 border-red-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-6 max-h-[92vh] overflow-y-auto">
        {/* Step 03 & Twist Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/50 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              MINUTE 40 TWIST: SUPPLY SHOCK
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              JUDGE DEMO STEP 03
            </span>
          </div>

          <span className="text-xs text-stone-400 font-mono">
            Event Code: MILK-DOUBLED-2X
          </span>
        </div>

        {/* Breaking News Crisis Banner */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-red-950 via-stone-900 to-red-950 border-2 border-red-600/70 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="text-4xl p-2.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 shrink-0">
                🥛🚨
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                  Breaking Market Crisis
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight mt-0.5">
                  Milk Wholesale Costs Double Overnight!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
                  A sudden statewide fodder shortage and transport strike have shocked dairy supply.
                  Wholesale milk surged from <span className="text-amber-300 font-mono font-bold">₹{oldPrice}/L</span> to{' '}
                  <span className="text-red-400 font-mono font-black text-base">₹{newPrice}/L (+100%)</span>!
                </p>
              </div>
            </div>

            <div className="bg-stone-950/80 border border-red-500/50 rounded-xl p-3 text-center sm:text-right shrink-0">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Old Rate ➔ New Rate</span>
              <span className="text-xl font-mono font-black text-red-400 block">
                ₹{oldPrice} ➔ ₹{newPrice}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">+₹3.00 cost per cup</span>
            </div>
          </div>
        </div>

        {/* Decision Instructions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-base font-bold text-amber-100 flex items-center gap-2">
                <span>Choose Your Stall Strategy:</span>
              </h4>
              <p className="text-xs text-stone-400">
                Evaluate trade-offs between customer loyalty, profit margins, and menu innovation.
              </p>
            </div>
          </div>

          {/* 3 Decision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(SHOCK_DECISION_DETAILS) as ShockDecision[]).map((decKey) => {
              const info = SHOCK_DECISION_DETAILS[decKey];
              const isChosen = selected === decKey;

              return (
                <div
                  key={decKey}
                  onClick={() => !confirmed && setSelected(decKey)}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between relative ${
                    isChosen
                      ? 'bg-amber-950/60 border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                  } ${confirmed && !isChosen ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Option Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{info.icon}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isChosen ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' : 'bg-stone-800 text-stone-400 border-stone-700'
                    }`}>
                      {info.badge}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-base text-stone-100 leading-snug">
                      {info.title}
                    </h5>
                    <p className="text-xs text-amber-300 font-medium mt-1">
                      {info.tagline}
                    </p>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2 text-emerald-300">
                        <strong>Pros:</strong> {info.pros}
                      </div>
                      <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-2 text-red-300">
                        <strong>Cons:</strong> {info.cons}
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400 font-mono mt-3 pt-2 border-t border-stone-800">
                      💡 {info.mathExplanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-850">
                    <button
                      type="button"
                      disabled={confirmed}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isChosen
                          ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      }`}
                    >
                      {isChosen ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selected Strategy</span>
                        </>
                      ) : (
                        <span>Select Option</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirmation & Bottom Action */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-400 text-center sm:text-left">
            {confirmed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Strategy activated successfully! Changes applied to Day {gameState.day} simulation.
              </span>
            ) : selected ? (
              <span>
                Ready to execute strategy: <strong className="text-amber-300">{SHOCK_DECISION_DETAILS[selected].title}</strong>
              </span>
            ) : (
              <span>Please select one of the 3 strategies above to proceed.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400/40"
              >
                <span>Confirm & Apply Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue to Stall Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

