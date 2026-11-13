'use client';

import React from 'react';
import { GameState } from '../types/game';
import { WEATHER_PROFILES, MENU_ITEMS } from '../lib/constants';
import { History, TrendingUp, Award, Star, CheckCircle } from 'lucide-react';

interface HistoricalSummaryProps {
  gameState: GameState;
}

export default function HistoricalSummary({ gameState }: HistoricalSummaryProps) {
  const reports = gameState.reports;

  if (reports.length === 0) {
    return (
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 text-center text-stone-400">
        <History className="w-8 h-8 mx-auto text-stone-600 mb-2" />
        <p className="text-sm font-semibold text-stone-300">No Historical Days Recorded Yet</p>
        <p className="text-xs text-stone-500 mt-1">
          Complete Day 1 sales simulation to view your daily financial progress, revenue trajectory, and customer satisfaction logs.
        </p>
      </div>
    );
  }

  // Calculate totals
  const totals = reports.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.grossRevenue,
      costs: acc.costs + r.totalCost,
      profit: acc.profit + r.netProfit,
      cupsSold: acc.cupsSold + r.cupsSold,
      ratingSum: acc.ratingSum + r.customerRating
    }),
    { revenue: 0, costs: 0, profit: 0, cupsSold: 0, ratingSum: 0 }
  );

  const avgRating = Math.round((totals.ratingSum / reports.length) * 10) / 10;

  return (
    <section className="bg-stone-900/90 border border-amber-600/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-100">
              Tycoon Ledger & Performance Analytics
            </h2>
            <p className="text-xs text-stone-400">
              Day-by-day progression loop and cumulative financial balance sheet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{reports.length} Days in Operation</span>
        </div>
      </div>

      {/* Cumulative KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total Revenue</span>
          <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
            ₹{totals.revenue.toFixed(2)}
          </span>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total Costs</span>
          <span className="text-lg sm:text-xl font-black text-red-300 font-mono">
            ₹{totals.costs.toFixed(2)}
          </span>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Net Cumulative Profit</span>
          <span className={`text-lg sm:text-xl font-black font-mono ${totals.profit >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
            {totals.profit >= 0 ? `+₹${totals.profit.toFixed(2)}` : `-₹${Math.abs(totals.profit).toFixed(2)}`}
          </span>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total Cups Sold</span>
          <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
            {totals.cupsSold} <span className="text-xs font-normal text-stone-400">cups</span>
          </span>
        </div>
      </div>

      {/* Daily Progression Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-stone-800/80" role="region" aria-label="Daily performance history" tabIndex={0}>
        <table className="w-full min-w-[820px] border-collapse text-left text-xs">
          <thead className="bg-stone-950/80">
            <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Day</th>
              <th className="py-2.5 px-3">Weather</th>
              <th className="py-2.5 px-3">Speciality</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Cups Sold</th>
              <th className="py-2.5 px-3">Revenue</th>
              <th className="py-2.5 px-3">Total Cost</th>
              <th className="py-2.5 px-3">Net Profit</th>
              <th className="py-2.5 px-3">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-850 font-mono">
            {reports.map((r) => {
              const weather = WEATHER_PROFILES[r.weather];
              const menu = MENU_ITEMS[r.activeMenu];
              const isProfit = r.netProfit >= 0;

              return (
                <tr key={r.day} className="hover:bg-stone-850/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-amber-200">
                    Day {r.day}
                  </td>
                  <td className="py-2.5 px-3 text-stone-300 not-italic">
                    {weather?.icon} {weather?.name}
                  </td>
                  <td className="py-2.5 px-3 text-stone-300 not-italic">
                    {menu?.name.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-stone-200">
                    ₹{r.chaiPrice}
                  </td>
                  <td className="py-2.5 px-3 text-stone-200">
                    {r.cupsSold} / {r.cupsDemanded}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">
                    ₹{r.grossRevenue.toFixed(0)}
                  </td>
                  <td className="py-2.5 px-3 text-red-300">
                    ₹{r.totalCost.toFixed(0)}
                  </td>
                  <td className={`py-2.5 px-3 font-bold ${isProfit ? 'text-emerald-300' : 'text-red-400'}`}>
                    {isProfit ? `+₹${r.netProfit.toFixed(0)}` : `-₹${Math.abs(r.netProfit).toFixed(0)}`}
                  </td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">
                    ⭐ {r.customerRating.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

