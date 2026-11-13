# Agent Guidelines & Development Rules (AGENTS.md)

## 1. Core Operating Principles
When developing or modifying **Chai Stall Tycoon: Bawaal Chaiwala**, agents and human contributors must strictly observe these rules:

1. **Browser-First Execution (Rule 01):**
   * All core business logic, simulation algorithms, and data calculations MUST execute locally in the browser environment.
   * No external API keys, database servers, paid services, or payment gateways are permitted.
2. **Zero .env Dependency (Rule 02):**
   * The application must load instantly with sample/mock state out of the box without requiring environment variables.
   * Never commit or request secrets or credentials.
3. **Core Interaction Before Polish (Rule 03):**
   * Ensure the primary user journey (Restock ➔ Set Price ➔ Simulate ➔ Review P&L ➔ Handle Supply Shock) functions end-to-end with mathematical precision.
4. **Fictional Data Only (Rule 04):**
   * All financial metrics, customer personas, and vendor transactions are strictly fictional game simulations.
5. **Deterministic Simulation:**
   * Prevent negative inventory bugs at all times.
   * Deductions must be strictly bounded by available ingredients.

---

## 2. Coding Conventions & Stack Standards

* **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
* **Styling:** Tailwind CSS v4 with custom warm amber/terracotta/stone color scheme reflecting authentic Indian chai stall ambiance.
* **Component Design:**
  * Modals must support keyboard and button dismissals.
  * Inputs (e.g. price slider, restock increments) must have real-time validation and guard against negative values or overspending.
* **State Management:**
  * Single source of truth in `frontend/src/types/game.ts` (`GameState`).
  * Pure functions in `frontend/src/lib/simulationEngine.ts` for state mutations and simulation runs.
* **Verification Path Adherence:**
  * The application must always provide direct access to the 3-step judge evaluation path via `JudgeDemoBar.tsx`.

