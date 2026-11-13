import { InventoryMap, MenuItem, WeatherType, ShockDecision } from '../types/game';

export const INITIAL_BUDGET = 500;
export const OVERHEAD_COST_PER_DAY = 50; // Daily stall rent, electricity, tapri cleaning

export const INITIAL_INVENTORY: InventoryMap = {
  tea_leaves: {
    id: 'tea_leaves',
    name: 'Assam CTC Tea Leaves',
    hindiName: 'कड़क चाय पत्ती',
    unit: 'g',
    quantity: 250,
    unitCost: 0.40, // ₹0.40 per gram (₹400 / kg)
    icon: '🍃',
    description: 'Strong CTC blend from upper Assam gardens.'
  },
  milk: {
    id: 'milk',
    name: 'Fresh Dairy Milk',
    hindiName: 'ताज़ा फुल क्रीम दूध',
    unit: 'L',
    quantity: 6,
    unitCost: 60, // ₹60 per Liter
    icon: '🥛',
    description: 'Rich buffalo milk for that thick velvety tapri froth.'
  },
  sugar: {
    id: 'sugar',
    name: 'Pure Cane Sugar',
    hindiName: 'देसी खांड / चीनी',
    unit: 'kg',
    quantity: 1.5,
    unitCost: 50, // ₹50 per kg
    icon: '🍬',
    description: 'Fine crystal sweetness that balances the kadak brew.'
  },
  spices: {
    id: 'spices',
    name: 'Adrak & Elaichi Mix',
    hindiName: 'अदरक और छोटी इलायची',
    unit: 'g',
    quantity: 60,
    unitCost: 1.20, // ₹1.20 per gram
    icon: '🫚',
    description: 'Crushed organic ginger and fragrant green cardamom.'
  },
  cups: {
    id: 'cups',
    name: 'Earthen Kulhad Cups',
    hindiName: 'मिट्टी के कुल्हड़',
    unit: 'pcs',
    quantity: 100,
    unitCost: 1.00, // ₹1.00 per cup
    icon: '☕',
    description: 'Traditional baked clay kulhads giving an earthy aroma.'
  }
};

export const MENU_ITEMS: Record<string, MenuItem> = {
  kadak: {
    id: 'kadak',
    name: 'Bawaal Kadak Chai',
    tagline: 'The undisputed king of Mumbai street tapris',
    defaultPrice: 15,
    currentPrice: 15,
    recipe: {
      tea_leaves: 4,   // 4g
      milk: 0.05,      // 50ml
      sugar: 0.008,    // 8g
      spices: 0.5,     // 0.5g
      cups: 1          // 1 cup
    },
    milkFree: false,
    demandShare: 1.0
  },
  kulhad_special: {
    id: 'kulhad_special',
    name: 'Adrak-Elaichi Kulhad',
    tagline: 'Heavy crushed ginger and fragrant cardamom in clay',
    defaultPrice: 25,
    currentPrice: 25,
    recipe: {
      tea_leaves: 5,   // 5g
      milk: 0.06,      // 60ml
      sugar: 0.010,    // 10g
      spices: 1.5,     // 1.5g
      cups: 1
    },
    milkFree: false,
    demandShare: 1.0
  },
  herbal_kadha: {
    id: 'herbal_kadha',
    name: 'Ayurvedic Kadha & Green Tea (Fitness & Health)',
    tagline: 'Zero milk required! Pure herbal immunity booster',
    defaultPrice: 30,
    currentPrice: 30,
    recipe: {
      tea_leaves: 3,   // 3g
      milk: 0.00,      // 0ml (ZERO MILK!)
      sugar: 0.005,    // 5g
      spices: 2.5,     // 2.5g
      cups: 1
    },
    milkFree: true,
    demandShare: 1.0
  }
};

export const WEATHER_PROFILES: Record<WeatherType, {
  name: string;
  hindi: string;
  icon: string;
  multiplier: number;
  description: string;
  quote: string;
}> = {
  sunny: {
    name: 'Sunny Day',
    hindi: 'धूप खिली है',
    icon: '☀️',
    multiplier: 1.0,
    description: 'Pleasant weather. Steady stream of office goers and college youth.',
    quote: 'Regular crowd looking for their morning 10 AM break.'
  },
  rainy: {
    name: 'Monsoon Pouring',
    hindi: 'झमाझम बारिश',
    icon: '🌧️',
    multiplier: 1.45,
    description: 'Heavy rain! People rushing under your tarp canopy craving piping hot chai.',
    quote: 'Barish me garam chai aur pakode - demand is through the roof!'
  },
  cold: {
    name: 'Chilly Winter',
    hindi: 'कड़कती ठंड',
    icon: '❄️',
    multiplier: 1.60,
    description: 'Crisp morning breeze. Hands shivering, steaming kulhad chai is a necessity.',
    quote: 'Customers queuing up two deep to wrap hands around warm kulhads.'
  },
  heatwave: {
    name: 'Scorching Heat',
    hindi: 'भीषण गर्मी',
    icon: '🔥',
    multiplier: 0.75,
    description: 'Hot afternoon. Afternoon tea lull, only die-hard chai lovers dropping by.',
    quote: 'A bit slow at noon, but evening crowd still turns up.'
  }
};

export const SHOCK_DECISION_DETAILS: Record<ShockDecision, {
  title: string;
  icon: string;
  tagline: string;
  pros: string;
  cons: string;
  mathExplanation: string;
  badge: string;
  color: string;
}> = {
  raise_price: {
    title: 'Raise Chai Price (+₹5)',
    icon: '📈',
    tagline: 'Pass the doubled milk cost on to the customers',
    pros: 'Protects your gross profit margin per cup. Generates higher revenue per sale.',
    cons: 'Price-sensitive customers will complain; demand drops by ~22%. Rating -0.2.',
    mathExplanation: 'Price: ₹15 ➔ ₹20. Margin per cup preserved at ~₹9.00 even with milk at ₹120/L.',
    badge: 'Margin Shield',
    color: 'emerald'
  },
  absorb: {
    title: 'Absorb the Cost (Loyalty Strategy)',
    icon: '🤝',
    tagline: 'Take the hit on your margins to maintain customer goodwill',
    pros: 'Zero customer attrition! Loyal crowd raves about your integrity (+0.6 rating boost).',
    cons: 'Cost of goods sold spikes. Net profit drops by ~45% unless volume increases.',
    mathExplanation: 'Price remains ₹15. Milk cost per cup rises from ₹3.00 to ₹6.00.',
    badge: 'Customer First',
    color: 'amber'
  },
  substitute_menu: {
    title: 'Pivot Menu: Fitness & Herbal Kadha',
    icon: '🌿',
    tagline: 'Promote zero-milk Ayurvedic Kadha & Green Tea (Menu Surprise)',
    pros: 'Slashes milk consumption by 65%! Premium pricing (₹25-₹30) delivers huge profit margins.',
    cons: 'Requires stocking more ginger, elaichi, and spices. Some kadak purists hesitate.',
    mathExplanation: 'Zero milk needed for Kadha. Ingredient cost is only ₹4.50 vs ₹30 selling price!',
    badge: 'Innovation Masterstroke',
    color: 'purple'
  }
};

