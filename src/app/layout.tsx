import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CustomerLoginModal from "@/components/CustomerLoginModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "L'Étoile | Premium Modern Fine Dining",
  description: "Where every meal becomes a memory. Experience Michelin-star fine dining with a luxury modern atmosphere, crafted culinary masterpieces, and world-class service.",
  keywords: ["fine dining", "luxury restaurant", "michelin star", "reservations", "gourmet", "modern restaurant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-luxury-black text-foreground flex flex-col selection:bg-gold-500 selection:text-luxury-black">
        <CartProvider>
          <CustomerLoginModal />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
