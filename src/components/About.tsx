"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase"
          >
            Our Philosophy
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-3 font-serif text-3xl md:text-5xl tracking-[0.1em] text-white uppercase"
          >
            The Essence of L&apos;Étoile
          </motion.h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Story text */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 flex flex-col gap-6 text-gray-300 font-light text-sm md:text-base leading-relaxed"
          >
            <h3 className="font-serif text-2xl text-white tracking-[0.05em] mb-2 uppercase">
              A Symphony of Taste & Sophistication
            </h3>
            <p>
              Founded in 2018, L&apos;Étoile emerged from a singular vision: to create an culinary sanctuary where traditional technique meets avant-garde innovation. Every detail of our dining room, from the ambient light projection to the textured linen, is carefully curated to elevate your sensory experience.
            </p>
            <p>
              Under the culinary leadership of our renowned masters, we source only the most exceptional ingredients from local artisanal growers and international luxury markets. Our menus evolve with the macro-seasons, ensuring that each visit reveals new flavor profiles and artistic configurations.
            </p>
            <p className="text-gold-500/90 italic font-serif text-lg mt-2">
              &quot;Gastronomy is the art of using food to create happiness.&quot;
            </p>
          </motion.div>

          {/* Right Column: Split Image Collage */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative h-[480px]">
            {/* Top-left Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-7 relative h-[280px] overflow-hidden group border border-gold-500/10 shadow-2xl"
            >
              <Image
                src="/interior1.avif"
                alt="L'Étoile Ambient Interior"
                fill
                sizes="(max-w-768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Bottom-right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="col-span-5 col-start-8 self-end relative h-[320px] overflow-hidden group border border-gold-500/10 shadow-2xl"
            >
              <Image
                src="/interior2.avif"
                alt="Luxury Dining Experience"
                fill
                sizes="(max-w-768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Inset Accent Border Box */}
            <div className="absolute top-[40%] left-[10%] w-[80%] h-[50%] border border-gold-500/20 -z-10 pointer-events-none" />
          </div>
        </div>

        {/* Second Row: Chef Spotlight & Philosophy */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Images */}
          <div className="lg:col-span-6 order-last lg:order-first grid grid-cols-12 gap-4 relative h-[480px]">
            {/* Top-right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-5 col-start-1 relative h-[320px] overflow-hidden group border border-gold-500/10 shadow-2xl"
            >
              <Image
                src="/interior3.avif"
                alt="Chef Preparing Dishes"
                fill
                sizes="(max-w-768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            {/* Bottom-left Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="col-span-7 col-start-6 self-end relative h-[300px] overflow-hidden group border border-gold-500/10 shadow-2xl"
            >
              <Image
                src="/interior5.avif"
                alt="Crafting the Experience"
                fill
                sizes="(max-w-768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            <div className="absolute top-[10%] left-[20%] w-[70%] h-[70%] border border-gold-500/20 -z-10 pointer-events-none" />
          </div>

          {/* Right Column: Culinary Art & Chef Text */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 flex flex-col gap-6 text-gray-300 font-light text-sm md:text-base leading-relaxed"
          >
            <h3 className="font-serif text-2xl text-white tracking-[0.05em] mb-2 uppercase">
              Culinary Artistry Redefined
            </h3>
            <p>
              Our culinary philosophy is simple: celebrate the pure taste of local ingredients. By utilizing modern preparation techniques like sous-vide, liquid nitrogen flash freezing, and wood-fire smoking, we enhance natural flavors rather than masking them.
            </p>
            <p>
              Led by Executive Chef Sunil Kumar, our culinary crew operates like a chamber orchestra. Every cut is measured to the millimeter; every reduction is timed to the second; every plate is hand-checked under direct kitchen spotlighting before serving.
            </p>
            <p>
              Our restaurant has been recognized with the Michelin Star of culinary excellence and holds the TripAdvisor Grand Award. We invite you to sit back, disconnect from the outer world, and immerse your senses in our bespoke dining journey.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
