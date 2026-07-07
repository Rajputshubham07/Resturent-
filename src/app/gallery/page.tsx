import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Gallery | L'Étoile Luxury Restaurant",
  description: "Explore the culinary art, premium plates, and luxury dining spaces of L'Étoile Michelin-star restaurant.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Premium Intros & Global Elements */}
      <Preloader />
      <ScrollProgress />
      <Navbar />

      {/* Main Gallery Page Layout */}
      <main className="relative flex-grow pt-24 bg-luxury-black min-h-screen">
        <Gallery />
      </main>

      {/* Footer & Global Scroll Triggers */}
      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
