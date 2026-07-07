"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function Counter({ endValue, duration = 2 }: { endValue: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = endValue;
    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 30);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, endValue, duration]);

  return <span ref={nodeRef}>{count}</span>;
}

export default function ChefSpotlight() {
  return (
    <section className="py-24 bg-luxury-dark border-t border-b border-gold-500/5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Chef Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 relative h-[400px] md:h-[500px] w-full overflow-hidden border border-gold-500/20 shadow-2xl group"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            >
              <source src="/Resturent Kitchen.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/30 to-transparent" />
            
            {/* Tag on Video */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-luxury-black/80 backdrop-blur-md border border-gold-500/20">
              <span className="text-[10px] tracking-[0.25em] text-gold-500 uppercase font-semibold">Live Kitchen Action</span>
            </div>
          </motion.div>

          {/* Right Side: Chef Information */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">The Culinary Visionary</span>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl tracking-wider text-white uppercase">
                Chef Sunil Kumar
              </h2>
              <div className="mt-4 w-16 h-[1px] bg-gold-500" />
            </div>

            <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed">
              With over 15 years of culinary experience in Paris, Tokyo, and London, Chef Sunil Kumar blends precision engineering with organic flavors. Known for his microscopic attention to ingredient temperatures, Sunil Kumar transforms classical French cuisine into modern theatrical experiences.
            </p>

            <blockquote className="border-l border-gold-500 pl-6 py-1 text-gold-500/90 italic font-serif text-lg">
              &quot;Plating is like a performance. The dish must first excite the eye, then dance on the palate, and finally leave a footprint in the memory.&quot;
            </blockquote>

            {/* Statistics Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-900">
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-serif text-white">
                  <Counter endValue={2} />
                </span>
                <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-light">Michelin Stars</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-serif text-white">
                  <Counter endValue={15} />
                </span>
                <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-light">Years Experience</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-serif text-white">
                  <Counter endValue={45} />+
                </span>
                <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-light">Bespoke Recipes</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
