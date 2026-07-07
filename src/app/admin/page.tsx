import Preloader from "@/components/ui/Preloader";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Administrative Office | L'Étoile Luxury Restaurant",
  description: "Secure content administration board to upload dishes, manage pricing, set descriptors, and update the gallery showcase.",
};

export default function AdminPage() {
  return (
    <>
      <Preloader />
      <main className="relative bg-luxury-black min-h-screen w-full flex flex-col justify-start">
        <AdminDashboard />
      </main>
    </>
  );
}
