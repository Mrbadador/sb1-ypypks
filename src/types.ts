export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  suggestedItems?: number[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  sauces: Sauce[];
  condiments: Condiment[];
}

export interface Sauce {
  id: number;
  name: string;
  price: number;
}

export interface Condiment {
  id: number;
  name: string;
}