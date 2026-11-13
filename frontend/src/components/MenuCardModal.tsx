'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

interface MenuCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuCardModal({ isOpen, onClose }: MenuCardModalProps) {
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
    <div role="dialog" aria-modal="true" aria-labelledby="menu-modal-heading" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h3 id="menu-modal-heading" className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Bawaal Chaiwala Official Menu
              </h3>
              <p className="text-xs text-sky-700 font-medium italic">
                “Swaad aisa jo macha de bawaal!”
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close official menu"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Menu Image Container */}
        <div className="mt-4 rounded-2xl overflow-hidden border-2 border-sky-300/40 shadow-xl relative aspect-[16/9] w-full">
          <Image
            src="/bawaal-menu.jpg"
            alt="Bawaal Chaiwala Authentic Menu"
            fill
            className="object-contain bg-sky-50/20"
            priority
          />
        </div>

        {/* Menu Breakdown Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Section 1 */}
          <div className="bg-slate-50/80 border border-sky-200/40 rounded-xl p-4">
            <h4 className="font-bold text-sky-800 text-sm pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
              <span>☕ Bawaal Chai (Speciality)</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-slate-700">
              <li className="flex justify-between">
                <span>Bawaal Kadak Chai</span>
                <span className="font-mono text-sky-800 font-bold">₹15</span>
              </li>
              <li className="flex justify-between">
                <span>Adrak-Elaichi Kulhad</span>
                <span className="font-mono text-sky-800 font-bold">₹25</span>
              </li>
              <li className="flex justify-between">
                <span>Masala Tapri Special</span>
                <span className="font-mono text-sky-800 font-bold">₹30</span>
              </li>
              <li className="flex justify-between">
                <span>Tandoori Chai</span>
                <span className="font-mono text-sky-800 font-bold">₹40</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50/80 border border-emerald-200/40 rounded-xl p-4">
            <h4 className="font-bold text-emerald-800 text-sm pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Fitness & Health (Zero Milk!)</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-slate-700">
              <li className="flex justify-between">
                <span>Green Tea (Honey & Lemon)</span>
                <span className="font-mono text-emerald-800 font-bold">₹30</span>
              </li>
              <li className="flex justify-between">
                <span>Ayurvedic Kadha</span>
                <span className="font-mono text-emerald-800 font-bold">₹35</span>
              </li>
              <li className="flex justify-between">
                <span>Sugar-Free Masala Chai</span>
                <span className="font-mono text-emerald-800 font-bold">₹25</span>
              </li>
              <li className="flex justify-between">
                <span>Multigrain Bun Maska</span>
                <span className="font-mono text-emerald-800 font-bold">₹40</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-50/80 border border-sky-200/40 rounded-xl p-4">
            <h4 className="font-bold text-sky-800 text-sm pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
              <span>🥪 Bawaal Combos</span>
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-slate-700">
              <li className="flex justify-between">
                <span>Kadak + Multigrain Bun Maska</span>
                <span className="font-mono text-sky-800 font-bold">₹50</span>
              </li>
              <li className="flex justify-between">
                <span>Green Tea + Digestive Biscuits</span>
                <span className="font-mono text-sky-800 font-bold">₹40</span>
              </li>
              <li className="flex justify-between">
                <span>Adrak Kulhad + Sugar-Free Biscuit</span>
                <span className="font-mono text-sky-800 font-bold">₹35</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-600 text-slate-950 font-bold text-xs"
          >
            Close Menu Card
          </button>
        </div>
      </div>
    </div>
  );
}

