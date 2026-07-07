"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Menu", href: "/#menu" },
  { name: "Reservations", href: "/#reservations" },
  { name: "Events", href: "/#events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/#contact" },
];

const getSectionFromHref = (href: string) => {
  if (href.startsWith("/#")) return href.substring(2);
  if (href.startsWith("#")) return href.substring(1);
  if (href.startsWith("/")) return href.substring(1);
  return href;
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  useEffect(() => {
    // Initial theme setup on mount
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      root.classList.remove("dark");
      setTheme("light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    if (pathname === "/gallery") {
      setActiveSection("gallery");
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check which section is in view
      const sections = navLinks
        .map(link => {
          if (link.href.startsWith("/#")) return link.href.substring(2);
          if (link.href.startsWith("#")) return link.href.substring(1);
          return null;
        })
        .filter(Boolean) as string[];
      let currentSection = "home";

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#") && !href.startsWith("/#")) {
      setMobileMenuOpen(false);
      return;
    }
    
    const targetId = href.startsWith("/#") ? href.substring(2) : href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 h-20 flex items-center ${
          isScrolled 
            ? "glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-3 group">
            <span className="font-serif text-2xl tracking-[0.2em] font-light text-white group-hover:text-gold-500 transition-colors duration-300">
              L&apos;ÉTOILE
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === getSectionFromHref(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 relative py-2 ${
                    isActive ? "text-gold-500 font-normal" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Reserve Button & Theme Toggle (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 border border-gold-500/20 text-gold-500 hover:text-white hover:border-gold-500 transition-colors duration-300 rounded-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="/#reservations"
              onClick={(e) => handleNavClick(e, "/#reservations")}
              className="px-6 py-2.5 border border-gold-500/40 text-gold-500 hover:text-luxury-black hover:bg-gold-500 hover:border-gold-500 text-xs tracking-[0.15em] uppercase font-semibold transition-all duration-500 rounded-none cursor-pointer"
            >
              Book A Table
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 pt-24 pb-8 px-6 bg-luxury-black/95 backdrop-blur-xl flex flex-col md:hidden border-b border-gold-500/10"
          >
            <div className="flex flex-col gap-6 items-center justify-center flex-1">
              {navLinks.map((link) => {
                const isActive = activeSection === getSectionFromHref(link.href);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-lg tracking-[0.2em] uppercase font-light py-2 ${
                      isActive ? "text-gold-500 font-semibold" : "text-gray-300"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full">
                <button
                  onClick={toggleTheme}
                  className="w-full py-3 border border-gold-500/20 text-gold-500 rounded-none cursor-pointer flex items-center justify-center gap-2 hover:bg-gold-500/5 transition-colors duration-300"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest font-semibold">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest font-semibold">Dark Mode</span>
                    </>
                  )}
                </button>
                <a
                  href="/#reservations"
                  onClick={(e) => handleNavClick(e, "/#reservations")}
                  className="w-full py-3 bg-gold-500 text-luxury-black text-xs uppercase tracking-widest font-bold text-center hover:bg-gold-600 transition-colors duration-300"
                >
                  Book A Table
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
