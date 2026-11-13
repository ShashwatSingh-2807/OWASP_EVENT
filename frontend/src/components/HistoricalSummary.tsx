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
      <div className="bg-white/60 border border-slate-200 rounded-2xl p-6 text-center text-slate-600">
        <History className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-700">No Historical Days Recorded Yet</p>
        <p className="text-xs text-slate-500 mt-1">
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
    <section className="bg-gradient-to-br from-white to-slate-50 border border-slate-300/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-600/20 text-sky-700 border border-sky-300/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Tycoon Ledger & Performance Analytics
            </h2>
            <p className="text-xs text-slate-600">
              Day-by-day progression loop and cumulative financial balance sheet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <Award className="w-4 h-4 text-sky-700" />
          <span>{reports.length} Days in Operation</span>
        </div>
      </div>

      {/* Cumulative KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-600 uppercase font-semibold block">Total Revenue</span>
          <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">
            ₹{totals.revenue.toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-600 uppercase font-semibold block">Total Costs</span>
          <span className="text-lg sm:text-xl font-black text-red-800 font-mono">
            ₹{totals.costs.toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-600 uppercase font-semibold block">Net Cumulative Profit</span>
          <span className={`text-lg sm:text-xl font-black font-mono ${totals.profit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
            {totals.profit >= 0 ? `+₹${totals.profit.toFixed(2)}` : `-₹${Math.abs(totals.profit).toFixed(2)}`}
          </span>
        </div>

        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-600 uppercase font-semibold block">Total Cups Sold</span>
          <span className="text-lg sm:text-xl font-black text-sky-800 font-mono">
            {totals.cupsSold} <span className="text-xs font-normal text-slate-600">cups</span>
          </span>
        </div>
      </div>

      {/* Daily Progression Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200/80" role="region" aria-label="Daily performance history" tabIndex={0}>
        <table className="w-full min-w-[820px] border-collapse text-left text-xs">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
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
          <tbody className="divide-y divide-slate-200 font-mono">
            {reports.map((r) => {
              const weather = WEATHER_PROFILES[r.weather];
              const menu = MENU_ITEMS[r.activeMenu];
              const isProfit = r.netProfit >= 0;

              return (
                <tr key={r.day} className="hover:bg-slate-100/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-sky-800">
                    Day {r.day}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 not-italic">
                    {weather?.icon} {weather?.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 not-italic">
                    {menu?.name.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">
                    ₹{r.chaiPrice}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">
                    {r.cupsSold} / {r.cupsDemanded}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700">
                    ₹{r.grossRevenue.toFixed(0)}
                  </td>
                  <td className="py-2.5 px-3 text-red-800">
                    ₹{r.totalCost.toFixed(0)}
                  </td>
                  <td className={`py-2.5 px-3 font-bold ${isProfit ? 'text-emerald-800' : 'text-red-700'}`}>
                    {isProfit ? `+₹${r.netProfit.toFixed(0)}` : `-₹${Math.abs(r.netProfit).toFixed(0)}`}
                  </td>
                  <td className="py-2.5 px-3 text-sky-800 font-bold">
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

