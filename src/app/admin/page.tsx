import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Administrative Office | L'Étoile Luxury Restaurant",
  description: "Secure content administration board to upload dishes, manage pricing, set descriptors, and update the gallery showcase.",
};

export default function AdminPage() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Navbar />

      <main className="relative flex-grow pt-24 bg-luxury-black min-h-screen">
        <AdminDashboard />
      </main>

      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
