import {
  GameState,
  InventoryMap,
  MenuItem,
  DailyReport,
  CustomerFeedback,
  ShockDecision,
  WeatherType,
  MenuType
} from '../types/game';
import {
  INITIAL_BUDGET,
  INITIAL_INVENTORY,
  MENU_ITEMS,
  OVERHEAD_COST_PER_DAY,
  WEATHER_PROFILES
} from './constants';

export function createInitialGameState(): GameState {
  // Deep clone initial inventory
  const clonedInventory: InventoryMap = JSON.parse(JSON.stringify(INITIAL_INVENTORY));

  return {
    day: 1,
    budget: INITIAL_BUDGET,
    startingBudget: INITIAL_BUDGET,
    chaiPrice: 15,
    inventory: clonedInventory,
    weather: 'sunny',
    activeMenu: 'kadak',
    shock: {
      triggered: false,
      triggeredOnDay: 0,
      resolved: false,
      decision: null,
      oldMilkPrice: 60,
      newMilkPrice: 120,
      priceIncreaseAmount: 5,
      substituteMenuActivated: false
    },
    reports: [],
    isSimulating: false,
    gameStatus: 'planning'
  };
}

export interface MaxCupsResult {
  maxCups: number;
  bottleneckIngredient: string;
  bottleneckName: string;
  limitingAmounts: Record<string, number>;
}

export function calculateMaxBrewableCups(
  inventory: InventoryMap,
  menuItem: MenuItem
): MaxCupsResult {
  const recipe = menuItem.recipe;
  const limitingAmounts: Record<string, number> = {};

  // Tea
  limitingAmounts.tea_leaves = recipe.tea_leaves > 0
    ? Math.floor(inventory.tea_leaves.quantity / recipe.tea_leaves)
    : 999999;

  // Milk (Kadha requires 0 milk)
  limitingAmounts.milk = recipe.milk > 0
    ? Math.floor(inventory.milk.quantity / recipe.milk)
    : 999999;

  // Sugar
  limitingAmounts.sugar = recipe.sugar > 0
    ? Math.floor(inventory.sugar.quantity / recipe.sugar)
    : 999999;

  // Spices
  limitingAmounts.spices = recipe.spices > 0
    ? Math.floor(inventory.spices.quantity / recipe.spices)
    : 999999;

  // Cups
  limitingAmounts.cups = recipe.cups > 0
    ? Math.floor(inventory.cups.quantity / recipe.cups)
    : 999999;

  let minCups = Infinity;
  let bottleneck = 'tea_leaves';

  for (const [key, cups] of Object.entries(limitingAmounts)) {
    if (cups < minCups) {
      minCups = cups;
      bottleneck = key;
    }
  }

  const nameMap: Record<string, string> = {
    tea_leaves: 'Tea Leaves (चाय पत्ती)',
    milk: 'Milk (दूध)',
    sugar: 'Sugar (चीनी)',
    spices: 'Spices / Ginger (अदरक-मसाला)',
    cups: 'Kulhad Cups (कुल्हड़)'
  };

  return {
    maxCups: Math.max(0, minCups === Infinity ? 0 : minCups),
    bottleneckIngredient: bottleneck,
    bottleneckName: nameMap[bottleneck] || bottleneck,
    limitingAmounts
  };
}

export function calculateUnitIngredientCost(
  inventory: InventoryMap,
  menuItem: MenuItem
): number {
  const r = menuItem.recipe;
  const cost =
    r.tea_leaves * inventory.tea_leaves.unitCost +
    r.milk * inventory.milk.unitCost +
    r.sugar * inventory.sugar.unitCost +
    r.spices * inventory.spices.unitCost +
    r.cups * inventory.cups.unitCost;

  return Math.round(cost * 100) / 100;
}

