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
    <div className="sticky top-0 z-40 border-b border-[#76503B]/80 bg-[#211713]/95 px-3 py-2 text-[#F0DFCE] shadow-lg shadow-black/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#493027]/30 bg-[#A87557]/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#F0DFCE]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              PASSCODE VERIFIED
            </span>
            <span className="hidden items-center gap-1.5 text-xs text-[#D0A98B] sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-[#F0DFCE]" />
              Minute 40 twist unlocked
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Bawaal menu"
              className="rounded-lg border border-[#76503B] bg-[#493027] p-2 text-[#F0DFCE] transition-colors hover:bg-[#493027]"
            >
              <UtensilsCrossed className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenDocs}
              aria-label="Open project documentation"
              className="rounded-lg border border-[#76503B] bg-[#493027] p-2 text-[#F0DFCE] transition-colors hover:bg-[#493027]"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onResetGame}
              aria-label="Reset game"
              title="Reset Game to Day 1"
              className="rounded-lg border border-[#76503B] bg-[#493027] p-2 text-[#D0A98B] transition-colors hover:bg-[#493027] hover:text-[#F0DFCE]"
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
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#76503B]/30 bg-[#A87557] px-3 py-2 text-xs font-bold text-[#F0DFCE] shadow-sm transition-colors hover:bg-[#D0A98B] disabled:opacity-50"
            title="Step 01: Buy stock and simulate one day of sales"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>01 · Simulate sales</span>
          </button>

          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#D0A98B]" />

          <button
            type="button"
            onClick={onOpenReportStep02}
            disabled={!hasReports}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              hasReports
                ? 'border-[#493027]/30 bg-[#A87557]/10 text-[#F0DFCE] hover:bg-[#D0A98B]/20'
                : 'cursor-not-allowed border-[#493027] bg-[#493027] text-[#D0A98B]'
            }`}
            title="Step 02: Show the revenue, costs and profit report"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>02 · P&L report</span>
            {hasReports && <span className="text-[10px] text-[#F0DFCE]">Day {gameState.reports[gameState.reports.length - 1].day}</span>}
          </button>

          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#D0A98B]" />

          <button
            type="button"
            onClick={onTriggerShockStep03}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              shockResolved
                ? 'border-[#76503B]/30 bg-[#A87557]/10 text-[#F0DFCE] hover:bg-[#D0A98B]/20'
                : shockTriggered
                ? 'border-[#76503B]/50 bg-[#A87557]/15 text-[#F0DFCE] hover:bg-[#D0A98B]/25'
                : 'border-[#493027]/40 bg-[#A87557] text-[#F0DFCE] hover:bg-[#D0A98B]'
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
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#76503B] bg-[#493027] px-3 py-2 text-xs font-medium text-[#F0DFCE] transition-colors hover:border-[#76503B]/40 hover:bg-[#493027]"
          >
            <UtensilsCrossed className="h-3.5 w-3.5 text-[#F0DFCE]" />
            Bawaal menu
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#76503B] bg-[#493027] px-3 py-2 text-xs font-medium text-[#F0DFCE] transition-colors hover:border-[#76503B]/40 hover:bg-[#493027]"
          >
            <FileText className="h-3.5 w-3.5 text-[#F0DFCE]" />
            Docs
          </button>
          <button
            type="button"
            onClick={onResetGame}
            aria-label="Reset game"
            title="Reset Game to Day 1"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#76503B] bg-[#493027] text-[#D0A98B] transition-colors hover:bg-[#493027] hover:text-[#F0DFCE]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
