import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Gourmet Menu | L'Étoile Luxury Restaurant",
  description: "Browse the curated seasonal selections, wood-fired mains, and artisanal desserts at L'Étoile.",
};

export default function MenuPage() {
  return (
    <>
      {/* Premium Intros & Global Elements */}
      <Preloader />
      <ScrollProgress />
      <Navbar />

      {/* Main Menu Page Layout */}
      <main className="relative flex-grow pt-24 bg-luxury-black min-h-screen">
        <Menu />
      </main>

      {/* Footer & Global Scroll Triggers */}
      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
