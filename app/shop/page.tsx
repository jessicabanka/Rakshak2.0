'use client';

import React, { useState, useEffect } from 'react';
import Cart from './Cart';

// Define types
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  { id: 1, name: 'Pepper Spray', price: 254, image: '/img/pepper-spray.webp' },
  { id: 2, name: 'Self-Defense Keychain', price: 305, image: '/img/keychain.jpg' },
  { id: 3, name: 'Tactical Flashlight', price: 695, image: '/img/flashlight.webp' },
  { id: 4, name: 'Personal Alarm', price: 515, image: '/img/alarm.jpg' },
];

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const handleAddToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id: number) => {
    const productToRemove = cart.find((item) => item.id === id);

    if (productToRemove && productToRemove.quantity > 1) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10 relative">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
        Self-Defense Tools
      </h1>

      {/* Cart Button */}
      <div className="text-right mb-6">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow-md transition"
        >
          🛒 View Cart ({loading ? '0' : totalItemsInCart})
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 text-white rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-105 transition duration-200"
          >
            <div className="w-full h-48 flex items-center justify-center bg-white rounded mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-lg text-gray-300 mt-1">₹{product.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Component */}
      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={handleRemoveFromCart}
        />
      )}

      {/* Back to Home */}
      <div className="text-center mt-12">
        <a
          href="/"
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition font-medium shadow-md"
        >
          ⬅ Back to Home
        </a>
      </div>
    </div>
  );
}