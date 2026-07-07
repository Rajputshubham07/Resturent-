"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const signatureDishes = [
  {
    name: "Saffron Banana French Toast",
    description: "Artisanal thick-sliced brioche soaked in saffron cardamom batter, griddled golden, and loaded with sliced bananas and fresh blueberries.",
    price: "₹349",
    image: "/banana-blueberry-french-toast.avif",
    tag: "Signature Dessert",
  },
  {
    name: "L&apos;Étoile BBQ Pork Ribs Board",
    description: "Double slabs of tender pork ribs dry-rubbed with signature spices, wood-fire smoked, and glazed in premium tangy house BBQ sauce.",
    price: "₹699",
    image: "/bbq-pork-ribs-board.avif",
    tag: "Chef Special Main",
  },
  {
    name: "Gourmet Steamed Momos",
    description: "Delicately folded thin-skin dumplings filled with seasoned vegetables, served with fire-roasted red chili sauce and garlic mayonnaise.",
    price: "₹279",
    image: "/steamed-momos.jpg",
    tag: "Artisanal Starter",
  },
];

export default function SignatureDishes() {
  return (
    <section className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Gastronomic Art</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Signature Creations
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signatureDishes.map((dish, index) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="glass-panel group relative overflow-hidden flex flex-col h-full hover:border-gold-500/30 transition-colors duration-500"
            >
              {/* Image Frame */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-w-768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Light black overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                
                {/* Gold Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-luxury-black/90 backdrop-blur-md border border-gold-500/20 text-[9px] tracking-[0.2em] uppercase text-gold-500 font-semibold">
                  {dish.tag}
                </div>
              </div>

              {/* Content Description */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold-500 transition-colors duration-300 uppercase tracking-wide">
                      {dish.name}
                    </h3>
                    <span className="text-gold-500 font-medium text-sm tracking-widest">{dish.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {dish.description}
                  </p>
                </div>
                
                {/* Order / Learn More Interaction */}
                <div className="mt-6 pt-4 border-t border-gray-900 flex justify-between items-center text-[10px] tracking-[0.2em] uppercase">
                  <span className="text-gray-500 font-light">Available for Dinner</span>
                  <a href="#reservations" className="text-gold-500 font-semibold hover:text-white transition-colors duration-300">
                    Book Experience →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
