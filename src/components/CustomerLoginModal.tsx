"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Hash, Utensils, Check } from "lucide-react";

export default function CustomerLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [table, setTable] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedSession = localStorage.getItem("etoile_customer_session");
    if (!savedSession) {
      setIsOpen(true);
    }
  }, []);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Full name is required";
    if (!table.trim()) tempErrors.table = "Table number is required";
    if (!mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobile.trim())) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          table: table.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        localStorage.setItem("etoile_customer_session", JSON.stringify(data.session));
        
        // Wait for animation, then close
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        alert(data.message || "Failed to start dining session.");
      }
    } catch (error) {
      console.error("Session login error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          className="fixed inset-0 bg-black backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="glass-panel p-8 md:p-10 max-w-md w-full border border-gold-500/20 relative z-10 text-center shadow-2xl bg-luxury-black/90"
        >
          {success ? (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="space-y-6 py-6"
            >
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-gold-500" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-light">Bon Appétit</span>
                <h3 className="font-serif text-xl text-white uppercase tracking-wider mt-2">
                  Session Established
                </h3>
                <p className="text-gray-500 text-xs font-light mt-2">
                  Welcome to L&apos;Étoile, Table {table}.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="w-5 h-5 text-gold-500" />
              </div>
              <span className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-light block mb-2">Welcome Diner</span>
              <h2 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wide mb-2">
                Register Dining Table
              </h2>
              <p className="text-gray-500 text-[11px] font-light mb-8 max-w-xs mx-auto leading-relaxed">
                Please register your table details to browse the seasonal selections and place orders directly to the kitchen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Arthur Pendragon"
                      className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                    />
                    <User className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.name && <span className="text-[10px] text-red-500 font-light">{errors.name}</span>}
                </div>

                {/* Table & Mobile Inputs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Table Number */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Table No</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                        placeholder="e.g., 04"
                        className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-2.5 pl-10 pr-3 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                      />
                      <Hash className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.table && <span className="text-[10px] text-red-500 font-light">{errors.table}</span>}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Mobile Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g., 9876543210"
                        className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                      />
                      <Phone className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.mobile && <span className="text-[10px] text-red-500 font-light">{errors.mobile}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gold-500 text-luxury-black hover:bg-gold-600 font-serif text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-none cursor-pointer mt-6 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Initiating Session..." : "Enter Dining Hall"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
