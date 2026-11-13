'use client';

import React from 'react';
import Image from 'next/image';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

interface MenuCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuCardModal({ isOpen, onClose }: MenuCardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-amber-100 font-serif">
                Bawaal Chaiwala Official Menu
              </h3>
              <p className="text-xs text-amber-400 font-medium italic">
                “Swaad aisa jo macha de bawaal!”
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Menu Image Container */}
        <div className="mt-4 rounded-2xl overflow-hidden border-2 border-amber-600/40 shadow-xl relative aspect-[16/9] w-full">
          <Image
            src="/bawaal-menu.jpg"
            alt="Bawaal Chaiwala Authentic Menu"
            fill
            className="object-contain bg-amber-950/20"
            priority
          />
        </div>

        {/* Menu Breakdown Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Section 1 */}
          <div className="bg-stone-950/80 border border-amber-700/40 rounded-xl p-4">
            <h4 className="font-bold text-amber-300 text-sm pb-1.5 border-b border-stone-800 flex items-center gap-1.5">
              <span>☕ Bawaal Chai (Speciality)</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-stone-300">
              <li className="flex justify-between">
                <span>Bawaal Kadak Chai</span>
                <span className="font-mono text-amber-200 font-bold">₹15</span>
              </li>
              <li className="flex justify-between">
                <span>Adrak-Elaichi Kulhad</span>
                <span className="font-mono text-amber-200 font-bold">₹25</span>
              </li>
              <li className="flex justify-between">
                <span>Masala Tapri Special</span>
                <span className="font-mono text-amber-200 font-bold">₹30</span>
              </li>
              <li className="flex justify-between">
                <span>Tandoori Chai</span>
                <span className="font-mono text-amber-200 font-bold">₹40</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-stone-950/80 border border-emerald-700/40 rounded-xl p-4">
            <h4 className="font-bold text-emerald-300 text-sm pb-1.5 border-b border-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fitness & Health (Zero Milk!)</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-stone-300">
              <li className="flex justify-between">
                <span>Green Tea (Honey & Lemon)</span>
                <span className="font-mono text-emerald-200 font-bold">₹30</span>
              </li>
              <li className="flex justify-between">
                <span>Ayurvedic Kadha</span>
                <span className="font-mono text-emerald-200 font-bold">₹35</span>
              </li>
              <li className="flex justify-between">
                <span>Sugar-Free Masala Chai</span>
                <span className="font-mono text-emerald-200 font-bold">₹25</span>
              </li>
              <li className="flex justify-between">
                <span>Multigrain Bun Maska</span>
                <span className="font-mono text-emerald-200 font-bold">₹40</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-stone-950/80 border border-orange-700/40 rounded-xl p-4">
            <h4 className="font-bold text-orange-300 text-sm pb-1.5 border-b border-stone-800 flex items-center gap-1.5">
              <span>🥪 Bawaal Combos</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-stone-300">
              <li className="flex justify-between">
                <span>Kadak + Multigrain Bun Maska</span>
                <span className="font-mono text-orange-200 font-bold">₹50</span>
              </li>
              <li className="flex justify-between">
                <span>Green Tea + Digestive Biscuits</span>
                <span className="font-mono text-orange-200 font-bold">₹40</span>
              </li>
              <li className="flex justify-between">
                <span>Adrak Kulhad + Sugar-Free Biscuit</span>
                <span className="font-mono text-orange-200 font-bold">₹35</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
          >
            Close Menu Card
          </button>
        </div>
      </div>
    </div>
  );
}

