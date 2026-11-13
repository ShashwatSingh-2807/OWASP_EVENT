# ☕ Chai Stall Tycoon: Bawaal Chaiwala
> *"Swaad aisa jo macha de bawaal!"* — The authentic Indian chai tapri business simulation.

Built for the **VIBESPRINT Hackathon**. Players manage a virtual chai stall by setting prices, buying stock, surviving morning and evening rush hours, reviewing daily P&L statements, and overcoming the **Minute 40 Milk Supply Shock**!

---

## 🏆 Judge Evaluation & Verification Guide (3-Step Path)

A dedicated, persistent **Judge Demo Bar** is pinned to the top of the screen with 1-click verification buttons:

* **STEP 01: Buy Stock & Simulate Sales**
  * Click `STEP 01: Simulate Sales` in the demo bar.
  * Adjust price per cup (₹8 - ₹45) and buy wholesale ingredients.
  * Watch the animated rush hour simulation serve customers across morning, afternoon, and evening shifts.
* **STEP 02: P&L & Feedback Audit**
  * Click `STEP 02: P&L Report` to review the financial statement.
  * View Gross Revenue, Ingredient Cost (COGS), Fixed Stall Overhead (₹50), and Net Daily Profit.
  * Inspect customer ratings and authentic street customer reviews.
* **STEP 03: Minute 40 Milk Price Shock**
  * Click `STEP 03: Trigger Milk Shock` to trigger the surprise constraint.
  * Milk procurement costs double from ₹60/L to ₹120/L!
  * Select from 3 strategic decision paths:
    1. **Raise Prices (+₹5):** Protect margins against inflation.
    2. **Absorb Costs:** Maintain ₹15 price for maximum customer goodwill.
    3. **Pivot Menu (Ayurvedic Kadha & Green Tea):** Switch to zero-milk herbal wellness brews directly from the Bawaal menu!

---

## 🚀 Quick Start Instructions

This prototype is **100% Browser-First** with **Zero .env dependency** and no external database setup.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (Next.js 16 + React 19 + Tailwind v4 + Lucide)
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Verification Test
You can also run the deterministic mathematical verification test via CLI:
```bash
cd frontend
npm run test:verification
```

---

## 📋 Non-Negotiable Rules Compliance

| Rule | Requirement | Implementation Status |
| :--- | :--- | :--- |
| **01** | **Browser-First Prototype** | Pure client-side TypeScript simulation engine. Zero external API or database setup. |
| **02** | **No .env Dependency** | Zero environmental variables or secret keys required. |
| **03** | **Core Interaction First** | Complete end-to-end user loop with validation, stockout warnings, and financial summaries. |
| **04** | **Fictional Data Only** | Completely fictional micro-business game simulation. |
| **05** | **Documentation Included** | All 7 required slide documents provided (`PRD.md`, `ARCHITECTURE.md`, `AGENTS.md`, `TASKS.md`, `DECISIONS.md`, `CONTEXT.md`, `README.md`) both in repo and via in-app Docs modal. |

---

## 📁 Repository Structure

```
├── AGENTS.md                  # Instructions and coding standards
├── PRD.md                     # Product requirements document
├── ARCHITECTURE.md            # System architecture and mathematical invariants
├── TASKS.md                   # Completed tasks and milestone status
├── DECISIONS.md               # Technical decisions and trade-offs log
├── CONTEXT.md                 # Current progress, verification notes
├── README.md                  # Main overview and quick start guide
├── docs/                      # Mirrored documentation files
└── frontend/
    ├── public/
    │   ├── bawaal-logo.jpg    # Authentic wooden carved stall plaque
    │   └── bawaal-menu.jpg    # Official stall menu board
    └── src/
        ├── app/
        │   ├── layout.tsx     # App layout & typography
        │   └── page.tsx       # Main game dashboard & controller
        ├── components/
        │   ├── JudgeDemoBar.tsx          # 3-step evaluation banner
        │   ├── Header.tsx                # Branding & live KPI ribbon
        │   ├── InventoryMarket.tsx       # Wholesale store & stock balances
        │   ├── PricingStrategy.tsx       # Dynamic pricing & margin analyzer
        │   ├── RushHourSimulationModal.tsx # Animated rush hour scene
        │   ├── DailyReportModal.tsx      # Step 02 P&L report
        │   ├── MilkShockModal.tsx        # Step 03 Milk crisis & decisions
        │   ├── HistoricalSummary.tsx     # Multi-day ledger & analytics
        │   ├── DocsModal.tsx             # In-browser 7-doc reader
        │   └── MenuCardModal.tsx         # Bawaal menu card viewer
        ├── lib/
        │   ├── constants.ts              # Game constants & recipes
        │   └── simulationEngine.ts       # Deterministic simulation engine
        └── types/
            └── game.ts                   # TypeScript interfaces
```

