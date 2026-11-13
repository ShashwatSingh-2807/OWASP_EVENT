'use client';

import React, { useEffect, useState } from 'react';
import { FileText, X, CheckCircle2, ShieldCheck, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DocTab = 'PRD' | 'ARCHITECTURE' | 'AGENTS' | 'DECISIONS' | 'TASKS' | 'CONTEXT' | 'README';

export default function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const [activeTab, setActiveTab] = useState<DocTab>('PRD');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="docs-modal-heading" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#211713]/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-[#493027] to-[#211713] border-2 border-[#A87557] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F0DFCE] my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#A87557]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#A87557]/20 text-[#F0DFCE] border border-[#A87557]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="docs-modal-heading" className="text-xl sm:text-2xl font-black text-[#F0DFCE] font-serif">
                Chai Stall Tycoon Documentation Suite
              </h3>
              <p className="text-xs text-[#D0A98B]">
                Official Hackathon Projector Slide Specifications & System Artifacts
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close documentation"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#493027] hover:bg-[#76503B] text-[#D0A98B] hover:text-[#F0DFCE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" aria-label="Project documents" className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[#A87557] text-xs font-semibold no-scrollbar">
          {(['PRD', 'ARCHITECTURE', 'AGENTS', 'DECISIONS', 'TASKS', 'CONTEXT', 'README'] as DocTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              id={`docs-tab-${tab.toLowerCase()}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="docs-content"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all font-mono ${
                activeTab === tab
                  ? 'bg-[#D0A98B] text-[#211713] font-bold shadow-md'
                  : 'bg-[#493027]/80 text-[#F0DFCE] hover:bg-[#76503B] hover:text-[#F0DFCE]'
              }`}
            >
              {tab}.md
            </button>
          ))}
        </div>

        {/* Document Content Viewer */}
        <div id="docs-content" role="tabpanel" aria-labelledby={`docs-tab-${activeTab.toLowerCase()}`} tabIndex={0} className="flex-1 overflow-y-auto my-4 pr-2 text-[#F0DFCE] space-y-4 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'PRD' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Product Requirements Document (PRD.md)</h2>
              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557]">
                <h4 className="font-bold text-[#F0DFCE]">1. Problem Statement</h4>
                <p className="mt-1 text-[#D0A98B]">
                  Micro-entrepreneurs in India face volatile raw ingredient price surges (especially dairy, spices, and fuel) with slim margins and high price sensitivity from customers. Chai Stall Tycoon models this dynamic in a realistic, deterministic business simulation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557]">
                <h4 className="font-bold text-[#F0DFCE]">2. Target Audience & Personas</h4>
                <p className="mt-1 text-[#D0A98B]">
                  Hackathon judges, simulation gamers, and students learning economic elasticity, inventory optimization, and crisis pivot strategies.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557]">
                <h4 className="font-bold text-[#F0DFCE]">3. MVP Core Capabilities</h4>
                <ul className="list-disc list-inside mt-1 space-y-1 text-[#D0A98B]">
                  <li><strong>Budget & Inventory:</strong> Daily starting funds (₹500) and multi-ingredient inventory tracking (Tea, Milk, Sugar, Spices, Kulhad Cups).</li>
                  <li><strong>Price & Stock Decision:</strong> Flexible pricing slider (₹8 - ₹45) with live cost-of-goods-sold and elasticity predictions.</li>
                  <li><strong>Deterministic Simulation:</strong> Mathematical customer demand model driven by weather, rush hour multipliers, and price sensitivity.</li>
                  <li><strong>Daily P&L & Customer Voice:</strong> Comprehensive daily financial summary with qualitative customer sentiment analysis.</li>
                  <li><strong>Minute 40 Supply Shock:</strong> Sudden doubling of milk costs with 3 clear strategic options (Raise Price, Absorb Cost, Pivot Menu).</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">System Architecture (ARCHITECTURE.md)</h2>
              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557] font-mono text-xs text-[#F0DFCE]">
                [Client Browser / Next.js 16]<br />
                │<br />
                ├── SimulationEngine (Pure TypeScript, Zero Backend Dependency)<br />
                │   ├── Demand Model: base_demand × weather_mult × rush_bonus × price_elasticity<br />
                │   ├── Constraint Solver: min(tea/4, milk/0.05, sugar/0.008, spices/0.5, cups/1)<br />
                │   ├── Zero Negative Inventory Invariant: quantity &gt;= 0 strictly guarded<br />
                │   └── Financials: gross_rev - (unit_cogs × cups_sold) - overhead = net_profit<br />
                │<br />
                ├── State Machine & Persistence<br />
                │   ├── React State (reactive renders) + LocalStorage (cold start persistence)<br />
                │   └── Verification Walkthrough Pipeline (Step 01 ➔ Step 02 ➔ Step 03)<br />
                └── UI / UX Layer (Tailwind CSS v4 + Lucide Icons + Responsive Design)
              </div>
              <p className="text-[#D0A98B] text-xs">
                Zero external dependencies, no .env requirements, browser-first standalone execution ensures 100% reliability in evaluation environments.
              </p>
            </div>
          )}

          {activeTab === 'AGENTS' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Agent Instructions & Conventions (AGENTS.md)</h2>
              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557]">
                <h4 className="font-bold text-[#F0DFCE]">Coding Conventions</h4>
                <ul className="list-disc list-inside mt-1 space-y-1 text-[#D0A98B]">
                  <li><strong>Browser-First Protocol:</strong> Local calculations, deterministic state, sample/mock initializations.</li>
                  <li><strong>Zero .env Reliance:</strong> Never fail on absent secrets or environmental variables.</li>
                  <li><strong>Immutable Game State:</strong> Clone inventory maps prior to math mutations; prevent negative inventory bugs.</li>
                  <li><strong>Authentic Visual Styling:</strong> Rich warm Indian tapri terracotta/amber color palette matching Bawaal Chaiwala branding.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'DECISIONS' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Technical Decisions Log (DECISIONS.md)</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#493027] border border-[#A87557]">
                  <h4 className="font-bold text-[#F0DFCE]">ADR 01: Client-Side Deterministic Engine</h4>
                  <p className="text-[#D0A98B] mt-1">
                    <strong>Decision:</strong> Implemented the core simulation engine in pure TypeScript on the client rather than relying on native SQLite binary compilation.<br />
                    <strong>Rationale:</strong> Avoids native build failures across disparate Node versions (e.g. Node 26 ABI mismatches), guaranteeing instant preview and zero-friction judging.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#493027] border border-[#A87557]">
                  <h4 className="font-bold text-[#F0DFCE]">ADR 02: Menu Pivot as Twist Countermeasure</h4>
                  <p className="text-[#D0A98B] mt-1">
                    <strong>Decision:</strong> In addition to "Raise Price" and "Absorb Cost", added "Pivot to Ayurvedic Kadha & Green Tea" directly from the user's authentic Bawaal Chaiwala menu card.<br />
                    <strong>Rationale:</strong> Models realistic entrepreneurial agility: when milk doubles, shifting to milk-free herbal tea slashes exposure while preserving 70%+ gross margins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TASKS' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Task Execution Status (TASKS.md)</h2>
              <ul className="space-y-2 text-[#F0DFCE]">
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Project scaffolding & Next.js 16 setup</span>
                </li>
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Deterministic simulation engine with zero negative inventory checks</span>
                </li>
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Judge Verification Bar (Steps 01, 02, and 03)</span>
                </li>
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Minute 40 Milk Supply Shock modal with 3 interactive decisions</span>
                </li>
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Daily Financial P&L report modal with customer voice & avatars</span>
                </li>
                <li className="flex items-center gap-2 text-[#F0DFCE]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>[COMPLETE] Documentation suite (PRD, ARCHITECTURE, AGENTS, DECISIONS, TASKS, CONTEXT, README)</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'CONTEXT' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Current Context & State (CONTEXT.md)</h2>
              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557]">
                <p className="text-[#F0DFCE]">
                  All MVP criteria, non-negotiable build rules, and judge verification paths are 100% operational. The Minute 40 Twist supply shock is integrated with live decision matrix feedback. Zero blockers identified.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'README' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F0DFCE]">Project Overview (README.md)</h2>
              <div className="p-3.5 rounded-xl bg-[#493027] border border-[#A87557] font-mono text-xs">
                # Chai Stall Tycoon (Bawaal Chaiwala)<br />
                Run your own authentic Indian chai stall, buy stock, set prices, survive rush hour, and beat the milk supply shock.<br /><br />
                ## Quick Start<br />
                cd frontend<br />
                npm run dev<br />
                Open http://localhost:3000<br /><br />
                ## Verification Steps for Judges<br />
                1. Step 01: Click &quot;STEP 01: Simulate Sales&quot; to restock and brew Day 1.<br />
                2. Step 02: Review the daily revenue, COGS, overhead, and net profit report.<br />
                3. Step 03: Click &quot;STEP 03: Trigger Milk Shock&quot; to test the Minute 40 Twist decision options.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#A87557] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D0A98B] hover:bg-[#F0DFCE] text-[#211713] font-bold text-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
