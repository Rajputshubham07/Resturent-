"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatusMessage(""), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Inquiries & Location</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Contact Us
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              
              <div className="glass-panel p-6 flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-wider uppercase font-semibold text-white">Address</span>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    12 Culinary Avenue, Prime Plaza, India
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 flex gap-4 items-start">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-wider uppercase font-semibold text-white">Phone</span>
                  <p className="text-xs text-gray-500 font-light">+91 98765 43210</p>
                </div>
              </div>

              <div className="glass-panel p-6 flex gap-4 items-start">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-wider uppercase font-semibold text-white">Email</span>
                  <p className="text-xs text-gray-500 font-light">dining@letoile.com</p>
                </div>
              </div>

              <div className="glass-panel p-6 flex gap-4 items-start">
                <Clock className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-wider uppercase font-semibold text-white">Opening Hours</span>
                  <p className="text-xs text-gray-500 font-light">
                    Monday - Sunday | 11:00 AM - 11:00 PM
                  </p>
                </div>
              </div>

            </div>

            {/* Stylized Google Map Frame */}
            <div className="relative w-full h-64 overflow-hidden border border-gray-900 shadow-2xl">
              <iframe
                title="L'Étoile Restaurant Location"
                src="https://maps.google.com/maps?q=India%20Gate,New%20Delhi&t=k&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
              <div className="absolute inset-0 border border-gold-500/10 pointer-events-none" />
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 md:p-10 h-full flex flex-col justify-between">
              
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-xl text-white tracking-wide uppercase">Send A Message</h3>
                  <p className="text-xs text-gray-500 font-light mt-1">
                    Have questions about private dining bookings or corporate bookings? Reach out to us.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jean Dupont"
                      className={`bg-luxury-dark border ${
                        errors.name ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                      } py-3 px-4 text-xs text-white placeholder-gray-650 outline-none transition-colors duration-300`}
                    />
                    {errors.name && <span className="text-[10px] text-red-400 font-light">{errors.name}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. jean@example.com"
                      className={`bg-luxury-dark border ${
                        errors.email ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                      } py-3 px-4 text-xs text-white placeholder-gray-650 outline-none transition-colors duration-300`}
                    />
                    {errors.email && <span className="text-[10px] text-red-400 font-light">{errors.email}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter message subject"
                    className="bg-luxury-dark border border-gray-800 focus:border-gold-500 py-3 px-4 text-xs text-white placeholder-gray-650 outline-none transition-colors duration-300"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Message</label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className={`bg-luxury-dark border ${
                      errors.message ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                    } py-3 px-4 text-xs text-white placeholder-gray-650 outline-none transition-colors duration-300 resize-none`}
                  />
                  {errors.message && <span className="text-[10px] text-red-400 font-light">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gold-700 shadow-[0_4px_20px_rgba(197,168,128,0.15)]"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-400 font-light text-center"
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
