"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

// Full menu items list
const menuData = [
  // Starters
  { id: 1, name: "L'Étoile Tapas Platter", price: "₹499", category: "Starters", image: "/assorted-starters-feast.avif", desc: "A luxurious spread of assorted starters featuring miniature burgers, fries, garlic crostini, chicken wings, and gourmet dips." },
  { id: 2, name: "Avocado Egg Toast", price: "₹249", category: "Starters", image: "/avocado-egg-toast.avif", desc: "Thick sourdough toast topped with sliced organic boiled eggs, fresh avocado slices, spinach, and microgreens." },
  { id: 3, name: "Crispy Calamari & Bloomin' Onion", price: "₹349", category: "Starters", image: "/fried-calamari-bloomin-onion.avif", desc: "Golden fried calamari rings served alongside a crispy spiced bloomin' onion flower and garlic sauce." },
  { id: 4, name: "Sliced Beef Steak Strips", price: "₹399", category: "Starters", image: "/beef-steak-appetizers.avif", desc: "Tender grilled beef steak strips served with sliced red onions, fresh lettuce, and dipping sauce." },
  { id: 5, name: "Steamed Momos with Chutney", price: "₹249", category: "Starters", image: "/steamed-momos.jpg", desc: "Thin-skin dumplings filled with seasoned vegetables, served with hot red chili chutney and mayonnaise." },
  { id: 6, name: "Spicy Pani Puri / Gol Gappa", price: "₹199", category: "Starters", image: "/spicy-pani-puri.jpg", desc: "Crispy hollow puri shells filled with spiced potato and chickpea mix, topped with green chilies, onions, and tangy water." },
  { id: 7, name: "Grilled Corn & Cheese Sandwich", price: "₹249", category: "Starters", image: "/grilled-cheese-sandwich.jpg", desc: "Toasted panini loaded with sweet corn kernels, green bell peppers, and melted cheddar and mozzarella cheese." },
  { id: 8, name: "Samosa Cholay Chaat", price: "₹199", category: "Starters", image: "/samosa-cholay-chaat.jpg", desc: "Two crispy potato samosas served in a bowl of spicy chickpea curry (cholay) and garnished with sweet yogurt and mint." },

  // Main Course
  { id: 9, name: "Balsamic Salmon Fillet", price: "₹699", category: "Main Course", image: "/grilled-salmon-balsamic.avif", desc: "Pan-seared salmon fillet resting on sautéed garlic spinach, topped with a cucumber tomato salsa and balsamic reduction." },
  { id: 10, name: "Bacon Cheeseburger & Fries", price: "₹499", category: "Main Course", image: "/bacon-cheeseburger-fries.avif", desc: "A gourmet beef patty topped with crispy bacon, melted cheese, and onion strings in a toasted bun, served with fries." },
  { id: 11, name: "Honey BBQ Pork Ribs Plate", price: "₹649", category: "Main Course", image: "/honey-bbq-ribs-plate.avif", desc: "Slow-roasted tender pork ribs glazed in our house honey BBQ sauce, served with fresh lettuce salad." },
  { id: 12, name: "Double Slabs BBQ Ribs Board", price: "₹999", category: "Main Course", image: "/bbq-pork-ribs-board.avif", desc: "Double portion of smoked pork ribs glazed in honey BBQ sauce, served on a rustic wooden board with roasted peppers." },
  { id: 13, name: "Grand BBQ Ribs Platter", price: "₹899", category: "Main Course", image: "/honey-bbq-ribs-platter.avif", desc: "A full slab of honey BBQ ribs served with fresh tomato slices, pickles, and a bucket of cheesy French fries." },
  { id: 14, name: "Veg Manchurian with Noodles", price: "₹429", category: "Main Course", image: "/veg-manchurian-noodles.jpg", desc: "Crispy vegetable dumplings tossed in a dark, tangy soy-garlic Manchurian sauce, paired with stir-fried hakka noodles." },
  { id: 15, name: "Paneer Masala & Paratha Feast", price: "₹449", category: "Main Course", image: "/paneer-masala-paratha-rasgulla.jpg", desc: "Rich paneer tikka masala served with flaky, layered lacha paratha, sliced green chilies, and a side bowl of sweet rasgullas." },
  { id: 16, name: "Classic Chole Bhature Platter", price: "₹349", category: "Main Course", image: "/chole-bhature-platter.jpg", desc: "Two large, fluffy fried bhature breads served with a bowl of spicy chickpea curry, green chutney, pickle, and onions." },
  { id: 17, name: "Tandoori Chicken Leg Quarters", price: "₹499", category: "Main Course", image: "/tandoori-chicken.jpg", desc: "Two leg quarters marinated in red yogurt spices and charcoal grilled, served with sliced onions and mint chutney." },

  // Pizza & Pasta
  { id: 18, name: "Fries, Pizza & Coffee Combo", price: "₹599", category: "Pizza", image: "/fries-pizza-cold-coffee.jpg", desc: "A classic personal cheese pizza served with a tray of spiced french fries and two cold coffees with chocolate drizzle." },
  { id: 19, name: "Veg Chow Mein Noodles", price: "₹349", category: "Pasta", image: "/veg-chow-mein-noodles.jpg", desc: "Stir-fried noodles tossed with julienned carrots, cabbage, onions, and green bell peppers in light soy sauce." },
  { id: 20, name: "Baked Fusilli Bolognese", price: "₹449", category: "Pasta", image: "/baked-fusilli-pasta.jpg", desc: "Fusilli pasta tossed in a rich minced meat bolognese sauce, loaded with mozzarella and baked until bubbly, served with garlic bread." },

  // Desserts
  { id: 21, name: "Saffron Banana French Toast", price: "₹349", category: "Desserts", image: "/banana-blueberry-french-toast.avif", desc: "Thick-sliced brioche soaked in saffron cardamom custard, griddled golden, and topped with sliced bananas, blueberries, and honey." },
  { id: 22, name: "Chocolate Waffles on Sticks", price: "₹299", category: "Desserts", image: "/chocolate-waffles-sticks.jpg", desc: "Triangular waffle slices served on sticks, heavily drizzled with milk chocolate, white chocolate sauce, and chocolate chips." },
  { id: 23, name: "Saffron Pistachio Rasmalai", price: "₹249", category: "Desserts", image: "/saffron-rasmalai.jpg", desc: "Soft and spongy cottage cheese dumplings soaked in rich, saffron-infused cardamom milk, garnished with sliced almonds and pistachios." },
  { id: 24, name: "Crispy Saffron Jalebi", price: "₹199", category: "Desserts", image: "/saffron-jalebi.jpg", desc: "Crispy, syrup-soaked spiral sweets infused with premium saffron strands, served warm." },
];

const categories = ["All", "Starters", "Main Course", "Pizza", "Pasta", "Desserts"];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [menuItems, setMenuItems] = useState<any[]>(menuData);

  useEffect(() => {
    fetch("/api/admin/menu")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) setMenuItems(data);
      })
      .catch((err) => console.error("Error loading menu:", err));
  }, []);

  const filteredMenu = menuItems.filter((item) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
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
                  
                  {(() => {
                    const cartItem = cartItems.find((i) => i.id === item.id);
                    return (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-900/50">
                        <span className="text-[9px] tracking-[0.2em] text-gray-600 uppercase">{item.category}</span>
                        <div>
                          {cartItem ? (
                            <div className="flex items-center gap-2.5">
                              <button 
                                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                                className="w-6 h-6 border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-colors text-xs font-light cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-white text-xs font-medium w-4 text-center">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                                className="w-6 h-6 border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-luxury-black transition-colors text-xs font-light cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category })}
                              className="px-4 py-1.5 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-luxury-black text-[9px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 rounded-none cursor-pointer"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>

            ))}
          </AnimatePresence>
        </div>

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
