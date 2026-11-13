# Architecture & Technical Decisions Log (DECISIONS.md)

## ADR 01: Pure Client-Side Deterministic Engine (Browser-First Architecture)
* **Date:** Sprint Minute 10
* **Context:** The initial repository contained a draft Express + SQLite backend. However, Node v26 native ABI incompatibilities with `better-sqlite3` caused compilation failures. More importantly, Rule 01 explicitly mandated: *"BROWSER-FIRST PROTOTYPE: USE SAMPLE/MOCK DATA AND LOCAL CALCULATIONS. NO EXTERNAL API, PAID SERVICE, LOGIN PROVIDER, DATABASE SETUP OR SECRET KEY IS REQUIRED."*
* **Decision:** Encapsulated the entire business domain and simulation engine into pure, type-safe TypeScript within the frontend application (`src/lib/simulationEngine.ts`), backed by localStorage persistence.
* **Consequences:**
  * Zero backend server crashes or port collision risks during mentor/judge review.
  * Instant cold start in any modern browser.
  * 100% deterministic, reproducible test scenarios.

---

## ADR 02: Incorporating Real Stall Menu & Logo Branding
* **Date:** Sprint Minute 20
* **Context:** The user provided two authentic visual assets: the round wooden carved "Bawaal Chaiwala" signboard (`bawaal-logo.jpg`) and the official stall menu card (`bawaal-menu.jpg`).
* **Decision:** Incorporated the official logo directly into the brand header and created an interactive "Bawaal Menu" modal. Mapped game recipe and pricing logic to match the items on the card (Kadak Chai ₹15, Kulhad ₹25, Green Tea ₹30, Ayurvedic Kadha ₹35).
* **Consequences:**
  * Delivers high aesthetic polish and authentic Indian tapri ambiance.
  * Creates strong thematic coherence between visual assets and economic simulation.

---

## ADR 03: Minute 40 Twist — Menu Pivot Strategy
* **Date:** Sprint Minute 42
* **Context:** The unlocked twist was a 100% supply shock doubling milk wholesale prices. The challenge specification required deciding whether to *"raise prices, accept lower profit or change the menu."*
* **Decision:** In addition to classic pricing tactics (Raise Price vs Absorb Cost), we introduced the **Menu Pivot** option utilizing the "FITNESS & HEALTH" section of the Bawaal menu: **Ayurvedic Kadha & Green Tea**.
* **Consequences:**
  * Requires **ZERO milk** in its recipe, completely insulating the player from the dairy crisis.
  * Generates high profit margins (₹5.45 cost vs ₹30 price), demonstrating creative entrepreneurial agility.

---

## ADR 04: Judge Evaluation Bar & Verification Pipeline
* **Date:** Sprint Minute 50
* **Context:** Judges and mentors evaluate prototypes using a strict 3-step verification path:
  1. Buy stock and simulate one day of sales.
  2. Show the revenue, costs and profit report.
  3. Trigger the milk price shock and demonstrate decision options.
* **Decision:** Implemented a persistent, sticky `JudgeDemoBar` pinned to the top of the viewport with distinct action triggers for Step 01, Step 02, and Step 03, alongside automated status indicators.
* **Consequences:**
  * Enables mentors and judges to verify compliance in under 60 seconds without manual guesswork.

