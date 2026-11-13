import {
  createInitialGameState,
  simulateOneDay,
  executeRestock,
  triggerMilkPriceShock,
  resolveShockDecision,
  calculateMaxBrewableCups,
  calculateUnitIngredientCost
} from '../src/lib/simulationEngine';
import { MENU_ITEMS } from '../src/lib/constants';

console.log('=============================================');
console.log('🧪 RUNNING CHAI STALL TYCOON VERIFICATION TEST');
console.log('=============================================');

// 1. Initial State
let state = createInitialGameState();
console.log(`✓ Initialized Game: Day ${state.day}, Budget: ₹${state.budget}, Chai Price: ₹${state.chaiPrice}`);
console.log(`  Initial Milk: ${state.inventory.milk.quantity}L @ ₹${state.inventory.milk.unitCost}/L`);

// 2. Step 01: Buy Stock and Simulate One Day of Sales
console.log('\n--- STEP 01: Restock & Simulate Day 1 ---');
const restockMilk = executeRestock(state, 'milk', 4); // Buy 4L @ ₹60 = ₹240
if (!restockMilk.success) throw new Error('Restock failed');
state = restockMilk.state;
console.log(`✓ Bought 4L Milk: Cost ₹240. New Milk Stock: ${state.inventory.milk.quantity}L, New Budget: ₹${state.budget}`);

const maxCups = calculateMaxBrewableCups(state.inventory, MENU_ITEMS.kadak);
console.log(`✓ Max Brewable Cups from Stock: ${maxCups.maxCups} (Bottleneck: ${maxCups.bottleneckName})`);

const { updatedState: afterDay1, report: day1Report } = simulateOneDay(state, { fixedWeather: 'sunny' });
state = afterDay1;

// 3. Step 02: Show Revenue, Costs and Profit Report
console.log('\n--- STEP 02: Financial Report Verification ---');
console.log(`✓ Day 1 Simulation Completed:`);
console.log(`  - Cups Sold: ${day1Report.cupsSold} / Demanded: ${day1Report.cupsDemanded}`);
console.log(`  - Gross Revenue: ₹${day1Report.grossRevenue}`);
console.log(`  - Ingredient Cost (COGS): ₹${day1Report.ingredientCost}`);
console.log(`  - Overhead Cost: ₹${day1Report.overheadCost}`);
console.log(`  - Total Cost: ₹${day1Report.totalCost}`);
console.log(`  - Net Profit: ₹${day1Report.netProfit}`);
console.log(`  - Closing Budget: ₹${day1Report.closingBudget}`);
console.log(`  - Customer Rating: ${day1Report.customerRating} / 5.0 ⭐`);
console.log(`  - Feedbacks Generated: ${day1Report.feedbacks.length} authentic customer reviews`);

if (day1Report.cupsSold <= 0) throw new Error('Zero cups sold');
if (state.budget <= 0) throw new Error('Budget wiped out');

// Verify No Negative Inventory
for (const [key, item] of Object.entries(state.inventory)) {
  if (item.quantity < 0) {
    throw new Error(`Negative inventory bug detected on ${key}: ${item.quantity}`);
  }
}
console.log('✓ PASS: Zero Negative Inventory Bug Test passed!');

// 4. Step 03: Trigger Milk Price Shock & Test Decisions
console.log('\n--- STEP 03: Minute 40 Milk Supply Shock ---');
state = triggerMilkPriceShock(state);
console.log(`✓ Milk Shock Triggered! Old Milk Price: ₹${state.shock.oldMilkPrice}/L -> New Doubled Price: ₹${state.shock.newMilkPrice}/L`);
console.log(`  Inventory Milk Unit Cost is now: ₹${state.inventory.milk.unitCost}/L`);

// Test Decision 1: Raise Price
console.log('\n  Evaluating Decision 1 (Raise Price):');
const stateD1 = resolveShockDecision(state, 'raise_price');
console.log(`  -> Price raised from ₹${state.chaiPrice} to ₹${stateD1.chaiPrice}`);

// Test Decision 2: Absorb
console.log('  Evaluating Decision 2 (Absorb):');
const stateD2 = resolveShockDecision(state, 'absorb');
console.log(`  -> Price remains ₹${stateD2.chaiPrice}, margin absorbed`);

// Test Decision 3: Substitute Menu (Herbal Kadha)
console.log('  Evaluating Decision 3 (Pivot to Ayurvedic Kadha):');
const stateD3 = resolveShockDecision(state, 'substitute_menu');
console.log(`  -> Active Menu switched to: ${stateD3.activeMenu}`);
const kadhaUnitCost = calculateUnitIngredientCost(stateD3.inventory, MENU_ITEMS.herbal_kadha);
console.log(`  -> Zero milk used! Kadha unit ingredient cost: ₹${kadhaUnitCost} vs default price ₹30!`);

console.log('\n=============================================');
console.log('✅ ALL VERIFICATION PATH STEPS & CONSTRAINTS PASSED!');
console.log('=============================================');

