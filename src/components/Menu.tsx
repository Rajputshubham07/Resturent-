"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";

// Full menu items list
const menuData = [
  // Starters
  { id: 1, name: "Tomato Basil Soup", price: "₹249", category: "Starters", image: "/dish1.avif", desc: "Creamy vine-ripened tomatoes simmered with fresh basil, extra virgin olive oil, and house croutons." },
  { id: 2, name: "Garlic Bread Supreme", price: "₹199", category: "Starters", image: "/dish2.avif", desc: "Artisanal sourdough slices toasted with garlic herb butter and loaded with mozzarella cheese." },
  { id: 3, name: "Crispy Veg Spring Rolls", price: "₹279", category: "Starters", image: "/dish5.avif", desc: "Golden fried pastry skins wrapped with fresh seasoned garden vegetables, served with sweet chili dip." },
  { id: 4, name: "Chicken Wings", price: "₹349", category: "Starters", image: "/dish6.avif", desc: "Tender roasted chicken wings glazed in a spicy, wood-fire smoked barbecue reduction." },
  { id: 5, name: "Paneer Tikka", price: "₹329", category: "Starters", image: "/dish3.avif", desc: "Tandoori grilled cottage cheese cubes marinated in yogurt and yellow mustard spices." },

  // Main Course
  { id: 6, name: "Butter Chicken", price: "₹549", category: "Main Course", image: "/dish9.avif", desc: "Smoked tandoori chicken cooked in a rich, velvety tomato butter gravy, finished with fresh cream." },
  { id: 7, name: "Chicken Biryani", price: "₹499", category: "Main Course", image: "/dish8.avif", desc: "Layered basmati rice dish cooked with tender chicken, whole spices, and saffron milk." },
  { id: 8, name: "Mutton Rogan Josh", price: "₹699", category: "Main Course", image: "/dish14.jpg", desc: "A robust lamb shank delicacy braised in dark onion paste, Kashmiri chili, and mild spices." },
  { id: 9, name: "Paneer Butter Masala", price: "₹449", category: "Main Course", image: "/dish15.jpg", desc: "Cottage cheese triangles simmered in a mildly sweet tomato and cashew paste gravy." },
  { id: 10, name: "Veg Biryani", price: "₹399", category: "Main Course", image: "/dish16.jpg", desc: "Long-grain aromatic rice slow-cooked with fresh seasonal vegetables and biryani masala." },
  { id: 11, name: "Dal Makhani", price: "₹349", category: "Main Course", image: "/dish17.jpg", desc: "Creamy black lentils slow-cooked overnight with tomato puree, ghee, and local butter." },

  // Pizza
  { id: 12, name: "Margherita Pizza", price: "₹399", category: "Pizza", image: "/dish12.jpg", desc: "Neapolitan-style crust topped with San Marzano tomato sauce, fresh mozzarella, and organic basil." },
  { id: 13, name: "Farmhouse Pizza", price: "₹499", category: "Pizza", image: "/dish13.jpg", desc: "Traditional crust loaded with bell peppers, mushrooms, sweet corn, onions, and extra cheese." },
  { id: 14, name: "Paneer Tandoori Pizza", price: "₹549", category: "Pizza", image: "/dish18.jpg", desc: "Crispy crust topped with spiced paneer tikka, red onions, capsicum, and coriander pesto." },
  { id: 15, name: "Chicken Supreme Pizza", price: "₹599", category: "Pizza", image: "/dish19.jpg", desc: "Premium crust topped with grilled chicken, shredded chicken tikka, black olives, and jalapenos." },

  // Pasta
  { id: 16, name: "Alfredo Pasta", price: "₹449", category: "Pasta", image: "/dish20.jpg", desc: "Penne pasta tossed in a rich, buttery Parmesan cheese cream sauce with garlic." },
  { id: 17, name: "Arrabbiata Pasta", price: "₹429", category: "Pasta", image: "/dish21.jpg", desc: "Penne pasta cooked in a spicy tomato sauce with garlic, chili flakes, and black olives." },
  { id: 18, name: "Chicken Cream Pasta", price: "₹499", category: "Pasta", image: "/dish22.jpg", desc: "Fettuccine pasta in white garlic cream sauce topped with herb-grilled chicken breast." },

  // Desserts
  { id: 19, name: "Chocolate Lava Cake", price: "₹299", category: "Desserts", image: "/dish7.avif", desc: "Decadent warm dark chocolate cake filled with a gooey liquid chocolate center." },
  { id: 20, name: "Cheesecake", price: "₹329", category: "Desserts", image: "/dish10.avif", desc: "New York-style baked cheesecake on a graham cracker crust, topped with fresh berry compote." },
  { id: 21, name: "Brownie with Ice Cream", price: "₹349", category: "Desserts", image: "/dish23.jpg", desc: "Warm fudge brownie loaded with walnuts, served with a scoop of premium vanilla bean ice cream." },

  // Beverages
  { id: 22, name: "Cold Coffee", price: "₹199", category: "Beverages", image: "/dish24.jpg", desc: "Blended espresso shot with chilled whole milk, sweet vanilla syrup, and chocolate drizzle." },
  { id: 23, name: "Mojito", price: "₹249", category: "Beverages", image: "/dish25.jpg", desc: "Refreshing mixture of muddled mint leaves, lime wedges, sugar syrup, white rum essence, and soda." },
  { id: 24, name: "Fresh Lime Soda", price: "₹149", category: "Beverages", image: "/dish4.avif", desc: "Fresh lime juice mixed with mineral soda water, available sweet, salted, or mixed." },
  { id: 25, name: "Cappuccino", price: "₹199", category: "Beverages", image: "/dish20.jpg", desc: "Double shot of espresso topped with deep layer of foamed whole milk and cocoa powder." },
  { id: 26, name: "Fresh Juice", price: "₹249", category: "Beverages", image: "/dish21.jpg", desc: "Freshly squeezed seasonal fruits served cold without added sugars or preservatives." },
];

const categories = ["All", "Starters", "Main Course", "Pizza", "Pasta", "Desserts", "Beverages"];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = menuData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-24 bg-luxury-dark border-t border-b border-gold-500/5 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">The Culinary Gallery</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Curated Menu
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-900 pb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar pb-2 md:pb-0 scroll-smooth">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-all duration-300 relative whitespace-nowrap cursor-pointer ${
                  selectedCategory === category ? "text-gold-500 font-semibold" : "text-gray-400 hover:text-white"
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeMenuTab"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gold-500"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-luxury-black border border-gray-800 focus:border-gold-500 transition-colors duration-300 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 rounded-none outline-none"
            />
            <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="glass-panel p-4 flex gap-5 hover:border-gold-500/20 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden border border-gold-500/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-serif text-sm sm:text-base text-white tracking-wide uppercase group-hover:text-gold-500 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="h-[1px] flex-grow border-b border-dotted border-gray-850 mx-2 hidden sm:block" />
                      <span className="text-gold-500 font-serif text-sm sm:text-base tracking-widest">{item.price}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-gray-600 uppercase mt-2">
                    <span>{item.category}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-gold-500 transition-opacity duration-300 font-semibold">
                      Fine Selection
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredMenu.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 text-sm font-light"
          >
            No culinary creations found matching your query.
          </motion.div>
        )}

      </div>
    </section>
  );
}