export function calculateDemand(
  chaiPrice: number,
  weather: WeatherType,
  activeMenu: MenuType,
  rushBonus: number = 1.25
): { demandedCups: number; priceSensitivity: number } {
  const baseDemand = 100;
  const weatherMult = WEATHER_PROFILES[weather]?.multiplier ?? 1.0;

  // Normal sweet spot is ₹15
  let priceSensitivity = 1.0;
  if (chaiPrice <= 15) {
    // Discount bonus
    priceSensitivity = Math.min(1.35, 1.0 + (15 - chaiPrice) * 0.04);
  } else {
    // Price hike elasticity
    priceSensitivity = Math.max(0.20, 1.0 - (chaiPrice - 15) * 0.052);
  }

  // Menu appeal bonus
  let menuBonus = 1.0;
  if (activeMenu === 'kulhad_special') menuBonus = 1.08;
  if (activeMenu === 'herbal_kadha' && (weather === 'rainy' || weather === 'cold')) {
    menuBonus = 1.22; // Kadha is extra popular in bad weather!
  }

  const calculated = Math.floor(baseDemand * weatherMult * rushBonus * priceSensitivity * menuBonus);
  return {
    demandedCups: Math.max(15, calculated),
    priceSensitivity: Math.round(priceSensitivity * 100) / 100
  };
}

export function generateCustomerFeedbacks(
  cupsSold: number,
  cupsLost: number,
  chaiPrice: number,
  rating: number,
  activeMenu: MenuType,
  shockDecision: ShockDecision | null
): CustomerFeedback[] {
  const pool: CustomerFeedback[] = [];

  // Feedback 1: Product quality / Taste
  if (activeMenu === 'herbal_kadha') {
    pool.push({
      id: 'fb-1',
      name: 'Dr. Ananya Sen',
      role: 'Ayurvedic Wellness Enthusiast',
      avatar: '🩺',
      rating: 5,
      comment: 'The Herbal Kadha with ginger and honey was soothing for my throat! So refreshing to see a healthy tapri option.',
      sentiment: 'positive'
    });
  } else if (rating >= 4.0) {
    pool.push({
      id: 'fb-1',
      name: 'Sharma Ji',
      role: 'Daily Tapri Regular',
      avatar: '👴',
      rating: 5,
      comment: 'Bawaal Kadak Chai is unmatched! The adrak-elaichi balance in the earthen kulhad gives absolute bliss.',
      sentiment: 'positive'
    });
  } else {
    pool.push({
      id: 'fb-1',
      name: 'Rohan Mehra',
      role: 'Office Commuter',
      avatar: '💼',
      rating: 3,
      comment: 'Chai was okay today, but queue was long and they seemed rushed.',
      sentiment: 'neutral'
    });
  }

  // Feedback 2: Price / Value
  if (chaiPrice > 22) {
    pool.push({
      id: 'fb-2',
      name: 'Pooja Verma',
      role: 'College Student',
      avatar: '🎒',
      rating: 2,
      comment: `₹${chaiPrice} for a cup is getting steep for our student budget! Please give college discount bhaiyya.`,
      sentiment: 'negative'
    });
  } else if (shockDecision === 'absorb') {
    pool.push({
      id: 'fb-2',
      name: 'Kabir Patel',
      role: 'Local Shopkeeper',
      avatar: '🏬',
      rating: 5,
      comment: 'All the other stalls raised rates because of milk costs, but Bawaal Chaiwala kept rates steady. True neighborhood respect!',
      sentiment: 'positive'
    });
  } else {
    pool.push({
      id: 'fb-2',
      name: 'Aarav Joshi',
      role: 'IT Professional',
      avatar: '💻',
      rating: 4,
      comment: `₹${chaiPrice} is totally worth it. Quick service and steaming hot cutting chai.`,
      sentiment: 'positive'
    });
  }

  // Feedback 3: Stock availability / Rush
  if (cupsLost > 15) {
    pool.push({
      id: 'fb-3',
      name: 'Mohd. Rafiq',
      role: 'Auto Driver',
      avatar: '🛺',
      rating: 2,
      comment: `Reached the stall at 5 PM and they were out of stock! Lost customers like me because stock wasn't planned properly.`,
      sentiment: 'negative'
    });
  } else {
    pool.push({
      id: 'fb-3',
      name: 'Deepika Nair',
      role: 'Freelance Designer',
      avatar: '🎨',
      rating: 5,
      comment: 'Fast steaming service even during the 5:30 PM peak rush. The earthen kulhad aroma makes every sip therapeutic.',
      sentiment: 'positive'
    });
  }

  return pool;
}

