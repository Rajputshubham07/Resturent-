"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Hash, LogOut, Clock, ClipboardList, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  mobileNumber: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  serviceCharge: number;
  grandTotal: number;
  paymentMode: string;
  status: string;
  timestamp: string;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { clearCart } = useCart();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [session, setSession] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load session from LocalStorage
  useEffect(() => {
    if (isOpen) {
      const savedSession = localStorage.getItem("etoile_customer_session");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setSession(parsed);
        } catch (e) {
          console.error("Failed to load session:", e);
        }
      }
    }
  }, [isOpen]);

  // Load orders when clicking the orders tab
  useEffect(() => {
    if (isOpen && session?.mobile) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch(`/api/orders/customer?mobile=${session.mobile}`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (err) {
          console.error("Failed to load order history:", err);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();

      // Poll order status every 15 seconds to give live kitchen updates
      const interval = setInterval(fetchOrders, 15000);
      return () => clearInterval(interval);
    }
  }, [isOpen, session, activeTab]);

  const handleLogout = () => {
    if (!confirm("Are you sure you want to end your dining session? This will clear your current cart.")) return;
    localStorage.removeItem("etoile_customer_session");
    clearCart();
    onClose();
    // Refresh page to trigger login modal
    window.location.reload();
  };

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
                <User className="w-5 h-5 text-gold-500" />
                <h2 className="font-serif text-lg text-white uppercase tracking-wider">Customer Portal</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close profile drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs Trigger */}
            <div className="flex border-b border-gray-950 bg-luxury-dark/40 px-6 pt-3 gap-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-3 text-xs uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === "profile" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
                }`}
              >
                My Profile
                {activeTab === "profile" && (
                  <motion.div layoutId="profileTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`pb-3 text-xs uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === "orders" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
                }`}
              >
                Track Orders ({orders.length})
                {activeTab === "orders" && (
                  <motion.div layoutId="profileTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
                )}
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {/* Tab 1: Profile View */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="glass-panel p-6 border border-gray-900 bg-luxury-dark/40 space-y-4">
                    <h3 className="font-serif text-xs text-gold-500 uppercase tracking-widest border-b border-gray-900/50 pb-2">
                      Active Table Session
                    </h3>
                    <div className="space-y-3 font-light text-xs">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">Name:</span>
                        <span className="text-white font-medium ml-auto uppercase tracking-wider">{session?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">Contact:</span>
                        <span className="text-white font-mono ml-auto">{session?.mobile || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">Dining Table:</span>
                        <span className="text-gold-500 font-serif font-bold ml-auto">Table {session?.table || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">Session Start:</span>
                        <span className="text-gray-500 ml-auto">{session?.loginTime || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3.5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-serif text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 rounded-none cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> End Dining Session
                    </button>
                    <p className="text-[10px] text-gray-600 font-light mt-2 text-center leading-relaxed">
                      Ending your session clears your cart and signs you out of your current table.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders View */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {loadingOrders && orders.length === 0 ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border border-gold-500/10 flex items-center justify-center bg-gold-500/5">
                        <ClipboardList className="w-6 h-6 text-gold-500/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white text-xs uppercase tracking-wider font-serif">No orders placed</p>
                        <p className="text-gray-600 text-[11px] font-light">Add culinary creations and checkout to track your kitchen order.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="glass-panel p-5 border border-gray-900 space-y-4">
                          {/* Order Header */}
                          <div className="flex justify-between items-baseline gap-2 border-b border-gray-950 pb-2.5">
                            <span className="font-mono text-white text-xs font-semibold">#{order.id}</span>
                            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-none ${
                              order.status === "completed" 
                                ? "bg-green-500/10 border border-green-500/20 text-green-500" 
                                : order.status === "paid" 
                                ? "bg-blue-500/10 border border-blue-500/20 text-blue-500" 
                                : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Items */}
                          <ul className="space-y-1.5 text-xs font-light text-gray-500">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{item.name} <span className="text-gray-700">x{item.quantity}</span></span>
                                <span className="text-white">{item.price}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Order Total / Payment Mode */}
                          <div className="flex justify-between items-center pt-2.5 border-t border-gray-950 text-xs">
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-gray-600 uppercase tracking-wider">Payment Mode</p>
                              <p className="text-white text-[10px] uppercase tracking-wider font-semibold">
                                {order.paymentMode === "online" ? "Online" : order.paymentMode === "bill" ? "Get Bill" : "Pay Cash"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-600 uppercase tracking-wider">Total Bill</p>
                              <p className="text-gold-500 font-serif font-bold text-sm">₹{order.grandTotal}</p>
                            </div>
                          </div>

                          <div className="text-[9px] text-gray-600 text-right font-light italic">
                            Placed at {order.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
