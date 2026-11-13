export type WeatherType = 'sunny' | 'rainy' | 'cold' | 'heatwave';

export interface Ingredient {
  id: string;
  name: string;
  hindiName: string;
  unit: string;
  quantity: number;
  unitCost: number;
  icon: string;
  description: string;
}

export interface InventoryMap {
  tea_leaves: Ingredient;
  milk: Ingredient;
  sugar: Ingredient;
  spices: Ingredient;
  cups: Ingredient;
}

export type MenuType = 'kadak' | 'kulhad_special' | 'herbal_kadha';

export interface MenuItem {
  id: MenuType;
  name: string;
  tagline: string;
  defaultPrice: number;
  currentPrice: number;
  recipe: {
    tea_leaves: number; // in grams
    milk: number;       // in liters
    sugar: number;      // in kg
    spices: number;     // in grams
    cups: number;       // in units
  };
  milkFree: boolean;
  demandShare: number; // percentage of orders when active
}

export interface CustomerFeedback {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DailyReport {
  day: number;
  weather: WeatherType;
  chaiPrice: number;
  cupsSold: number;
  cupsDemanded: number;
  cupsLostToStockout: number;
  grossRevenue: number;
  ingredientCost: number;
  overheadCost: number;
  totalCost: number;
  netProfit: number;
  closingBudget: number;
  customerRating: number;
  feedbacks: CustomerFeedback[];
  limitingIngredient: string | null;
  activeMenu: MenuType;
  shockActive: boolean;
}

export type ShockDecision = 'raise_price' | 'absorb' | 'substitute_menu';

export interface ShockEventState {
  triggered: boolean;
  triggeredOnDay: number;
  resolved: boolean;
  decision: ShockDecision | null;
  oldMilkPrice: number;
  newMilkPrice: number;
  priceIncreaseAmount: number;
  substituteMenuActivated: boolean;
}

export interface GameState {
  day: number;
  budget: number;
  startingBudget: number;
  chaiPrice: number;
  inventory: InventoryMap;
  weather: WeatherType;
  activeMenu: MenuType;
  shock: ShockEventState;
  reports: DailyReport[];
  isSimulating: boolean;
  gameStatus: 'planning' | 'simulating' | 'report' | 'shock_alert';
}

