"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";

const galleryImages = [
  { id: 1, src: "/dish1.avif", alt: "Signature Entrée Plating" },
  { id: 2, src: "/dish2.avif", alt: "Gourmet Starter Presentation" },
  { id: 3, src: "/dish3.avif", alt: "Charcoal Paneer Tikka" },
  { id: 4, src: "/dish7.avif", alt: "Chocolate Lava Decadence" },
  { id: 5, src: "/dish9.avif", alt: "Tandoori Chicken Masterpiece" },
  { id: 6, src: "/dish10.avif", alt: "New York baked Cheesecake" },
  { id: 7, src: "/interior1.avif", alt: "Luxury Table Settings" },
  { id: 8, src: "/interior2.avif", alt: "Ambient Dining Ambience" },
  { id: 9, src: "/interior3.avif", alt: "Culinary Precision Kitchen" },
  { id: 10, src: "/dish14.jpg", alt: "Smoked Lamb Braise" },
  { id: 11, src: "/dish18.jpg", alt: "Tandoori Paneer Pizza" },
  { id: 12, src: "/interior5.avif", alt: "Master Cocktail Crafting" },
];

export default function Gallery() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section id="gallery" className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Visual Showcase</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            The Gallery
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => openLightbox(index)}
              className="relative overflow-hidden break-inside-avoid border border-gold-500/5 group cursor-pointer"
            >
              <div className="relative w-full h-auto min-h-[220px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={450}
                  height={350}
                  sizes="(max-w-768px) 100vw, 400px"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6 z-10">
                <Maximize2 className="w-5 h-5 text-gold-500 absolute top-4 right-4 pointer-events-none" />
                <span className="text-[10px] tracking-[0.25em] text-gold-500 font-semibold uppercase mb-1">
                  L&apos;Étoile Ambience
                </span>
                <h3 className="font-serif text-sm uppercase text-white tracking-wider">
                  {image.alt}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-8 p-3 bg-white/5 border border-white/10 hover:border-gold-500 text-white hover:text-gold-500 transition-all rounded-full cursor-pointer z-50"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-8 p-3 bg-white/5 border border-white/10 hover:border-gold-500 text-white hover:text-gold-500 transition-all rounded-full cursor-pointer z-50"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Frame */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center select-none"
            >
              <div className="relative w-full h-full max-h-[70vh]">
                <Image
                  src={galleryImages[activeImageIndex].src}
                  alt={galleryImages[activeImageIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="mt-4 text-xs tracking-widest text-gray-400 text-center uppercase font-light">
                {galleryImages[activeImageIndex].alt}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
