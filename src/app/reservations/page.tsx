import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import Reservations from "@/components/Reservations";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Table Reservations | L'Étoile Luxury Restaurant",
  description: "Secure your table at L'Étoile Michelin-star restaurant. Reserve online for an unforgettable luxury dining experience.",
};

export default function ReservationsPage() {
  return (
    <>
      {/* Premium Intros & Global Elements */}
      <Preloader />
      <ScrollProgress />
      <Navbar />

      {/* Main Reservations Page Layout */}
      <main className="relative flex-grow pt-24 bg-luxury-black min-h-screen">
        <Reservations />
      </main>

      {/* Footer & Global Scroll Triggers */}
      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
