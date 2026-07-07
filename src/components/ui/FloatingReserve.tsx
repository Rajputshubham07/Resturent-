"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingReserve() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scroll past hero
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("reservations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="#reservations"
          onClick={handleClick}
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-5 py-3 rounded-full bg-gold-500 text-luxury-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(197,168,128,0.35)] hover:shadow-[0_4px_30px_rgba(197,168,128,0.55)] cursor-pointer group"
        >
          <Calendar className="w-4 h-4 animate-pulse" />
          <span>Reserve Table</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