export function simulateOneDay(
  currentState: GameState,
  options?: { fixedWeather?: WeatherType; fixedRushBonus?: number }
): { updatedState: GameState; report: DailyReport } {
  const currentMenu = MENU_ITEMS[currentState.activeMenu] || MENU_ITEMS.kadak;
  const weather = options?.fixedWeather || currentState.weather;
  const rushBonus = options?.fixedRushBonus || (1.20 + (Math.random() * 0.18));

  // 1. Calculate Demand
  const { demandedCups } = calculateDemand(
    currentState.chaiPrice,
    weather,
    currentState.activeMenu,
    rushBonus
  );

  // 2. Calculate Max Brewable Cups based on stock
  const { maxCups, bottleneckName, bottleneckIngredient } = calculateMaxBrewableCups(
    currentState.inventory,
    currentMenu
  );

  // 3. Cups actually sold
  const cupsSold = Math.min(demandedCups, maxCups);
  const cupsLost = Math.max(0, demandedCups - cupsSold);

  // 4. Exact Inventory Deduction (Zero Negative Inventory Guaranteed!)
  const updatedInventory: InventoryMap = JSON.parse(JSON.stringify(currentState.inventory));
  const recipe = currentMenu.recipe;

  // Deduct exactly what was consumed for the cups brewed
  updatedInventory.tea_leaves.quantity = Math.max(
    0,
    Math.round((updatedInventory.tea_leaves.quantity - cupsSold * recipe.tea_leaves) * 100) / 100
  );

  updatedInventory.milk.quantity = Math.max(
    0,
    Math.round((updatedInventory.milk.quantity - cupsSold * recipe.milk) * 1000) / 1000
  );

  updatedInventory.sugar.quantity = Math.max(
    0,
    Math.round((updatedInventory.sugar.quantity - cupsSold * recipe.sugar) * 1000) / 1000
  );

  updatedInventory.spices.quantity = Math.max(
    0,
    Math.round((updatedInventory.spices.quantity - cupsSold * recipe.spices) * 100) / 100
  );

  updatedInventory.cups.quantity = Math.max(
    0,
    Math.round(updatedInventory.cups.quantity - cupsSold * recipe.cups)
  );

  // 5. Cost of Goods Sold (COGS) & Financials
  const unitCost = calculateUnitIngredientCost(currentState.inventory, currentMenu);
  const grossRevenue = Math.round(cupsSold * currentState.chaiPrice * 100) / 100;
  const ingredientCost = Math.round(cupsSold * unitCost * 100) / 100;
  const overheadCost = OVERHEAD_COST_PER_DAY;
  const totalCost = Math.round((ingredientCost + overheadCost) * 100) / 100;
  const netProfit = Math.round((grossRevenue - totalCost) * 100) / 100;
  const closingBudget = Math.round((currentState.budget + netProfit) * 100) / 100;

  // 6. Customer Rating Calculation (1.0 to 5.0)
  let calculatedRating = 4.2;

  // Stockout penalty
  if (cupsLost > 25) calculatedRating -= 0.8;
  else if (cupsLost > 10) calculatedRating -= 0.4;
  else calculatedRating += 0.2; // Reliable fulfillment bonus

  // Price fairness factor
  if (currentState.chaiPrice <= 15) calculatedRating += 0.3;
  else if (currentState.chaiPrice > 25) calculatedRating -= 0.5;

  // Shock decision bonus/penalty
  if (currentState.shock.decision === 'absorb') {
    calculatedRating += 0.6; // huge customer appreciation
  } else if (currentState.shock.decision === 'substitute_menu') {
    calculatedRating += 0.4; // creative new variety
  }

  // Clamp rating between 1.0 and 5.0
  const finalRating = Math.round(Math.min(5.0, Math.max(1.0, calculatedRating)) * 10) / 10;

  // 7. Customer Feedbacks
  const feedbacks = generateCustomerFeedbacks(
    cupsSold,
    cupsLost,
    currentState.chaiPrice,
    finalRating,
    currentState.activeMenu,
    currentState.shock.decision
  );

  // 8. Construct Report
  const report: DailyReport = {
    day: currentState.day,
    weather,
    chaiPrice: currentState.chaiPrice,
    cupsSold,
    cupsDemanded: demandedCups,
    cupsLostToStockout: cupsLost,
    grossRevenue,
    ingredientCost,
    overheadCost,
    totalCost,
    netProfit,
    closingBudget,
    customerRating: finalRating,
    feedbacks,
    limitingIngredient: cupsLost > 0 ? bottleneckName : null,
    activeMenu: currentState.activeMenu,
    shockActive: currentState.shock.triggered
  };

  // Next weather selection
  const weatherChoices: WeatherType[] = ['sunny', 'rainy', 'cold', 'sunny'];
  const nextWeather = weatherChoices[currentState.day % weatherChoices.length];

  const updatedState: GameState = {
    ...currentState,
    day: currentState.day + 1,
    budget: closingBudget,
    inventory: updatedInventory,
    weather: nextWeather,
    reports: [...currentState.reports, report],
    gameStatus: 'report'
  };

  return { updatedState, report };
}

