"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Premium loading delay
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-black text-foreground"
        >
          {/* Subtle gold glowing dust */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-gold-500/10 blur-[120px] animate-pulse-gold" />
            <div className="absolute bottom-[20%] right-[30%] w-96 h-96 rounded-full bg-gold-600/10 blur-[120px] animate-pulse-gold" style={{ animationDelay: "2s" }} />
          </div>

          <div className="relative flex flex-col items-center select-none">
            {/* Elegant Monogram */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="mb-8 relative flex items-center justify-center w-24 h-24 border border-gold-500/30 rounded-full"
            >
              {/* Spinning accent border */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t border-b border-gold-500 rounded-full"
              />
              <span className="font-serif text-4xl text-gold-500 font-light tracking-widest">É</span>
            </motion.div>

            {/* Restaurant Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }
              }}
              className="font-serif text-3xl md:text-4xl tracking-[0.25em] font-light text-center"
            >
              L&apos;ÉTOILE
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.0, duration: 0.8 }
              }}
              className="mt-3 text-xs tracking-[0.4em] text-gold-500/70 font-light uppercase"
            >
              Haute Gastronomie
            </motion.p>

            {/* Luxury horizontal loader line */}
            <div className="mt-10 w-48 h-[1px] bg-luxury-charcoal relative overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ 
                  left: "100%",
                  transition: { duration: 1.8, ease: "easeInOut", repeat: 0 }
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
