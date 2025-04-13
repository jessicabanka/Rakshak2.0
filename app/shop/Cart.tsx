'use client';

import React from 'react';

interface CartProps {
  cart: any[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onClose, onRemove }) => {
  // Calculate total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            &times;
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">Your cart is empty.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-gray-700 pb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-300">₹{item.price}</p>
                    <p className="text-gray-300">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Total Price */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-semibold">Total:</p>
          <p className="text-xl font-semibold">₹{totalPrice.toFixed(2)}</p>
        </div>

        {/* Checkout Button */}
        <div className="mt-4 text-center">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;