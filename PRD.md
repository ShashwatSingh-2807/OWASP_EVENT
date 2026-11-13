# Product Requirements Document (PRD) — Chai Stall Tycoon

## 1. Executive Summary & Problem Overview
Street vending and micro-tapris form the economic backbone of Indian urban communities. Chai stall operators operate on tight operating budgets, face rapid customer turnover during peak morning/evening rush hours, and navigate high price elasticity.

The critical vulnerability in this micro-business model is supply chain volatility—specifically sudden price shocks in perishable commodities like dairy milk. **Chai Stall Tycoon: Bawaal Chaiwala** simulates this reality in an interactive, deterministic browser-first prototype that allows players to experience the business dynamics, risk mitigation strategies, and consumer psychology of managing an authentic Indian chai stall.

---

## 2. Product Goals & Success Metrics
* **Core Interactive Loop:** A playable day-by-day progression loop (Planning & Restock ➔ Pricing Strategy ➔ Rush Hour Simulation ➔ Daily P&L & Feedback Audit).
* **Deterministic Simulation:** 100% bug-free inventory math ensuring zero negative inventory bugs and strictly bounded budget management.
* **Minute 40 Supply Shock Integration:** Authentic simulation of a 100% wholesale milk cost surge (₹60/L ➔ ₹120/L) with three distinct strategic decision options (Raise Price, Absorb Cost, Pivot Menu).
* **Evaluation Verification:** Flawless 3-step verification path for hackathon judges and mentors.
* **Zero Dependency Setup:** Browser-first execution requiring zero external API keys, secrets, payment gateways, or third-party databases.

---

## 3. Target Users & Personas
1. **The Casual Gamer:** Enjoys tactile tycoon mechanics, seeing animated cutting chai boiling, and reacting to authentic street customer dialogue.
2. **The Business Strategist / Judge:** Evaluates unit economics (COGS vs revenue), price elasticity curves, and trade-offs between customer retention and margin protection.
3. **The Micro-Entrepreneur:** Understands the real-world pressures of commodity inflation, customer loyalty, and rapid product pivoting.

---

## 4. Key Functional Requirements

### 4.1 Daily Budget & Inventory Management
* **Starting Budget:** Player starts with ₹500 in capital.
* **5 Core Ingredients:**
  * **Assam CTC Tea Leaves:** In grams (₹0.40/g wholesale)
  * **Dairy Milk:** In liters (₹60/L wholesale standard; surges to ₹120/L in shock)
  * **Cane Sugar:** In kg (₹50/kg wholesale)
  * **Adrak & Elaichi Spices:** In grams (₹1.20/g wholesale)
  * **Earthen Kulhads / Cups:** In units (₹1.00/cup wholesale)
* **Wholesale Market:** Quick buy buttons (+1, +5, +25, Max Affordable) with live budget validation preventing overspending.
* **Bottleneck Capacity Detection:** Visual gauge showing maximum craftable cups with current inventory and highlighting the limiting ingredient.

### 4.2 Pricing & Menu Strategy
* **Cup Price Slider:** ₹8 to ₹45 with quick preset buttons (₹10, ₹12, ₹15, ₹20, ₹25, ₹30).
* **Live Unit Economics:** Real-time computation of Unit Ingredient Cost (COGS), Unit Net Profit, and Gross Margin %.
* **Price Elasticity:** Price sensitivity curve modeling customer pushback at price hikes while rewarding value pricing.
* **Stall Menu Selection:**
  * *Bawaal Kadak Chai:* Authentic street blend.
  * *Adrak-Elaichi Kulhad:* Premium spiced clay cup offering higher price tolerance.
  * *Ayurvedic Kadha & Green Tea:* **Zero Milk!** Immunity herbal blend that shields the stall against dairy price shocks.

### 4.3 Simulation & Rush Hour
* **Weather Profiles:** Sunny (1.0x demand), Monsoon Rain (1.45x demand spike), Winter Chill (1.60x demand spike), Scorching Heat (0.75x lull).
* **Rush Hour Phases:** Morning Commute (8:30 AM), Lunch Break Adda (1:30 PM), Evening Peak Rush (5:30 PM).
* **Customer Voice & Dialogue:** Speech bubbles displaying customer personas (Commuters, Techies, College Students, Elderly regulars).
* **Zero Negative Inventory Invariant:** Inventory deductions are bounded strictly by cups brewed; inventory never drops below 0.

### 4.4 Daily Financial Report & Customer Voice (Judge Step 02)
* **Financial P&L:**
  * Gross Revenue = Cups Sold × Chai Price
  * Ingredient Cost (COGS) = Cups Sold × Unit Ingredient Cost
  * Fixed Overhead = ₹50 (Daily stall rent, gas cylinder, cleaning)
  * Net Daily Profit = Gross Revenue - Total Costs
* **Customer Rating & Feedback:** 1.0 to 5.0 star rating based on price fairness, stock fulfillment, and loyalty sentiment.

### 4.5 Minute 40 Twist: Milk Supply Shock (Judge Step 03)
* **Event:** Dairy wholesale price doubles overnight from ₹60/L to ₹120/L.
* **3 Interactive Decision Paths:**
  1. *Raise Prices (+₹5):* Protects margin per cup; demand drops ~22%; slight rating dip.
  2. *Absorb Cost:* Keeps price at ₹15; absorbs extra ₹3 cost per cup; earns customer loyalty (+0.6 rating boost).
  3. *Pivot Menu (Ayurvedic Kadha & Green Tea):* Promotes milk-free wellness tea from the Bawaal menu; cuts milk exposure by 65%; yields high margins.

---

## 5. Non-Functional Requirements
* **Reliability:** Pure client-side calculation engine with fallback localStorage persistence.
* **Performance:** Sub-100ms render response times; instant skip on animations.
* **Accessibility & UI:** High-contrast warm amber/terracotta palette, responsive on desktop and mobile.

