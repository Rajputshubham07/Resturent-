"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Clock, FileText, CheckCircle2 } from "lucide-react";

export default function Reservations() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    specialRequest: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone)) {
      tempErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.date) tempErrors.date = "Please select a date";
    if (!formData.time) tempErrors.time = "Please select a time";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API call simulating database insertion & email trigger
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Clean form
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "2",
        date: "",
        time: "",
        specialRequest: "",
      });
    }, 1800);
  };

  return (
    <section id="reservations" className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Exclusive Booking</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Secure A Table
          </h2>
          <p className="mt-4 text-xs tracking-widest text-gray-500 uppercase font-light">
            Reservations are highly recommended. Walk-ins are accommodated based on availability.
          </p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="reservation-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`bg-luxury-dark border ${
                      errors.name ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                    } py-3 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300`}
                  />
                  {errors.name && <span className="text-[10px] text-red-400 font-light">{errors.name}</span>}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`bg-luxury-dark border ${
                      errors.email ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                    } py-3 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300`}
                  />
                  {errors.email && <span className="text-[10px] text-red-400 font-light">{errors.email}</span>}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +91 9876543210"
                    className={`bg-luxury-dark border ${
                      errors.phone ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                    } py-3 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300`}
                  />
                  {errors.phone && <span className="text-[10px] text-red-400 font-light">{errors.phone}</span>}
                </div>

                {/* Number of Guests */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Guests</label>
                  <div className="relative">
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-luxury-dark border border-gray-800 focus:border-gold-500 py-3 px-4 text-xs text-white outline-none appearance-none transition-colors duration-300"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="7">7 Guests</option>
                      <option value="8">8+ Guests</option>
                    </select>
                    <Users className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Preferred Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full bg-luxury-dark border ${
                        errors.date ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                      } py-3 px-4 text-xs text-white outline-none transition-colors duration-300`}
                    />
                  </div>
                  {errors.date && <span className="text-[10px] text-red-400 font-light">{errors.date}</span>}
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Preferred Time</label>
                  <div className="relative">
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full bg-luxury-dark border ${
                        errors.time ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                      } py-3 px-4 text-xs text-white outline-none appearance-none transition-colors duration-300`}
                    >
                      <option value="">Select Time Slot</option>
                      <option value="12:00 PM">12:00 PM (Lunch)</option>
                      <option value="01:00 PM">01:00 PM (Lunch)</option>
                      <option value="02:00 PM">02:00 PM (Lunch)</option>
                      <option value="07:00 PM">07:00 PM (Dinner)</option>
                      <option value="08:00 PM">08:00 PM (Dinner)</option>
                      <option value="09:00 PM">09:00 PM (Dinner)</option>
                      <option value="10:00 PM">10:00 PM (Dinner)</option>
                    </select>
                    <Clock className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.time && <span className="text-[10px] text-red-400 font-light">{errors.time}</span>}
                </div>

                {/* Special Requests */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Special Request / Dietary Restrictions</label>
                  <textarea
                    name="specialRequest"
                    rows={4}
                    value={formData.specialRequest}
                    onChange={handleChange}
                    placeholder="Enter any requests (e.g., anniversary setup, vegan menu, wheelchair accessible table)..."
                    className="bg-luxury-dark border border-gray-800 focus:border-gold-500 py-3 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-700 text-luxury-black font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(197,168,128,0.2)] cursor-pointer flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Request Reservation</span>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="reservation-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 flex flex-col items-center gap-6"
              >
                <CheckCircle2 className="w-16 h-16 text-gold-500 animate-bounce" />
                <div>
                  <h3 className="font-serif text-2xl text-white tracking-wide uppercase">Request Received</h3>
                  <p className="mt-3 text-xs text-gray-400 font-light max-w-md leading-relaxed">
                    We are currently verifying availability for your requested slot. A confirmation email and text message will be dispatched shortly to verify your table reservation.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 border border-gold-500/40 text-gold-500 hover:text-luxury-black hover:bg-gold-500 hover:border-gold-500 text-xs tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer"
                >
                  Book Another Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
