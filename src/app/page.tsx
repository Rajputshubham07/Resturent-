import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ChefSpotlight from "@/components/ChefSpotlight";
import SignatureDishes from "@/components/SignatureDishes";
import Menu from "@/components/Menu";
import Reservations from "@/components/Reservations";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingReserve from "@/components/ui/FloatingReserve";
import BackToTop from "@/components/ui/BackToTop";

export default function Home() {
  return (
    <>
      {/* Premium Intros & Global Elements */}
      <Preloader />
      <ScrollProgress />
      <Navbar />

      {/* Main Content Layout */}
      <main className="relative flex-grow">
        <Hero />
        <About />
        <ChefSpotlight />
        <SignatureDishes />
        <Menu />
        <Reservations />
        <Events />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer & Global Scroll Triggers */}
      <Footer />
      <FloatingReserve />
      <BackToTop />
    </>
  );
}
