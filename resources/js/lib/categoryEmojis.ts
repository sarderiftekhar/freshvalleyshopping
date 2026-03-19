import {
    type LucideIcon,
    ShoppingCart,
    Wheat,
    Fish,
    Soup,
    LeafyGreen,
    Beef,
    Cookie,
    Apple,
    Snowflake,
    CupSoda,
    Nut,
    Coffee,
    ShoppingBasket,
    Carrot,
    Egg,
    CakeSlice,
    Candy,
    Drumstick,
    Cherry,
} from 'lucide-react';

export interface CategoryIconConfig {
    icon: LucideIcon;
    color: string;
    bg: string;
}

export const categoryIcons: Record<string, CategoryIconConfig> = {
    'Grocery':               { icon: ShoppingCart,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'Rice & Grains':         { icon: Wheat,         color: 'text-amber-600',   bg: 'bg-amber-50' },
    'Live Fish':             { icon: Fish,          color: 'text-blue-600',    bg: 'bg-blue-50' },
    'Fresh Fish':            { icon: Fish,          color: 'text-sky-600',     bg: 'bg-sky-50' },
    'Frozen Prepared Foods': { icon: Soup,          color: 'text-orange-600',  bg: 'bg-orange-50' },
    'Fresh Vegetables':      { icon: LeafyGreen,    color: 'text-green-600',   bg: 'bg-green-50' },
    'Vegetables':            { icon: Carrot,        color: 'text-orange-500',  bg: 'bg-orange-50' },
    'Fresh Meat':            { icon: Drumstick,     color: 'text-red-600',     bg: 'bg-red-50' },
    'Fresh Meat & Chicken':  { icon: Beef,          color: 'text-red-700',     bg: 'bg-red-50' },
    'Biscuits':              { icon: Cookie,        color: 'text-yellow-700',  bg: 'bg-yellow-50' },
    'Seasonal Fruits':       { icon: Cherry,        color: 'text-rose-600',    bg: 'bg-rose-50' },
    'Fresh Fruits':          { icon: Apple,         color: 'text-rose-500',    bg: 'bg-rose-50' },
    'Chilled Foods':         { icon: Snowflake,     color: 'text-cyan-600',    bg: 'bg-cyan-50' },
    'Frozen Fruit & Veg':    { icon: Snowflake,     color: 'text-sky-600',     bg: 'bg-sky-50' },
    'Frozen Foods':          { icon: Snowflake,     color: 'text-indigo-500',  bg: 'bg-indigo-50' },
    'Drinks':                { icon: CupSoda,       color: 'text-purple-600',  bg: 'bg-purple-50' },
    'Snacks & Drinks':       { icon: Candy,         color: 'text-pink-600',    bg: 'bg-pink-50' },
    'Dry Fruits & Nuts':     { icon: Nut,           color: 'text-amber-700',   bg: 'bg-amber-50' },
    'Tea & Coffee':          { icon: Coffee,        color: 'text-stone-600',   bg: 'bg-stone-100' },
    'Spices & Herbs':        { icon: LeafyGreen,    color: 'text-lime-600',    bg: 'bg-lime-50' },
    'Dairy & Eggs':          { icon: Egg,           color: 'text-yellow-600',  bg: 'bg-yellow-50' },
    'Bakery':                { icon: CakeSlice,     color: 'text-orange-700',  bg: 'bg-orange-50' },
};

const defaultCategoryIcon: CategoryIconConfig = {
    icon: ShoppingBasket,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
};

export function getCategoryIcon(name: string): CategoryIconConfig {
    return categoryIcons[name] || defaultCategoryIcon;
}