export function executeRestock(
  currentState: GameState,
  ingredientKey: keyof InventoryMap,
  quantityToAdd: number
): { success: boolean; state: GameState; error?: string } {
  if (quantityToAdd <= 0) {
    return { success: false, state: currentState, error: 'Quantity must be positive' };
  }

  const item = currentState.inventory[ingredientKey];
  const totalCost = Math.round(quantityToAdd * item.unitCost * 100) / 100;

  if (totalCost > currentState.budget) {
    return {
      success: false,
      state: currentState,
      error: `Insufficient budget! Need ₹${totalCost.toFixed(2)}, but you only have ₹${currentState.budget.toFixed(2)}.`
    };
  }

  const updatedInventory: InventoryMap = JSON.parse(JSON.stringify(currentState.inventory));
  updatedInventory[ingredientKey].quantity =
    Math.round((updatedInventory[ingredientKey].quantity + quantityToAdd) * 1000) / 1000;

  const newBudget = Math.round((currentState.budget - totalCost) * 100) / 100;

  return {
    success: true,
    state: {
      ...currentState,
      budget: newBudget,
      inventory: updatedInventory
    }
  };
}

export function triggerMilkPriceShock(currentState: GameState): GameState {
  const updatedInventory: InventoryMap = JSON.parse(JSON.stringify(currentState.inventory));
  const oldPrice = updatedInventory.milk.unitCost;
  const doubledPrice = oldPrice * 2; // e.g. ₹60 -> ₹120

  updatedInventory.milk.unitCost = doubledPrice;

  return {
    ...currentState,
    inventory: updatedInventory,
    shock: {
      ...currentState.shock,
      triggered: true,
      triggeredOnDay: currentState.day,
      resolved: false,
      oldMilkPrice: oldPrice,
      newMilkPrice: doubledPrice
    },
    gameStatus: 'shock_alert'
  };
}

export function resolveShockDecision(
  currentState: GameState,
  decision: ShockDecision
): GameState {
  let newChaiPrice = currentState.chaiPrice;
  let newActiveMenu = currentState.activeMenu;
  const updatedInventory: InventoryMap = JSON.parse(JSON.stringify(currentState.inventory));

  if (decision === 'raise_price') {
    // Raise price by ₹5 to offset doubled milk cost
    newChaiPrice = currentState.chaiPrice + 5;
  } else if (decision === 'absorb') {
    // Keep price the same; margins drop, but customer loyalty spikes
    newChaiPrice = currentState.chaiPrice;
  } else if (decision === 'substitute_menu') {
    // Pivot to zero-milk Ayurvedic Kadha & Green Tea
    newActiveMenu = 'herbal_kadha';
    // Offer special discounted herbal tea blend
  }

  return {
    ...currentState,
    chaiPrice: newChaiPrice,
    activeMenu: newActiveMenu,
    inventory: updatedInventory,
    shock: {
      ...currentState.shock,
      resolved: true,
      decision,
      substituteMenuActivated: decision === 'substitute_menu'
    },
    gameStatus: 'planning'
  };
}

