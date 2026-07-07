"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

const events = [
  {
    title: "Friday Live Music Night",
    date: "Every Friday",
    time: "8:00 PM onwards",
    desc: "Immerse yourself in acoustic jazz melodies performed live by guest artists, while enjoying our signature handcrafted cocktails.",
    image: "/interior5.avif",
  },
  {
    title: "Sunday Family Brunch",
    date: "Every Sunday",
    time: "11:00 AM - 3:00 PM",
    desc: "A luxurious buffet spread of artisanal breads, live carving stations, custom waffles, and bottomless premium mimosas.",
    image: "/dish20.jpg",
  },
  {
    title: "Chef&apos;s Special Tasting",
    date: "Monthly Exclusive",
    time: "Limited Seating | RSVP",
    desc: "A bespoke 7-course tasting menu curated by Chef Sunil Kumar, paired with hand-selected vintage wines from our private cellar.",
    image: "/interior3.avif",
  },
];

export default function Events() {
  return (
    <section id="events" className="py-24 bg-luxury-dark border-t border-b border-gold-500/5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Exclusive Gatherings</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Upcoming Events
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="glass-panel group relative overflow-hidden flex flex-col h-full hover:border-gold-500/30 transition-all duration-500"
            >
              {/* Event Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-w-768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* Event Details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-wider text-gold-500 uppercase font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-gold-500 transition-colors duration-350 uppercase">
                    {event.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {event.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-900">
                  <a
                    href="#reservations"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white hover:text-gold-500 font-semibold transition-colors duration-300"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
