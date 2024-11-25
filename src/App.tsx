import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Fish } from 'lucide-react';
import { MenuItem as MenuItemComponent } from './components/MenuItem';
import { Cart } from './components/Cart';
import { menuItems } from './data/menu';
import { CartItem, MenuItem, Sauce, Condiment } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: MenuItem, selectedSauces: Sauce[], selectedCondiments: Condiment[]) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => 
        i.id === item.id && 
        JSON.stringify(i.sauces) === JSON.stringify(selectedSauces) &&
        JSON.stringify(i.condiments) === JSON.stringify(selectedCondiments)
      );
      
      if (existingItem) {
        return prev.map(i =>
          i === existingItem ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...prev, { ...item, quantity: 1, sauces: selectedSauces, condiments: selectedCondiments }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      quantity === 0
        ? prev.filter(item => item.id !== id)
        : prev.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Toaster position="top-center" />
      
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Fish className="text-blue-600" size={36} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rosemead Fisheries</h1>
              <p className="text-blue-600 text-sm font-medium">Fresh from the ocean to your plate</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Our Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map(item => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} Rosemead Fisheries. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;