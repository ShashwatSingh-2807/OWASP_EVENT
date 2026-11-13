'use client';

import React from 'react';
import { GameState } from '../types/game';
import { Sparkles, CheckCircle2, AlertTriangle, FileText, UtensilsCrossed, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface JudgeDemoBarProps {
  gameState: GameState;
  onSimulateStep01: () => void;
  onOpenReportStep02: () => void;
  onTriggerShockStep03: () => void;
  onOpenDocs: () => void;
  onOpenMenu: () => void;
  onResetGame: () => void;
}

export default function JudgeDemoBar({
  gameState,
  onSimulateStep01,
  onOpenReportStep02,
  onTriggerShockStep03,
  onOpenDocs,
  onOpenMenu,
  onResetGame
}: JudgeDemoBarProps) {
  const hasReports = gameState.reports.length > 0;
  const shockTriggered = gameState.shock.triggered;
  const shockResolved = gameState.shock.resolved;

  return (
    <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white border-b border-amber-600/40 shadow-xl px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left Badge: Challenge & Passcode */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-semibold text-xs tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PASSCODE VERIFIED ✓
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MINUTE 40 TWIST UNLOCKED
          </span>
          <span className="text-stone-400 hidden xl:inline font-medium">
            Judge Evaluation & Verification Path:
          </span>
        </div>

        {/* Center: The 3 Mandatory Verification Steps */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* STEP 01 */}
          <button
            onClick={onSimulateStep01}
            disabled={gameState.gameStatus === 'simulating'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-medium text-xs shadow-md transition-all border border-amber-400/30 disabled:opacity-50"
            title="Step 01: Buy stock and simulate one day of sales"
          >
            <Play className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>STEP 01: Simulate Sales</span>
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />

          {/* STEP 02 */}
          <button
            onClick={onOpenReportStep02}
            disabled={!hasReports}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs shadow-md transition-all border ${
              hasReports
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 active:scale-95 ring-1 ring-emerald-400/50'
                : 'bg-stone-800 text-stone-400 border-stone-700 cursor-not-allowed'
            }`}
            title="Step 02: Show the revenue, costs and profit report"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${hasReports ? 'text-emerald-200' : 'text-stone-500'}`} />
            <span>STEP 02: P&L Report {hasReports ? `(Day ${gameState.reports[gameState.reports.length - 1].day})` : ''}</span>
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />

          {/* STEP 03 */}
          <button
            onClick={onTriggerShockStep03}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs shadow-md transition-all border animate-pulse ${
              shockResolved
                ? 'bg-purple-800 text-purple-200 border-purple-500'
                : shockTriggered
                ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400'
                : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border-red-400 active:scale-95'
            }`}
            title="Step 03: Trigger the milk price shock and demonstrate decision options"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            <span>
              STEP 03: {shockResolved ? 'Milk Shock (Resolved ✓)' : shockTriggered ? 'Decide Shock!' : 'Trigger Milk Shock'}
            </span>
          </button>
        </div>

        {/* Right: Quick Docs & Menu buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-medium transition-colors"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Bawaal Menu</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-sky-300 border border-stone-700 text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Docs</span>
          </button>

          <button
            onClick={onResetGame}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 text-xs transition-colors"
            title="Reset Game to Day 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

