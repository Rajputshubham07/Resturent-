"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Upload, Lock, ShieldCheck, LogOut, Loader2, Image as ImageIcon, Search } from "lucide-react";
import Image from "next/image";

interface Dish {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  desc: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface CustomerSession {
  id: string;
  name: string;
  mobile: string;
  table: string;
  loginTime: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  mobileNumber: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  serviceCharge: number;
  grandTotal: number;
  paymentMode: string;
  status: string;
  timestamp: string;
}



export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"menu" | "gallery" | "sessions" | "orders">("menu");
  
  // Data States
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");



  // Modal / Form States
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<Partial<Dish> | null>(null);
  const [currentGalleryImage, setCurrentGalleryImage] = useState<Partial<GalleryImage> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);



  // Fetch Data
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuRes = await fetch("/api/admin/menu");
        const galleryRes = await fetch("/api/admin/gallery");
        const sessionsRes = await fetch("/api/admin/sessions");
        const ordersRes = await fetch("/api/admin/orders");
        if (menuRes.ok && galleryRes.ok && sessionsRes.ok && ordersRes.ok) {
          const menuData = await menuRes.json();
          const galleryData = await galleryRes.json();
          const sessionsData = await sessionsRes.json();
          const ordersData = await ordersRes.json();
          setDishes(menuData);
          setGalleryImages(galleryData);
          setSessions(sessionsData);
          setOrders(ordersData);
        }

      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "etoile-admin" || accessCode === "letoile2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Administrative Access Code");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (activeTab === "menu" && currentDish) {
          setCurrentDish((prev) => ({ ...prev, image: data.url }));
        } else if (activeTab === "gallery" && currentGalleryImage) {
          setCurrentGalleryImage((prev) => ({ ...prev, src: data.url }));
        }
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Menu Item
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDish?.name || !currentDish?.price || !currentDish?.category || !currentDish?.image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    let updatedDishes = [...dishes];

    if (currentDish.id) {
      // Editing
      updatedDishes = dishes.map((d) => (d.id === currentDish.id ? (currentDish as Dish) : d));
    } else {
      // Adding new
      const nextId = dishes.length > 0 ? Math.max(...dishes.map((d) => d.id)) + 1 : 1;
      const newDish = { ...currentDish, id: nextId } as Dish;
      updatedDishes.push(newDish);
    }

    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDishes),
      });

      if (res.ok) {
        setDishes(updatedDishes);
        setIsMenuModalOpen(false);
        setCurrentDish(null);
      } else {
        alert("Failed to save dish.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Menu Item
  const handleDeleteDish = async (id: number) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    const updatedDishes = dishes.filter((d) => d.id !== id);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDishes),
      });

      if (res.ok) {
        setDishes(updatedDishes);
      } else {
        alert("Failed to delete dish.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Gallery Item
  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGalleryImage?.src || !currentGalleryImage?.alt) {
      alert("Please fill in the description and upload an image.");
      return;
    }

    let updatedImages = [...galleryImages];

    if (currentGalleryImage.id) {
      updatedImages = galleryImages.map((g) => (g.id === currentGalleryImage.id ? (currentGalleryImage as GalleryImage) : g));
    } else {
      const nextId = galleryImages.length > 0 ? Math.max(...galleryImages.map((g) => g.id)) + 1 : 1;
      const newImage = { ...currentGalleryImage, id: nextId } as GalleryImage;
      updatedImages.push(newImage);
    }

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedImages),
      });

      if (res.ok) {
        setGalleryImages(updatedImages);
        setIsGalleryModalOpen(false);
        setCurrentGalleryImage(null);
      } else {
        alert("Failed to save image.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image from the gallery?")) return;

    const updatedImages = galleryImages.filter((g) => g.id !== id);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedImages),
      });

      if (res.ok) {
        setGalleryImages(updatedImages);
      } else {
        alert("Failed to delete image.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Customer Session
  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to end/clear this diner session?")) return;

    try {
      const res = await fetch(`/api/admin/sessions?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("Failed to end session.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status } : order))
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
    }
  };



  // Filter dishes
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Authenticate UI
  if (!isAuthenticated) {
    return (
      <section className="py-24 min-h-[85vh] flex items-center justify-center relative px-6">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-12 max-w-md w-full text-center border border-gold-500/10"
        >
          <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-5 h-5 text-gold-500" />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-light">Secure Portal</span>
          <h2 className="font-serif text-2xl text-white uppercase tracking-wide mt-2 mb-6">
            Admin Registry
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Administrative Key</label>
              <input
                type="password"
                placeholder="Enter access code..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors py-3 px-4 text-xs text-white placeholder-gray-800 rounded-none outline-none text-center tracking-[0.2em]"
              />
            </div>
            {authError && <p className="text-[10px] text-red-500 font-light">{authError}</p>}
            
            <button
              type="submit"
              className="w-full py-3.5 bg-gold-500 text-luxury-black hover:bg-gold-600 transition-all font-serif text-xs uppercase tracking-[0.2em] font-semibold rounded-none cursor-pointer mt-4"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500" />
              <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-light">Management Office</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wide mt-2">
              Restaurant Dashboard
            </h2>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-gray-900 hover:border-red-500/40 text-gray-500 hover:text-red-500 transition-all text-xs uppercase tracking-wider rounded-none cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-900 mb-8 pb-1 gap-8">
          <button
            onClick={() => setActiveTab("menu")}
            className={`pb-3 text-xs uppercase tracking-[0.2em] relative transition-colors cursor-pointer ${
              activeTab === "menu" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
            }`}
          >
            Menu Offerings ({dishes.length})
            {activeTab === "menu" && (
              <motion.div layoutId="adminTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-3 text-xs uppercase tracking-[0.2em] relative transition-colors cursor-pointer ${
              activeTab === "gallery" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
            }`}
          >
            Gallery Showcase ({galleryImages.length})
            {activeTab === "gallery" && (
              <motion.div layoutId="adminTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`pb-3 text-xs uppercase tracking-[0.2em] relative transition-colors cursor-pointer ${
              activeTab === "sessions" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
            }`}
          >
            Active Sessions ({sessions.length})
            {activeTab === "sessions" && (
              <motion.div layoutId="adminTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs uppercase tracking-[0.2em] relative transition-colors cursor-pointer ${
              activeTab === "orders" ? "text-gold-500 font-semibold" : "text-gray-500 hover:text-white"
            }`}
          >
            Orders Registry ({orders.length})
            {activeTab === "orders" && (
              <motion.div layoutId="adminTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500" />
            )}
          </button>
        </div>



        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : (
          <div>
            {/* Tab 1: Menu Offerings */}
            {activeTab === "menu" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Search */}
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      placeholder="Search offerings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors duration-300 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-700 rounded-none outline-none"
                    />
                    <Search className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Add offering */}
                  <button
                    onClick={() => {
                      setCurrentDish({ name: "", price: "₹", category: "Starters", desc: "", image: "" });
                      setIsMenuModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Culinary Creation
                  </button>
                </div>

                {/* Offering List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDishes.map((dish) => (
                    <div key={dish.id} className="glass-panel p-4 flex gap-4 border border-gray-900/50 hover:border-gold-500/10 transition-all duration-300">
                      <div className="relative w-20 h-20 bg-luxury-dark border border-gold-500/5 overflow-hidden flex-shrink-0">
                        {dish.image ? (
                          <Image src={dish.image} alt={dish.name} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700"><ImageIcon className="w-6 h-6" /></div>
                        )}
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-baseline gap-2">
                            <h4 className="text-sm font-serif text-white uppercase truncate tracking-wide">{dish.name}</h4>
                            <span className="text-gold-500 font-serif text-sm font-semibold">{dish.price}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{dish.category}</p>
                          <p className="text-[11px] text-gray-500 font-light truncate mt-1 leading-normal">{dish.desc}</p>
                        </div>

                        <div className="flex gap-4 justify-end mt-2 pt-2 border-t border-gray-950">
                          <button
                            onClick={() => {
                              setCurrentDish(dish);
                              setIsMenuModalOpen(true);
                            }}
                            className="text-[10px] uppercase text-gray-400 hover:text-gold-500 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            className="text-[10px] uppercase text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDishes.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-gray-600 text-xs font-light">No creations found matching query.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Gallery Showcase */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setCurrentGalleryImage({ src: "", alt: "" });
                      setIsGalleryModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Showcase Photo
                  </button>
                </div>

                {/* Showcase List Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="glass-panel overflow-hidden border border-gray-900 hover:border-gold-500/10 transition-all duration-300 flex flex-col justify-between">
                      <div className="relative aspect-video w-full bg-luxury-dark">
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-w-768px) 50vw, 250px" />
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                        <p className="text-[11px] text-gray-400 font-light line-clamp-2 leading-relaxed">
                          {image.alt}
                        </p>
                        
                        <div className="flex justify-between items-center border-t border-gray-950 pt-3">
                          <button
                            onClick={() => {
                              setCurrentGalleryImage(image);
                              setIsGalleryModalOpen(true);
                            }}
                            className="text-[9px] uppercase tracking-wider text-gray-500 hover:text-gold-500 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryImage(image.id)}
                            className="text-[9px] uppercase tracking-wider text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Active Diner Sessions */}
            {activeTab === "sessions" && (
              <div className="space-y-6">
                <div className="glass-panel overflow-x-auto border border-gray-900 no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-900 bg-luxury-dark/60 text-[10px] tracking-wider text-gray-500 uppercase">
                        <th className="py-4 px-6 font-medium">Customer Name</th>
                        <th className="py-4 px-6 font-medium text-center">Table</th>
                        <th className="py-4 px-6 font-medium">Contact Number</th>
                        <th className="py-4 px-6 font-medium">Active Since</th>
                        <th className="py-4 px-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/40 text-xs font-light text-gray-400">
                      {sessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-gold-500/[0.02] transition-colors">
                          <td className="py-4 px-6 text-white uppercase tracking-wide font-medium">{sess.name}</td>
                          <td className="py-4 px-6 text-center text-gold-500 font-serif font-bold">Table {sess.table}</td>
                          <td className="py-4 px-6 font-mono">{sess.mobile}</td>
                          <td className="py-4 px-6 text-gray-500">{sess.loginTime}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteSession(sess.id)}
                              className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Clear Session
                            </button>
                          </td>
                        </tr>
                      ))}
                      {sessions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-600 font-light">
                            No active dining sessions registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Orders Registry */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {/* Search Bar for Orders */}
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by Order ID, Table, or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors duration-300 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-700 rounded-none outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="glass-panel overflow-x-auto border border-gray-900 no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-900 bg-luxury-dark/60 text-[10px] tracking-wider text-gray-500 uppercase">
                        <th className="py-4 px-6 font-medium">Order ID</th>
                        <th className="py-4 px-6 font-medium">Customer Details</th>
                        <th className="py-4 px-6 font-medium">Items Ordered</th>
                        <th className="py-4 px-6 font-medium">Total Bill</th>
                        <th className="py-4 px-6 font-medium">Payment Mode</th>
                        <th className="py-4 px-6 font-medium text-center">Status</th>
                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/40 text-xs font-light text-gray-400">
                      {orders
                        .filter((order) => 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.tableNumber.includes(searchQuery)
                        )
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-gold-500/[0.02] transition-colors align-top">
                            <td className="py-4 px-6 font-mono text-white font-semibold">#{order.id}</td>
                            <td className="py-4 px-6 space-y-1">
                              <p className="text-white uppercase tracking-wide font-medium">{order.customerName}</p>
                              <p className="text-[10px] text-gold-500 font-serif font-bold">Table {order.tableNumber}</p>
                              <p className="text-[10px] text-gray-600 font-mono">{order.mobileNumber}</p>
                            </td>
                            <td className="py-4 px-6">
                              <ul className="list-disc list-inside space-y-1 text-gray-500">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="text-[11px]">
                                    <span className="text-white">{item.name}</span> x {item.quantity}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="py-4 px-6 font-serif font-bold text-sm text-gold-500">₹{order.grandTotal}</td>
                            <td className="py-4 px-6 uppercase tracking-wider text-[10px] font-semibold text-gray-500">
                              {order.paymentMode === "online" 
                                ? "Online (Razorpay)" 
                                : order.paymentMode === "bill" 
                                ? "Get Table Bill" 
                                : "Pay on Counter"}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-block px-2..5 py-1 text-[9px] uppercase tracking-wider font-semibold rounded-none ${
                                order.status === "completed" 
                                  ? "bg-green-500/10 border border-green-500/20 text-green-500" 
                                  : order.status === "paid" 
                                  ? "bg-blue-500/10 border border-blue-500/20 text-blue-500" 
                                  : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-y-2">
                              {order.status === "pending" && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "paid")}
                                  className="w-full px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-all text-[9px] uppercase tracking-wider font-semibold rounded-none cursor-pointer"
                                >
                                  Mark Paid
                                </button>
                              )}
                              {order.status !== "completed" && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                  className="w-full px-3 py-1 bg-transparent border border-gray-800 text-white hover:border-white transition-all text-[9px] uppercase tracking-wider font-semibold rounded-none cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              <span className="block text-[9px] text-gray-600 mt-1">{order.timestamp}</span>
                            </td>
                          </tr>
                        ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-600 font-light">
                            No dining room orders registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      {/* MODAL: Menu Offerings (Add/Edit) */}
      <AnimatePresence>
        {isMenuModalOpen && currentDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuModalOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 md:p-8 max-w-xl w-full border border-gold-500/20 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-serif text-lg text-white uppercase tracking-wider border-b border-gray-900 pb-3 mb-6">
                {currentDish.id ? "Modify Creation Details" : "New Culinary Creation"}
              </h3>

              <form onSubmit={handleSaveDish} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={currentDish.name || ""}
                      onChange={(e) => setCurrentDish((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Pan-Seared Ribeye"
                      className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors py-2.5 px-3.5 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light">Price (with symbol)</label>
                    <input
                      type="text"
                      required
                      value={currentDish.price || "₹"}
                      onChange={(e) => setCurrentDish((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., ₹599"
                      className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors py-2.5 px-3.5 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light">Category</label>
                  <select
                    value={currentDish.category || "Starters"}
                    onChange={(e) => setCurrentDish((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors py-2.5 px-3.5 text-xs text-white rounded-none outline-none"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light">Culinary Description</label>
                  <textarea
                    required
                    value={currentDish.desc || ""}
                    onChange={(e) => setCurrentDish((prev) => ({ ...prev, desc: e.target.value }))}
                    placeholder="Describe flavor notes, ingredients, and texture..."
                    rows={3}
                    className="w-full bg-luxury-black border border-gray-900 focus:border-gold-500 transition-colors py-2.5 px-3.5 text-xs text-white placeholder-gray-800 rounded-none outline-none resize-none"
                  />
                </div>

                {/* File Upload Block */}
                <div className="space-y-2">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Display Picture</label>
                  
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-luxury-dark border border-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {currentDish.image ? (
                        <Image src={currentDish.image} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-800" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 border border-gold-500/20 text-gold-500 hover:text-white hover:border-gold-500 text-[10px] tracking-wider uppercase font-semibold transition-all rounded-none cursor-pointer flex items-center gap-1.5"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" /> Upload File
                          </>
                        )}
                      </button>
                      <p className="text-[9px] text-gray-600 mt-1.5 font-light">Recommended dimensions: 16:9 or square. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-950">
                  <button
                    type="button"
                    onClick={() => setIsMenuModalOpen(false)}
                    className="px-5 py-2 border border-gray-900 text-gray-500 hover:text-white text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold-500 text-luxury-black hover:bg-gold-600 font-semibold text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Gallery Showcase (Add/Edit) */}
      <AnimatePresence>
        {isGalleryModalOpen && currentGalleryImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGalleryModalOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 md:p-8 max-w-md w-full border border-gold-500/20 relative z-10"
            >
              <h3 className="font-serif text-lg text-white uppercase tracking-wider border-b border-gray-900 pb-3 mb-6">
                {currentGalleryImage.id ? "Edit Photo Caption" : "New Showcase Photo"}
              </h3>

              <form onSubmit={handleSaveGalleryImage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light">Photo Caption (Alt Text)</label>
                  <input
                    type="text"
                    required
                    value={currentGalleryImage.alt || ""}
                    onChange={(e) => setCurrentGalleryImage((prev) => ({ ...prev, alt: e.target.value }))}
                    placeholder="Describe what this photo captures..."
                    className="w-full bg-luxury-black/80 border border-gray-900 focus:border-gold-500 transition-colors py-2.5 px-3.5 text-xs text-white placeholder-gray-800 rounded-none outline-none"
                  />
                </div>

                {/* Upload block */}
                <div className="space-y-2">
                  <label className="text-[9px] tracking-widest text-gray-500 uppercase font-light block">Showcase Image</label>
                  
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-luxury-dark border border-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {currentGalleryImage.src ? (
                        <Image src={currentGalleryImage.src} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-800" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 border border-gold-500/20 text-gold-500 hover:text-white hover:border-gold-500 text-[10px] tracking-wider uppercase font-semibold transition-all rounded-none cursor-pointer flex items-center gap-1.5"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" /> Upload File
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-950">
                  <button
                    type="button"
                    onClick={() => setIsGalleryModalOpen(false)}
                    className="px-5 py-2 border border-gray-900 text-gray-500 hover:text-white text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold-500 text-luxury-black hover:bg-gold-600 font-semibold text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
