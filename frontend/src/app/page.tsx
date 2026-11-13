'use client';

import React, { useState, useEffect } from 'react';
import { GameState, InventoryMap, MenuType, ShockDecision, DailyReport } from '../types/game';
import {
  createInitialGameState,
  simulateOneDay,
  executeRestock,
  triggerMilkPriceShock,
  resolveShockDecision
} from '../lib/simulationEngine';
import JudgeDemoBar from '../components/JudgeDemoBar';
import Header from '../components/Header';
import InventoryMarket from '../components/InventoryMarket';
import PricingStrategy from '../components/PricingStrategy';
import RushHourSimulationModal from '../components/RushHourSimulationModal';
import DailyReportModal from '../components/DailyReportModal';
import MilkShockModal from '../components/MilkShockModal';
import HistoricalSummary from '../components/HistoricalSummary';
import DocsModal from '../components/DocsModal';
import MenuCardModal from '../components/MenuCardModal';

const STORAGE_KEY = 'bawaal_chaiwala_game_state_v1';

export default function ChaiStallTycoonApp() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [mounted, setMounted] = useState(false);

  // Modals state
  const [isSimulatingModalOpen, setIsSimulatingModalOpen] = useState(false);
  const [pendingReport, setPendingReport] = useState<DailyReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShockModalOpen, setIsShockModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Load state from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.day && parsed.inventory) {
          setGameState(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage:', e);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.warn('Could not save state to localStorage:', e);
      }
    }
  }, [gameState, mounted]);

  // Restock handler
  const handleRestock = (ingredientKey: keyof InventoryMap, quantity: number) => {
    const result = executeRestock(gameState, ingredientKey, quantity);
    if (result.success) {
      setGameState(result.state);
    }
  };

  // Set Price handler
  const handleSetPrice = (price: number) => {
    setGameState((prev) => ({
      ...prev,
      chaiPrice: Math.max(8, Math.min(45, price))
    }));
  };

  // Select Menu Speciality handler
  const handleSelectMenu = (menu: MenuType) => {
    setGameState((prev) => ({
      ...prev,
      activeMenu: menu
    }));
  };

  // Start Simulation handler
  const handleStartSimulation = () => {
    const { updatedState, report } = simulateOneDay(gameState);
    setPendingReport(report);
    setGameState(updatedState);
    setIsSimulatingModalOpen(true);
  };

  // Rush hour animation completed or skipped
  const handleSimulationFinish = () => {
    setIsSimulatingModalOpen(false);
    setIsReportModalOpen(true);
  };

  // Judge Step 01: Restock & simulate sales
  const handleStep01 = () => {
    // If inventory is low on milk or tea, top it up slightly
    let stateToSimulate = gameState;
    if (stateToSimulate.inventory.milk.quantity < 2 && stateToSimulate.budget >= 120) {
      const restockResult = executeRestock(stateToSimulate, 'milk', 2);
      if (restockResult.success) stateToSimulate = restockResult.state;
    }

    const { updatedState, report } = simulateOneDay(stateToSimulate);
    setPendingReport(report);
    setGameState(updatedState);
    setIsSimulatingModalOpen(true);
  };

  // Judge Step 02: Open latest report
  const handleStep02 = () => {
    if (gameState.reports.length > 0) {
      setPendingReport(gameState.reports[gameState.reports.length - 1]);
      setIsReportModalOpen(true);
    }
  };

  // Judge Step 03: Trigger milk price shock
  const handleStep03 = () => {
    const shockedState = triggerMilkPriceShock(gameState);
    setGameState(shockedState);
    setIsReportModalOpen(false);
    setIsShockModalOpen(true);
  };

  // Shock decision applied
  const handleSelectShockDecision = (decision: ShockDecision) => {
    const resolvedState = resolveShockDecision(gameState, decision);
    setGameState(resolvedState);
  };

  // Reset Game
  const handleResetGame = () => {
    if (confirm('Reset Chai Stall Tycoon back to Day 1 with fresh ₹500 budget?')) {
      const fresh = createInitialGameState();
      setGameState(fresh);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  };

  // Seed with sample 3-day data for instant testing
  const handleLoadSampleData = () => {
    let s = createInitialGameState();
    // Day 1
    s = executeRestock(s, 'milk', 4).state;
    const res1 = simulateOneDay(s, { fixedWeather: 'sunny' });
    s = res1.updatedState;
    // Day 2
    s = executeRestock(s, 'tea_leaves', 100).state;
    const res2 = simulateOneDay(s, { fixedWeather: 'rainy' });
    s = res2.updatedState;
    // Trigger shock
    s = triggerMilkPriceShock(s);

    setGameState(s);
    setPendingReport(res2.report);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#211713] text-[#F0DFCE] flex flex-col font-sans selection:bg-[#A87557] selection:text-[#F0DFCE]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#A87557] focus:px-4 focus:py-3 focus:font-bold focus:text-[#F0DFCE]"
      >
        Skip to game dashboard
      </a>
      {/* 1. Mandatory Judge Verification Demonstration Bar */}
      <JudgeDemoBar
        gameState={gameState}
        onSimulateStep01={handleStep01}
        onOpenReportStep02={handleStep02}
        onTriggerShockStep03={handleStep03}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenMenu={() => setIsMenuModalOpen(true)}
        onResetGame={handleResetGame}
      />

      {/* 2. Brand Identity & Live Metrics Header */}
      <Header
        gameState={gameState}
        onOpenMenu={() => setIsMenuModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
      />

      {/* 3. Main Stall Dashboard Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 outline-none">
        {/* Quick Demo Helpers for Mentors / Judges */}
        <div className="bg-[#493027]/60 border border-[#76503B]/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#D0A98B] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F0DFCE]">Quick Test Utilities:</span>
            <span>Deterministic simulation • Zero negative inventory guaranteed • Browser-first</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSampleData}
              className="px-2.5 py-1 rounded bg-[#493027] hover:bg-[#76503B] text-[#F0DFCE] border border-[#76503B] text-[11px] font-mono transition-colors"
            >
              Load Sample 2-Day Data + Shock
            </button>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="px-2.5 py-1 rounded bg-[#493027] hover:bg-[#76503B] text-[#F0DFCE] border border-[#76503B] text-[11px] font-mono transition-colors"
            >
              View Slide Docs (7 Files)
            </button>
          </div>
        </div>

        {/* Pricing Strategy & Simulation Trigger */}
        <PricingStrategy
          gameState={gameState}
          onSetPrice={handleSetPrice}
          onSelectMenu={handleSelectMenu}
          onStartSimulation={handleStartSimulation}
        />

        {/* Inventory & Wholesale Mandi */}
        <InventoryMarket
          gameState={gameState}
          onRestock={handleRestock}
        />

        {/* Tycoon Ledger & Historical Analytics */}
        <HistoricalSummary
          gameState={gameState}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#493027] bg-[#493027] py-6 px-4 text-center text-xs text-[#D0A98B]">
        <p className="font-medium text-[#D0A98B]">
          Chai Stall Tycoon — Bawaal Chaiwala • Built for VIBESPRINT Hackathon
        </p>
        <p className="mt-1 text-[11px] text-[#D0A98B]">
          Browser-First Local Calculation Engine • No external API or backend needed • Deterministic simulation
        </p>
      </footer>

      {/* Modals */}
      {/* 1. Live Rush Hour Simulation Animation */}
      <RushHourSimulationModal
        isOpen={isSimulatingModalOpen}
        gameState={gameState}
        finalReport={pendingReport}
        onFinish={handleSimulationFinish}
      />

      {/* 2. Step 02: Daily P&L and Customer Feedback Report */}
      <DailyReportModal
        isOpen={isReportModalOpen}
        report={pendingReport || (gameState.reports.length > 0 ? gameState.reports[gameState.reports.length - 1] : null)}
        gameState={gameState}
        onClose={() => setIsReportModalOpen(false)}
        onTriggerShock={handleStep03}
      />

      {/* 3. Step 03: Minute 40 Milk Price Shock Decision Matrix */}
      <MilkShockModal
        isOpen={isShockModalOpen}
        gameState={gameState}
        onSelectDecision={handleSelectShockDecision}
        onClose={() => setIsShockModalOpen(false)}
      />

      {/* 4. Slide Documentation Suite Viewer (7 files) */}
      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* 5. Authentic Bawaal Chaiwala Menu Card */}
      <MenuCardModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
      />
    </div>
  );
}
