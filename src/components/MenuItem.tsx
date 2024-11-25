import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { MenuItem as MenuItemType, Sauce, Condiment } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { sauces, freeSeasoning } from '../data/sauces';
import { menuItems } from '../data/menu';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType, selectedSauces: Sauce[], selectedCondiments: Condiment[]) => void;
}

export function MenuItem({ item, onAddToCart }: MenuItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedSauces, setSelectedSauces] = useState<Sauce[]>([]);
  const [selectedCondiments, setSelectedCondiments] = useState<Condiment[]>([]);

  const suggestedItems = item.suggestedItems
    ? item.suggestedItems.map(id => menuItems.find(item => item.id === id))
    : [];

  const handleAddToCart = () => {
    if (!showOptions) {
      setShowOptions(true);
      return;
    }
    onAddToCart(item, selectedSauces, selectedCondiments);
    setShowOptions(false);
    setSelectedSauces([]);
    setSelectedCondiments([]);
  };

  const toggleSauce = (sauce: Sauce) => {
    setSelectedSauces(prev => 
      prev.find(s => s.id === sauce.id)
        ? prev.filter(s => s.id !== sauce.id)
        : [...prev, sauce]
    );
  };

  const toggleCondiment = (condiment: Condiment) => {
    setSelectedCondiments(prev =>
      prev.find(c => c.id === condiment.id)
        ? prev.filter(c => c.id !== condiment.id)
        : [...prev, condiment]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative pb-[60%]">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-green-600 font-semibold">R{formatPrice(item.price)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        {showOptions && (
          <div className="mb-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Add Sauces (R12-R15 each):</h4>
              <div className="flex flex-wrap gap-2">
                {sauces.map(sauce => (
                  <button
                    key={sauce.id}
                    onClick={() => toggleSauce(sauce)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedSauces.find(s => s.id === sauce.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sauce.name} (R{sauce.price})
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Add Free Seasonings:</h4>
              <div className="flex flex-wrap gap-2">
                {freeSeasoning.map(condiment => (
                  <button
                    key={condiment.id}
                    onClick={() => toggleCondiment(condiment)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCondiments.find(c => c.id === condiment.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {condiment.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {suggestedItems.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Recommended Add-ons:</h4>
            <div className="space-y-2">
              {suggestedItems.map(suggestion => suggestion && (
                <div key={suggestion.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{suggestion.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">R{formatPrice(suggestion.price)}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors font-medium"
        >
          <Plus size={18} />
          {showOptions ? 'Add to Cart' : 'Select Options'}
        </button>
      </div>
    </div>
  );
}