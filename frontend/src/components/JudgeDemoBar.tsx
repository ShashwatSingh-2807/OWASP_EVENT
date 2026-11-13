'use client';

import React from 'react';
import { GameState } from '../types/game';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UtensilsCrossed,
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';

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
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-3 py-2 text-slate-900 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/30 bg-emerald-600/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              PASSCODE VERIFIED
            </span>
            <span className="hidden items-center gap-1.5 text-xs text-slate-600 sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-sky-700" />
              Minute 40 twist unlocked
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Bawaal menu"
              className="rounded-lg border border-slate-300 bg-white p-2 text-sky-800 transition-colors hover:bg-slate-100"
            >
              <UtensilsCrossed className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenDocs}
              aria-label="Open project documentation"
              className="rounded-lg border border-slate-300 bg-white p-2 text-sky-800 transition-colors hover:bg-slate-100"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onResetGame}
              aria-label="Reset game"
              title="Reset Game to Day 1"
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav aria-label="Judge verification steps" className="flex w-full items-center gap-1.5 overflow-x-auto pb-0.5 xl:w-auto xl:justify-center">
          <button
            type="button"
            onClick={onSimulateStep01}
            disabled={gameState.gameStatus === 'simulating'}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-sky-300/30 bg-sky-600 px-3 py-2 text-xs font-bold text-slate-950 shadow-sm transition-colors hover:bg-sky-300 disabled:opacity-50"
            title="Step 01: Buy stock and simulate one day of sales"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>01 · Simulate sales</span>
          </button>

          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-600" />

          <button
            type="button"
            onClick={onOpenReportStep02}
            disabled={!hasReports}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              hasReports
                ? 'border-emerald-200/30 bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20'
                : 'cursor-not-allowed border-slate-200 bg-white text-slate-500'
            }`}
            title="Step 02: Show the revenue, costs and profit report"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>02 · P&L report</span>
            {hasReports && <span className="text-[10px] text-emerald-700">Day {gameState.reports[gameState.reports.length - 1].day}</span>}
          </button>

          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-600" />

          <button
            type="button"
            onClick={onTriggerShockStep03}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              shockResolved
                ? 'border-sky-300/30 bg-sky-600/10 text-sky-800 hover:bg-sky-600/20'
                : shockTriggered
                ? 'border-red-300/50 bg-red-600/15 text-red-800 hover:bg-red-600/25'
                : 'border-red-200/40 bg-red-600 text-white hover:bg-red-600'
            }`}
            title="Step 03: Trigger the milk price shock and demonstrate decision options"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>03 · {shockResolved ? 'Shock resolved' : shockTriggered ? 'Decide shock' : 'Milk shock'}</span>
          </button>
        </nav>

        <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-sky-800 transition-colors hover:border-sky-300/40 hover:bg-slate-100"
          >
            <UtensilsCrossed className="h-3.5 w-3.5 text-sky-700" />
            Bawaal menu
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-sky-800 transition-colors hover:border-sky-300/40 hover:bg-slate-100"
          >
            <FileText className="h-3.5 w-3.5 text-sky-700" />
            Docs
          </button>
          <button
            type="button"
            onClick={onResetGame}
            aria-label="Reset game"
            title="Reset Game to Day 1"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
