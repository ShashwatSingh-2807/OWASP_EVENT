# Task Breakdown & Implementation Status (TASKS.md)

## Current Status: ALL CORE REQUIREMENTS & TWISTS 100% COMPLETED

### Phase 1: MVP Core Vertical Slice
- [x] **Inventory & Budget Engine:**
  - [x] Daily starting budget of ₹500 initialized.
  - [x] Multi-ingredient inventory tracking (Assam CTC Tea, Milk, Sugar, Spices/Adrak-Elaichi, Earthen Kulhads).
  - [x] Dynamic restock shop with batch purchase options (+1, +5, +25, Max Affordable) and budget overspend guards.
- [x] **Pricing & Menu Strategy:**
  - [x] Price per cup range slider (₹8 to ₹45) with quick presets.
  - [x] Live unit economics visualizer (Unit Cost, Profit per cup, Gross Margin %).
  - [x] Price sensitivity & customer demand elasticity curve.
  - [x] Authentic Bawaal Chaiwala menu item selection (Kadak Chai, Kulhad Special, Ayurvedic Kadha).
- [x] **Deterministic Sales Simulation:**
  - [x] Weather profiles (Sunny, Rainy Monsoon, Chilly Winter, Scorching Heat) with demand multipliers.
  - [x] Rush hour simulation phases (Morning Commute, Lunch Adda, Evening Peak).
  - [x] Bottleneck constraint solver (strictly bounds sales by limiting ingredient).
  - [x] Guaranteed zero negative inventory bug protection.
- [x] **Daily P&L & Feedback Audit (Judge Step 02):**
  - [x] Financial report displaying Gross Revenue, COGS, Overhead (₹50), and Net Profit.
  - [x] Stockout alert identifying lost customer count and potential lost revenue.
  - [x] Qualitative customer feedback generation with authentic personas, avatars, and star ratings.

### Phase 2: Minute 40 Supply Shock Twist (Judge Step 03)
- [x] **Supply Shock Event:**
  - [x] Wholesale dairy milk price doubles overnight from ₹60/L to ₹120/L.
  - [x] Breaking news crisis modal with event telemetry.
- [x] **Interactive Decision Matrix:**
  - [x] Decision 1: Raise Prices (+₹5 per cup to defend unit margin).
  - [x] Decision 2: Absorb Cost (Accept lower margins for customer loyalty bonus).
  - [x] Decision 3: Pivot Menu to Ayurvedic Kadha & Green Tea (Zero milk required, high profit margin).
  - [x] Real-time state application and downstream impact on subsequent simulation days.

### Phase 3: Judge Verification & Experience
- [x] **Judge Demo Bar:**
  - [x] Sticky evaluation header with direct triggers for Step 01, Step 02, and Step 03.
  - [x] Passcode Verified and Minute 40 Twist Unlocked badges.
  - [x] 1-Click Sample Data Seeder for instant evaluation.
- [x] **Documentation Suite & Visuals:**
  - [x] Integrated user-uploaded assets (`bawaal-logo.jpg` and `bawaal-menu.jpg`).
  - [x] Built-in in-browser Docs Modal reading all 7 required markdown files.
  - [x] Verification test suite (`src/test-verification.ts`).
