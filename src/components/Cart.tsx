import React, { useCallback } from 'react';
import { ShoppingCart, Trash2, Send } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const saucesTotal = item.sauces.reduce((acc, sauce) => acc + sauce.price * item.quantity, 0);
    return sum + itemTotal + saucesTotal;
  }, 0);

  const handleWhatsAppOrder = useCallback(() => {
    if (items.length === 0) {
      toast.error('Please add items to your cart first');
      return;
    }

    const message = `New Order:\n\n${items
      .map((item) => {
        let itemText = `${item.quantity}x ${item.name} - R${formatPrice(item.price * item.quantity)}`;
        
        if (item.sauces.length > 0) {
          itemText += `\n   Sauces: ${item.sauces.map(s => s.name).join(', ')}`;
        }
        
        if (item.condiments.length > 0) {
          itemText += `\n   Seasonings: ${item.condiments.map(c => c.name).join(', ')}`;
        }
        
        return itemText;
      })
      .join('\n\n')}\n\nTotal: R${formatPrice(total)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+27123456789?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp to send your order!');
  }, [items, total]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="text-green-600" size={24} />
        <h2 className="text-2xl font-semibold">Your Cart</h2>
      </div>
      
      {items.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p className="mb-2">Your cart is empty</p>
          <p className="text-sm">Add some delicious items to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col border-b pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">R{formatPrice(item.price)} each</p>
                    {item.sauces.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Sauces: {item.sauces.map(s => s.name).join(', ')}
                      </p>
                    )}
                    {item.condiments.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Seasonings: {item.condiments.map(c => c.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 p-1 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">R{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-lg font-medium"
            >
              <Send size={20} />
              Send Order via WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
}