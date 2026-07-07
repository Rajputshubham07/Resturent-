"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <footer className="bg-luxury-black border-t border-gold-500/10 text-gray-400 py-16 px-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold-950/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand Description */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-xl tracking-[0.2em] text-white">L&apos;ÉTOILE</h3>
          <p className="text-xs leading-relaxed font-light text-gray-500 max-w-xs">
            Indulge in a sensory journey of culinary excellence, where each plate is a canvas of haute gastronomy and luxury hospitality.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="p-2 border border-gray-800 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors duration-300" aria-label="Instagram">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2 border border-gray-800 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors duration-300" aria-label="Facebook">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="p-2 border border-gray-800 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors duration-300" aria-label="Twitter">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs tracking-[0.25em] font-semibold text-white uppercase">Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-light">
            <li><a href="#home" className="hover:text-gold-500 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-gold-500 transition-colors">About Us</a></li>
            <li><a href="#menu" className="hover:text-gold-500 transition-colors">Curated Menu</a></li>
            <li><a href="#reservations" className="hover:text-gold-500 transition-colors">Reservations</a></li>
            <li><a href="#events" className="hover:text-gold-500 transition-colors">Exclusive Events</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs tracking-[0.25em] font-semibold text-white uppercase">Contact</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-light text-gray-500">
            <li>
              <span className="text-white">Address:</span> 12 Culinary Avenue, Prime Plaza, India
            </li>
            <li>
              <span className="text-white">Phone:</span> +91 98765 43210
            </li>
            <li>
              <span className="text-white">Email:</span> dining@letoile.com
            </li>
            <li>
              <span className="text-white">Hours:</span> Mon - Sun | 11:00 AM - 11:00 PM
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs tracking-[0.25em] font-semibold text-white uppercase">Newsletter</h4>
          <p className="text-xs leading-relaxed font-light text-gray-500">
            Subscribe to receive exclusive recipes, wine tasting invitations, and seasonal menu announcements.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
            <div className="flex border border-gray-800 focus-within:border-gold-500 transition-colors duration-300">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none py-2 px-3 text-xs text-white placeholder-gray-600 w-full"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gold-500 hover:text-luxury-black transition-colors duration-300 px-4 cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {status === "success" && (
              <span className="text-[10px] text-green-400 font-light">
                Thank you. You have been added to our guest list.
              </span>
            )}
            {status === "error" && (
              <span className="text-[10px] text-red-400 font-light">
                Please enter a valid email address.
              </span>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-gray-600">
        <span>© {new Date().getFullYear()} L&apos;Étoile Restaurant. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gold-500">Privacy Policy</a>
          <a href="#" className="hover:text-gold-500">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
