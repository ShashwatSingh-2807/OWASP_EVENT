# Current Project Context & State (CONTEXT.md)

## Current Status: PRODUCTION-READY PROTOTYPE
* **Build Status:** Next.js 16.4.6 static & production build passes cleanly (`npm run build`).
* **Verification Test Suite:** All 3 verification path steps pass deterministically (`npm run test:verification`).
* **Minute 40 Twist:** Unlocked, implemented, and fully functional.
* **Blockers:** None.

---

## Judge Demo Verification Path Quick Reference

### STEP 01: Buy Stock & Simulate One Day of Sales
* **Action:** Click **"STEP 01: Simulate Sales"** on the Judge Demo Bar (or adjust price/stock manually and click "Open Chai Stall").
* **Verification Points:**
  * Inventory stock changes in real-time.
  * Capacity solver calculates max craftable cups based on the bottleneck ingredient.
  * Rush hour visual simulation displays customers, speech bubbles, and sales progress.

### STEP 02: Revenue, Costs, and Profit Report
* **Action:** Click **"STEP 02: P&L Report"** on the Judge Demo Bar.
* **Verification Points:**
  * Displays Gross Revenue, Ingredient Cost (COGS), Fixed Stall Overhead (₹50), and Net Daily Profit.
  * Customer satisfaction rating (1.0 to 5.0 stars) with authentic user reviews.
  * Stockout alerts highlight missed revenue if any ingredient depleted early.

### STEP 03: Trigger Milk Shock & Demonstrate Decisions
* **Action:** Click **"STEP 03: Trigger Milk Shock"** on the Judge Demo Bar.
* **Verification Points:**
  * Milk wholesale cost surges by 100% from ₹60/L to ₹120/L.
  * Presents 3 interactive decision cards:
    1. *Raise Prices (+₹5):* Defends margins; demand drops ~22%.
    2. *Absorb Cost:* Retains ₹15 price; absorbs higher COGS; customer loyalty boost (+0.6).
    3. *Pivot Menu (Ayurvedic Kadha):* Shifts to zero-milk herbal brew; protects profits.
  * Strategy is immediately applied to subsequent simulation days.

---

## Asset Inventory
* `/public/bawaal-logo.jpg`: Authentic wooden carved Bawaal Chaiwala stall plaque.
* `/public/bawaal-menu.jpg`: Official stall menu card.
* `src/types/game.ts`: Type definitions for game state, inventory, reports, and shock decisions.
* `src/lib/simulationEngine.ts`: Core deterministic calculation engine.
* `src/test-verification.ts`: Automated CLI verification test script.

