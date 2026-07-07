import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import Checkout from "@/components/Checkout";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Checkout Order | L'Étoile Luxury Restaurant",
  description: "Complete your premium dining order at L'Étoile. Choose from multiple payment modes including Razorpay online checkout.",
};

export default function CheckoutPage() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Navbar />

      <main className="relative flex-grow pt-24 bg-luxury-black min-h-screen">
        <Checkout />
      </main>

      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
