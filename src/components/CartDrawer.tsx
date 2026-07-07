"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-luxury-black border-l border-gold-500/10 z-50 flex flex-col shadow-2xl h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="font-serif text-lg text-white uppercase tracking-wider">Your Order</h2>
                <span className="bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[10px] px-2 py-0.5 rounded-none font-semibold">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border border-gold-500/10 flex items-center justify-center bg-gold-500/5">
                    <ShoppingBag className="w-8 h-8 text-gold-500/40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-sm uppercase tracking-wider font-serif">Cart is empty</p>
                    <p className="text-gray-500 text-xs font-light">Add culinary creations from our menu to start your feast.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-all text-xs uppercase tracking-wider font-semibold rounded-none cursor-pointer"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-gray-900/50 last:border-b-0 group"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 border border-gold-500/5 bg-luxury-dark overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif text-xs sm:text-sm text-white tracking-wide uppercase group-hover:text-gold-500 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.category}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border border-gold-500/20 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-colors text-xs font-light cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-white text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border border-gold-500/20 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-colors text-xs font-light cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        {/* Price */}
                        <span className="text-gold-500 font-serif text-sm tracking-wider">
                          ₹{item.numericPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-900 bg-luxury-dark space-y-4">
                <div className="flex justify-between text-sm uppercase tracking-wider text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gold-500 font-serif text-base font-semibold tracking-wider">₹{subtotal}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                  Taxes, table service, and extra condiments included in final checkout total.
                </p>
                <div className="pt-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full block py-3.5 bg-gold-500 text-luxury-black hover:bg-gold-600 font-serif text-xs uppercase tracking-[0.2em] font-semibold text-center transition-all duration-300 rounded-none cursor-pointer"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
