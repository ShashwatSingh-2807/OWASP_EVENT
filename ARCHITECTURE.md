# Architecture & System Design — Chai Stall Tycoon

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                            NEXT.JS 16 CLIENT APPLICATION                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [Judge Demo Bar]          [Header & Live Metrics]     [Slide Docs & Menu Card]   |
|   - Step 01 Trigger         - Timeline / Day            - 7 MD Files Modal        |
|   - Step 02 Report          - Available Budget          - Bawaal Menu Preview     |
|   - Step 03 Shock Alert     - Weather Forecast                                    |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+ |
|  |     Inventory & Wholesale Mandi     |   |      Pricing & Menu Strategy       | |
|  | - 5 Ingredients & Live Stock Levels |   | - Dynamic Price Slider (₹8 - ₹45)  | |
|  | - Quick Restock (+1, +5, +25, Max)  |   | - Real-time Margin & Elasticity    | |
|  | - Live Bottleneck Detection         |   | - Menu Focus (Kadak vs Kadha)      | |
|  +-------------------------------------+   +------------------------------------+ |
|                                                                                   |
|  +------------------------------------------------------------------------------+ |
|  |                       Tycoon Ledger & Progression Loop                       | |
|  | - Cumulative P&L, Total Cups Sold, Day-by-Day Historical Log                 | |
|  +------------------------------------------------------------------------------+ |
|                                       │                                           |
+---------------------------------------┼-------------------------------------------+
                                        │
                                        ▼
+-----------------------------------------------------------------------------------+
|                     DETERMINISTIC SIMULATION ENGINE (src/lib)                     |
+-----------------------------------------------------------------------------------+
|  1. Capacity Solver:                                                              |
|     maxBrewable = min(tea/4, milk/0.05, sugar/0.008, spices/0.5, cups/1)          |
|                                                                                   |
|  2. Demand Function:                                                              |
|     demand = floor(baseDemand * weatherMult * rushBonus * priceSensitivity)       |
|                                                                                   |
|  3. Sales & Deduction (Guarantees zero negative inventory):                       |
|     cupsSold = min(demand, maxBrewable)                                           |
|     inventory[item] = max(0, inventory[item] - cupsSold * recipe[item])           |
|                                                                                   |
|  4. Financial Accounting:                                                         |
|     COGS = cupsSold * unitIngredientCost                                          |
|     GrossRevenue = cupsSold * chaiPrice                                           |
|     NetProfit = GrossRevenue - COGS - Overhead(₹50)                               |
|                                                                                   |
|  5. Minute 40 Supply Shock State Machine:                                         |
|     milkCost = milkCost * 2 (₹60 -> ₹120)                                         |
|     Decisions: [Raise Price] | [Absorb Margin] | [Pivot to Milk-Free Kadha]       |
+-----------------------------------------------------------------------------------+
                                        │
                                        ▼
+-----------------------------------------------------------------------------------+
|                             STORAGE & STATE ADAPTER                               |
+-----------------------------------------------------------------------------------+
|  - React 19 State (reactive instant renders)                                      |
|  - LocalStorage Driver ('bawaal_chaiwala_game_state_v1')                          |
|  - Verification Test Suite (src/test-verification.ts)                             |
+-----------------------------------------------------------------------------------+
```

---

## 2. Component Hierarchy & Modular Structure

* `frontend/src/app/page.tsx`: Root dashboard orchestrating game state, modal visibility, and verification actions.
* `frontend/src/components/`:
  * `JudgeDemoBar.tsx`: Sticky evaluation header with direct links to Steps 01, 02, 03.
  * `Header.tsx`: Brand presentation featuring the official wooden carved logo and live KPI ribbon.
  * `InventoryMarket.tsx`: Wholesale store, ingredient balance bars, bottleneck identification, and purchase validation.
  * `PricingStrategy.tsx`: Interactive pricing slider, unit margin inspector, price elasticity estimator, and menu selector.
  * `RushHourSimulationModal.tsx`: Visual animated timeline simulating rush hours with live counters and customer speech bubbles.
  * `DailyReportModal.tsx`: Detailed Step 02 profit/loss summary, stockout warnings, and customer feedback.
  * `MilkShockModal.tsx`: Step 03 crisis resolution modal presenting 3 decision paths with projected trade-offs.
  * `HistoricalSummary.tsx`: Multi-day financial ledger and performance analytics table.
  * `DocsModal.tsx`: In-browser markdown documentation suite reader.
  * `MenuCardModal.tsx`: Authentic menu card viewer featuring user-provided assets.

---

## 3. Mathematical Models & Invariants

### 3.1 Zero Negative Inventory Invariant
Inventory is strictly governed by:
$$\text{cupsSold} = \min(\text{demandedCups}, \text{maxBrewableCups})$$
$$\text{inventory}_{\text{new}}[k] = \max(0, \text{inventory}_{\text{current}}[k] - \text{cupsSold} \times \text{recipe}[k])$$
Because $\text{maxBrewableCups} \le \frac{\text{inventory}[k]}{\text{recipe}[k]}$, the deducted amount $\text{cupsSold} \times \text{recipe}[k]$ is guaranteed to be $\le \text{inventory}[k]$, ensuring inventory can never become negative.

### 3.2 Price Elasticity Function
Customer demand scales dynamically with price:
* When $\text{price} \le 15$:
  $$\text{elasticity} = \min(1.35, 1.0 + (15 - \text{price}) \times 0.04)$$
* When $\text{price} > 15$:
  $$\text{elasticity} = \max(0.20, 1.0 - (\text{price} - 15) \times 0.052)$$

### 3.3 Financial Accounting Model
$$\text{Gross Revenue} = \text{cupsSold} \times \text{chaiPrice}$$
$$\text{COGS} = \text{cupsSold} \times \sum_{k} (\text{recipe}[k] \times \text{unitCost}[k])$$
$$\text{Total Cost} = \text{COGS} + \text{Overhead (₹50)}$$
$$\text{Net Profit} = \text{Gross Revenue} - \text{Total Cost}$$
$$\text{Closing Budget} = \text{Opening Budget} + \text{Net Profit}$$

---

## 4. Supply Shock Architecture (Minute 40 Twist)
* **Trigger:** Invoked automatically or via the Judge Demo Bar.
* **State Transition:**
  * Sets `shock.triggered = true`.
  * Multiplies `inventory.milk.unitCost` by 2 (₹60 ➔ ₹120).
* **Decision Resolution:**
  * `raise_price`: Increases cup price by ₹5.
  * `absorb`: Retains price at ₹15; grants customer satisfaction bonus.
  * `substitute_menu`: Activates `herbal_kadha` (0 milk consumption), insulating stall economics from dairy inflation.

