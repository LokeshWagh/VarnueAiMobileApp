// Dummy Menu Data for Demo/Presentation
// This file contains sample categories and menu items with Indian restaurant context

export const DUMMY_CATEGORIES = [
  {
    id: "cat-001",
    name: "Starters",
    description: "Appetizers and snacks to begin your meal",
    icon: "🍢",
    order: 1,
  },
  {
    id: "cat-002",
    name: "Main Course",
    description: "Hearty main dishes",
    icon: "🍛",
    order: 2,
  },
  {
    id: "cat-003",
    name: "Breads",
    description: "Freshly baked Indian breads",
    icon: "🫓",
    order: 3,
  },
  {
    id: "cat-004",
    name: "Rice & Biryani",
    description: "Aromatic rice dishes",
    icon: "🍚",
    order: 4,
  },
  {
    id: "cat-005",
    name: "Desserts",
    description: "Sweet treats to end your meal",
    icon: "🍮",
    order: 5,
  },
  {
    id: "cat-006",
    name: "Beverages",
    description: "Refreshing drinks",
    icon: "🥤",
    order: 6,
  },
];

// Side dishes that can be added
export const DUMMY_SIDES = [
  {
    id: "side-001",
    name: "Raita",
    description: "Yogurt with cucumber and spices",
    price: 85,
    isVeg: true,
  },
  {
    id: "side-002",
    name: "Green Salad",
    description: "Fresh mixed greens",
    price: 115,
    isVeg: true,
  },
  {
    id: "side-003",
    name: "Papad",
    description: "Crispy lentil crackers",
    price: 35,
    isVeg: true,
  },
];

// Helper functions
export const getDummyMenuItemsByCategoryId = (categoryId: string) => {
  if (categoryId === "all") {
    return DUMMY_MENU_ITEMS;
  }
  return DUMMY_MENU_ITEMS.filter((item) => item.categoryId === categoryId);
};

export const getDummyCategoryById = (categoryId: string) => {
  return DUMMY_CATEGORIES.find((cat) => cat.id === categoryId);
};

export const getDummyMenuItemById = (itemId: string) => {
  return DUMMY_MENU_ITEMS.find((item) => item.id === itemId);
};

export const getAllDummyCategories = () => {
  return DUMMY_CATEGORIES;
};

export const getAllDummyMenuItems = () => {
  return DUMMY_MENU_ITEMS;
};
