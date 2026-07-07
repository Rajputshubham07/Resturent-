"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-65 scale-[1.02]"
      >
        <source
          src="/A Cinematic Restaurant Commercial - Panasonic Lumix GH5s footage __ Salute Cafe & Bar_1080p.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Luxury Radial/Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-85% to-luxury-black z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.4)_90%)] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center select-none">
        {/* Animated Gold Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center justify-center w-16 h-16 border border-gold-500/20 rounded-full"
        >
          <span className="font-serif text-2xl text-gold-500 font-light tracking-widest">É</span>
        </motion.div>

        {/* Sub-label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xs md:text-sm tracking-[0.35em] text-gold-500 font-light uppercase mb-4"
        >
          An Unparalleled Gastronomic Journey
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-8xl tracking-[0.15em] font-light text-white leading-tight uppercase"
        >
          L&apos;ÉTOILE
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="mt-6 text-sm md:text-lg tracking-[0.25em] text-gray-300 font-light max-w-2xl"
        >
          Where Every Meal Becomes a Memory
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
        >
          <button
            onClick={(e) => handleScroll(e, "reservations")}
            className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(197,168,128,0.25)] hover:shadow-[0_4px_35px_rgba(197,168,128,0.45)] cursor-pointer"
          >
            Reserve a Table
          </button>
          
          <button
            onClick={(e) => handleScroll(e, "menu")}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-gold-500 text-white hover:text-gold-500 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Floating Bottom Scroll Arrow Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-light">Scroll Down</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500/80 to-transparent animate-[pulse-gold_2s_infinite]" />
        </div>
      </motion.div>
    </section>
  );
}
