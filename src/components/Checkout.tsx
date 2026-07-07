"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Coins, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const gst = Math.round(subtotal * 0.18);
  const serviceCharge = 0;
  const grandTotal = subtotal + gst + serviceCharge;

  const [formData, setFormData] = useState({
    name: "",
    tableNumber: "",
    mobileNumber: "",
  });

  useEffect(() => {
    const savedSession = localStorage.getItem("etoile_customer_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setFormData({
          name: session.name || "",
          tableNumber: session.table || "",
          mobileNumber: session.mobile || "",
        });
      } catch (e) {
        console.error("Error parsing customer session:", e);
      }
    }
  }, []);

  const handleDownloadReceipt = (order: any) => {
    if (!order) return;

    const itemsText = order.items
      .map((item: any) => {
        const line = `${item.name} x ${item.quantity}`;
        const price = `₹${item.price ? Number(item.price.replace(/[^0-9]/g, '')) * item.quantity : item.numericPrice * item.quantity}`;
        const spaces = 42 - line.length - price.length;
        return `${line}${" ".repeat(spaces > 0 ? spaces : 2)}${price}`;
      })
      .join("\n");

    const paymentLabel =
      order.paymentMode === "online"
        ? "Online Payment (Razorpay Paid)"
        : order.paymentMode === "bill"
        ? "Get Table Bill"
        : "Pay on Counter";

    const receiptContent = `==========================================
                L'ÉTOILE
           LUXURY RESTAURANT
==========================================
Order ID:     #${order.id}
Table:        Table ${order.tableNumber}
Customer:     ${order.customerName}
Mobile:       ${order.mobileNumber}
Date:         ${order.timestamp || new Date().toLocaleString()}
------------------------------------------
ITEMS:
${itemsText}
------------------------------------------
Subtotal:     ₹${order.subtotal}
GST (18%):    ₹${order.gst || Math.round(order.subtotal * 0.18)}
Service Chg:  ₹${order.serviceCharge || 0}
------------------------------------------
GRAND TOTAL:  ₹${order.grandTotal || (order.subtotal + Math.round(order.subtotal * 0.18))}
------------------------------------------
Settlement:   ${paymentLabel}
Status:       ${order.status === "paid" ? "PAID" : "PENDING COUNTER SETTLEMENT"}
==========================================
    Thank you for dining at L'Étoile!
==========================================`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `letoile-receipt-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [paymentMode, setPaymentMode] = useState<"counter" | "bill" | "online">("online");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Load Razorpay SDK Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.tableNumber.trim()) tempErrors.tableNumber = "Table number is required";
    if (!formData.mobileNumber.trim()) {
      tempErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      tempErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const submitOrder = async (additionalPaymentInfo: any = {}) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.name,
          tableNumber: formData.tableNumber,
          mobileNumber: formData.mobileNumber,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            numericPrice: item.numericPrice
          })),
          subtotal,
          gst,
          serviceCharge,
          grandTotal,
          paymentMode,
          paymentDetails: additionalPaymentInfo
        }),
      });


      const result = await response.json();
      if (response.ok) {
        setOrderDetails(result.order);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert(result.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some food items first.");
      return;
    }

    setIsSubmitting(true);

    if (paymentMode === "online") {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy_key_12345",
        amount: grandTotal * 100, // Amount in paise
        currency: "INR",
        name: "L'Étoile Luxury Restaurant",
        description: `Order for Table ${formData.tableNumber}`,
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=100&q=80",
        handler: function (response: any) {
          // Payment Successful Callback
          submitOrder({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            status: "paid"
          });
        },
        prefill: {
          name: formData.name,
          contact: formData.mobileNumber,
        },
        theme: {
          color: "#c5a880", // Gold matching our theme
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Pay on Counter or Get Table Bill
      await submitOrder({ status: "pending" });
    }
  };

  if (orderSuccess) {
    return (
      <section className="py-24 min-h-[80vh] flex items-center justify-center relative px-6">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-12 max-w-xl w-full text-center border border-gold-500/20"
        >
          <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-gold-500" />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-light">Gastronomy Awaits</span>
          <h2 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wide mt-2">
            Order Placed Successfully
          </h2>
          <p className="text-gray-400 text-xs font-light mt-4 leading-relaxed max-w-md mx-auto">
            Thank you, <span className="text-white font-medium">{formData.name}</span>. Your order has been dispatched directly to our master chef. An email notification has been dispatched to the restaurant owner.
          </p>

          <div className="mt-8 p-6 bg-luxury-dark/50 border border-gray-900 text-left space-y-3">
            <h3 className="font-serif text-xs text-gold-500 uppercase tracking-widest border-b border-gray-900 pb-2">
              Order Docket Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-light text-gray-500">
              <span>Order ID:</span>
              <span className="text-white text-right font-mono">{orderDetails?.id || "N/A"}</span>
              <span>Table Number:</span>
              <span className="text-white text-right font-medium">Table {orderDetails?.tableNumber}</span>
              <span>Payment Mode:</span>
              <span className="text-gold-500 text-right uppercase tracking-wider text-[10px] font-semibold">
                {orderDetails?.paymentMode === "online" ? "Online Payment (Razorpay)" : orderDetails?.paymentMode === "bill" ? "Get Table Bill" : "Pay on Counter"}
              </span>
              <span>Total Amount:</span>
              <span className="text-gold-500 text-right font-serif font-bold text-sm">₹{orderDetails?.grandTotal}</span>

            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDownloadReceipt(orderDetails)}
              className="px-8 py-3.5 bg-transparent border border-gold-500/40 text-gold-500 hover:bg-gold-500 hover:text-luxury-black font-serif text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-none cursor-pointer"
            >
              Download Receipt
            </button>
            <Link
              href="/menu"
              className="px-8 py-3.5 bg-gold-500 text-luxury-black hover:bg-gold-600 font-serif text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-none cursor-pointer"
            >
              Back To Menu
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/menu" className="text-xs text-gray-500 hover:text-gold-500 flex items-center gap-1.5 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
          </Link>
        </div>

        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-gold-500 font-light uppercase">Culinary Registry</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl tracking-wide text-white uppercase">
            Complete Order
          </h2>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-10 h-[1px] bg-gold-500/30" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <div className="w-10 h-[1px] bg-gold-500/30" />
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-panel p-12 text-center max-w-md mx-auto">
            <p className="text-white font-serif text-sm uppercase tracking-wider mb-4">No Items to Checkout</p>
            <p className="text-gray-500 text-xs font-light mb-6">Your culinary cart is empty. Please select dishes first.</p>
            <Link href="/menu" className="inline-block px-6 py-3 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-luxury-black uppercase tracking-widest text-[10px] font-semibold transition-all">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details & Payment */}
            <div className="lg:col-span-7 glass-panel p-6 md:p-8 space-y-8">
              <h3 className="font-serif text-base text-white uppercase tracking-wider border-b border-gray-900 pb-3">
                Customer & Table Details
              </h3>
              
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-light block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Arthur Pendragon"
                      className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-3 px-4 text-xs text-white placeholder-gray-700 rounded-none outline-none"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-light">{errors.name}</span>}
                  </div>

                  {/* Table Number Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase font-light block">Table Number</label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 04"
                      className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-3 px-4 text-xs text-white placeholder-gray-700 rounded-none outline-none"
                    />
                    {errors.tableNumber && <span className="text-[10px] text-red-500 font-light">{errors.tableNumber}</span>}
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-light block">Mobile Number (10 digits)</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 9876543210"
                    className="w-full bg-luxury-black/60 border border-gray-900 focus:border-gold-500 transition-colors py-3 px-4 text-xs text-white placeholder-gray-700 rounded-none outline-none"
                  />
                  {errors.mobileNumber && <span className="text-[10px] text-red-500 font-light">{errors.mobileNumber}</span>}
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-4 pt-4">
                  <label className="text-[10px] tracking-widest text-gray-500 uppercase font-light block border-t border-gray-900 pt-6">Select Payment Mode</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Razorpay Online Option */}
                    <div
                      onClick={() => setPaymentMode("online")}
                      className={`glass-panel p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer border transition-all duration-300 ${
                        paymentMode === "online" ? "border-gold-500 bg-gold-500/5 text-white" : "border-gray-900 text-gray-500 hover:border-gold-500/30"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-gold-500" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Online Payment</span>
                      <span className="text-[9px] text-gray-600 font-light">Razorpay Gateway</span>
                    </div>

                    {/* Pay on Counter Option */}
                    <div
                      onClick={() => setPaymentMode("counter")}
                      className={`glass-panel p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer border transition-all duration-300 ${
                        paymentMode === "counter" ? "border-gold-500 bg-gold-500/5 text-white" : "border-gray-900 text-gray-500 hover:border-gold-500/30"
                      }`}
                    >
                      <Coins className="w-5 h-5 text-gold-500" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Pay on Counter</span>
                      <span className="text-[9px] text-gray-600 font-light">Pay at cash desk</span>
                    </div>

                    {/* Get Table Bill Option */}
                    <div
                      onClick={() => setPaymentMode("bill")}
                      className={`glass-panel p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer border transition-all duration-300 ${
                        paymentMode === "bill" ? "border-gold-500 bg-gold-500/5 text-white" : "border-gray-900 text-gray-500 hover:border-gold-500/30"
                      }`}
                    >
                      <Landmark className="w-5 h-5 text-gold-500" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Get Table Bill</span>
                      <span className="text-[9px] text-gray-600 font-light">Waiter brings bill</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold-500 text-luxury-black hover:bg-gold-600 transition-all font-serif text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed rounded-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      `Place Order (₹${grandTotal})`
                    )}
                  </button>

                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 glass-panel p-6 space-y-6">
              <h3 className="font-serif text-base text-white uppercase tracking-wider border-b border-gray-900 pb-3">
                Order Review
              </h3>

              <div className="divide-y divide-gray-900/50 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="relative w-12 h-12 flex-shrink-0 border border-gold-500/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-[11px] font-medium text-white uppercase tracking-wide leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-gold-500 text-xs font-serif">₹{item.numericPrice * item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-500">
                        <span>Quantity: {item.quantity}</span>
                        <span>{item.price} each</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-900 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{gst}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Service Charge</span>
                  <span className="text-white">₹{serviceCharge}</span>
                </div>
                <div className="flex justify-between border-t border-gray-900 pt-3 text-sm uppercase tracking-wider text-white font-semibold">
                  <span>Grand Total</span>
                  <span className="text-gold-500 font-serif text-base">₹{grandTotal}</span>
                </div>
              </div>


              <div className="p-4 bg-gold-500/5 border border-gold-500/10 text-[10px] text-gold-500/80 font-light leading-relaxed">
                Your order is processed securely. Online payments are finalized via Razorpay. Pay on Counter or Request Table Bill options can be settled directly in the dining hall.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
