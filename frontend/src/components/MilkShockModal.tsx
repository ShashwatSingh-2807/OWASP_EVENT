'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      setSelected(gameState.shock.resolved ? gameState.shock.decision : null);
      setConfirmed(gameState.shock.resolved);
    }
  }, [isOpen, gameState.shock.decision, gameState.shock.resolved]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onSelectDecision(selected);
    setConfirmed(true);
  };

  const oldPrice = gameState.shock.oldMilkPrice || 60;
  const newPrice = gameState.shock.newMilkPrice || 120;

  return (
    <div role="dialog" aria-modal="true" aria-label="Minute 40 milk supply shock decision" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#211713]/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#493027] via-[#493027] to-[#211713] border border-[#76503B] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F0DFCE] my-6 max-h-[92vh] overflow-y-auto">
        {/* Step 03 & Twist Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#76503B] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#A87557]/10 text-[#F0DFCE] border border-[#76503B]/30 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#F0DFCE]" />
              MINUTE 40 TWIST: SUPPLY SHOCK
            </span>
            <span className="text-xs text-[#F0DFCE] font-semibold">
              JUDGE DEMO STEP 03
            </span>
          </div>

          <span className="text-xs text-[#D0A98B] font-mono">
            Event Code: MILK-DOUBLED-2X
          </span>
        </div>

        {/* Breaking News Crisis Banner */}
        <div className="mt-4 p-5 rounded-2xl bg-[#493027]/35 border border-[#76503B]/40 shadow-lg shadow-[#493027]/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="text-4xl p-2.5 rounded-2xl bg-[#A87557]/20 border border-[#76503B]/40 text-[#F0DFCE] shrink-0">
                🥛🚨
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-[#F0DFCE] uppercase tracking-widest block">
                  Breaking Market Crisis
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#F0DFCE] font-serif tracking-tight mt-0.5">
                  Milk Wholesale Costs Double Overnight!
                </h3>
                <p className="text-xs sm:text-sm text-[#F0DFCE] mt-1 max-w-xl leading-relaxed">
                  A sudden statewide fodder shortage and transport strike have shocked dairy supply.
                  Wholesale milk surged from <span className="text-[#F0DFCE] font-mono font-bold">₹{oldPrice}/L</span> to{' '}
                  <span className="text-[#F0DFCE] font-mono font-black text-base">₹{newPrice}/L (+100%)</span>!
                </p>
              </div>
            </div>

            <div className="bg-[#493027]/80 border border-[#76503B]/50 rounded-xl p-3 text-center sm:text-right shrink-0">
              <span className="text-[10px] text-[#D0A98B] uppercase font-semibold block">Old Rate ➔ New Rate</span>
              <span className="text-xl font-mono font-black text-[#F0DFCE] block">
                ₹{oldPrice} ➔ ₹{newPrice}
              </span>
              <span className="text-[10px] text-[#D0A98B] block mt-0.5">+₹3.00 cost per cup</span>
            </div>
          </div>
        </div>

        {/* Decision Instructions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-base font-bold text-[#F0DFCE] flex items-center gap-2">
                <span>Choose Your Stall Strategy:</span>
              </h4>
              <p className="text-xs text-[#D0A98B]">
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
                <button
                  key={decKey}
                  type="button"
                  disabled={confirmed}
                  aria-pressed={isChosen}
                  aria-label={`Select strategy: ${info.title}`}
                  onClick={() => setSelected(decKey)}
                  className={`flex min-h-full w-full flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#76503B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#493027] sm:p-5 ${
                    isChosen
                      ? 'border-[#76503B]/80 bg-[#A87557]/10 shadow-lg shadow-[#493027]/30 ring-1 ring-[#76503B]/30'
                      : 'border-[#76503B]/80 bg-[#493027]/60 hover:-translate-y-0.5 hover:border-[#76503B] hover:bg-[#493027]'
                  } ${confirmed && !isChosen ? 'opacity-55' : ''}`}
                >
                  <span className="mb-3 flex w-full items-center justify-between">
                    <span className="text-2xl">{info.icon}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      isChosen ? 'border-[#76503B]/40 bg-[#A87557]/10 text-[#F0DFCE]' : 'border-[#76503B] bg-[#493027] text-[#D0A98B]'
                    }`}>
                      {info.badge}
                    </span>
                  </span>

                  <span className="block w-full">
                    <span className="block text-base font-bold leading-snug text-[#F0DFCE]">{info.title}</span>
                    <span className="mt-1 block text-xs font-medium leading-relaxed text-[#F0DFCE]">{info.tagline}</span>

                    <span className="mt-3 block space-y-2 text-xs leading-relaxed">
                      <span className="block rounded-lg border border-[#76503B]/25 bg-[#493027]/25 p-3 text-[#F0DFCE]">
                        <strong className="text-[#F0DFCE]">Pros:</strong> {info.pros}
                      </span>
                      <span className="block rounded-lg border border-[#76503B]/25 bg-[#493027]/25 p-3 text-[#F0DFCE]">
                        <strong className="text-[#F0DFCE]">Cons:</strong> {info.cons}
                      </span>
                    </span>

                    <span className="mt-3 block border-t border-[#76503B] pt-3 font-mono text-[11px] leading-relaxed text-[#D0A98B]">
                      💡 {info.mathExplanation}
                    </span>
                  </span>

                  <span className={`mt-4 block w-full rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-colors ${
                    isChosen
                      ? 'border-[#76503B]/40 bg-[#76503B] text-[#F0DFCE]'
                      : 'border-[#76503B] bg-[#493027] text-[#F0DFCE]'
                  }`}>
                    {isChosen ? '✓ Selected strategy' : 'Select this strategy'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirmation & Bottom Action */}
        <div className="mt-6 pt-4 border-t border-[#76503B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div aria-live="polite" className="text-xs leading-relaxed text-[#D0A98B] text-center sm:text-left">
            {confirmed ? (
              <span className="text-[#F0DFCE] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Strategy activated successfully! Changes applied to Day {gameState.day} simulation.
              </span>
            ) : selected ? (
              <span>
                Ready to execute strategy: <strong className="text-[#F0DFCE]">{SHOCK_DECISION_DETAILS[selected].title}</strong>
              </span>
            ) : (
              <span>Please select one of the 3 strategies above to proceed.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!confirmed ? (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selected}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A87557] to-[#A87557] hover:from-[#76503B] hover:to-[#76503B] active:scale-95 text-[#F0DFCE] font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#76503B]/40"
              >
                <span>Confirm & Apply Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#D0A98B] hover:bg-[#F0DFCE] text-[#211713] font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
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

