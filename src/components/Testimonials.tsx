"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialReviews = [
  {
    rating: 5,
    text: "One of the finest dining experiences we've had. The attention to detail in the flavor pairings, the curated wines, and the exceptional service made it unforgettable.",
    author: "Sophia Loren",
    title: "Culinary Connoisseur",
  },
  {
    rating: 5,
    text: "Amazing food, atmosphere, and service. Chef Sunil Kumar's butter chicken and lamb shanks are absolute masterpieces. An absolute jewel of modern dining.",
    author: "Marcus Pierre",
    title: "Gastronomy Critic",
  },
  {
    rating: 5,
    text: "Beautiful ambience and unforgettable taste. The live music set the perfect mood, and the staff treated us like royalty. We will definitely return next season.",
    author: "Elena Rostova",
    title: "Vogue Travel Writer",
  },
];

export default function Testimonials() {
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [activeIndex, setActiveIndex] = useState(0);

  // Form State
  const [newReview, setNewReview] = useState({
    author: "",
    title: "",
    text: "",
    rating: 5,
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [reviewsList.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handleRatingClick = (val: number) => {
    setNewReview((prev) => ({ ...prev, rating: val }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newReview.author.trim()) errors.author = "Please enter your name";
    if (!newReview.title.trim()) errors.title = "Please enter your title/profession";
    if (!newReview.text.trim()) errors.text = "Please write your review";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Prepend review and show it immediately in the carousel
      setReviewsList((prev) => [newReview, ...prev]);
      setActiveIndex(0);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setNewReview({ author: "", title: "", text: "", rating: 5 });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  return (
    <section className="py-24 bg-luxury-black border-t border-b border-gold-500/5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-[35%] left-[-10%] w-96 h-96 rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 rounded-full bg-gold-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 border border-gold-500/20 rounded-full bg-luxury-dark">
            <Quote className="w-8 h-8 text-gold-500" />
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative min-h-[220px] text-center flex items-center justify-center">
          {reviewsList.map((review, index) => {
            const isVisible = activeIndex === index;
            if (!isVisible) return null;

            return (
              <motion.div
                key={`${review.author}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 max-w-3xl"
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-800" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-serif text-lg md:text-2xl text-[var(--foreground)] font-light leading-relaxed italic">
                  &quot;{review.text}&quot;
                </p>

                {/* Author Info */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-[0.2em] text-[var(--foreground)] uppercase font-semibold">
                    {review.author}
                  </span>
                  <span className="text-[10px] tracking-[0.15em] text-gold-500/80 uppercase font-light">
                    {review.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12 mb-20">
          <button
            onClick={handlePrev}
            className="p-2 border border-gray-800 rounded-full hover:border-gold-500 hover:text-gold-500 text-gray-500 transition-colors cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            {reviewsList.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index ? "w-4 bg-gold-500" : "bg-gray-800"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 border border-gray-800 rounded-full hover:border-gold-500 hover:text-gold-500 text-gray-500 transition-colors cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Review Section Form */}
        <div className="max-w-2xl mx-auto border border-gold-500/10 bg-luxury-dark/40 backdrop-blur-md p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl text-[var(--foreground)] uppercase tracking-wider">
              Share Your Culinary Story
            </h3>
            <p className="text-xs text-gray-500 font-light mt-1 uppercase tracking-wider">
              Your feedback shapes our craft. Leave a review below.
            </p>
          </div>

          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5">
            {/* Interactive Stars Picker */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">Your Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = val <= (hoverRating !== null ? hoverRating : newReview.rating);
                  return (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handleRatingClick(val)}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition-transform duration-200 hover:scale-110"
                      aria-label={`Rate ${val} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isActive ? "fill-gold-500 text-gold-500" : "text-gray-800"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Name</label>
                <input
                  type="text"
                  name="author"
                  value={newReview.author}
                  onChange={handleInputChange}
                  placeholder="e.g. Sophia Loren"
                  className={`bg-luxury-dark border ${
                    formErrors.author ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                  } py-2.5 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300`}
                />
                {formErrors.author && <span className="text-[10px] text-red-400 font-light">{formErrors.author}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Title / Profession</label>
                <input
                  type="text"
                  name="title"
                  value={newReview.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Gastronomy Enthusiast"
                  className={`bg-luxury-dark border ${
                    formErrors.title ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                  } py-2.5 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300`}
                />
                {formErrors.title && <span className="text-[10px] text-red-400 font-light">{formErrors.title}</span>}
              </div>
            </div>

            {/* Review content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">Your Review</label>
              <textarea
                name="text"
                rows={4}
                value={newReview.text}
                onChange={handleInputChange}
                placeholder="Describe your dining experience, ambiance, and food..."
                className={`bg-luxury-dark border ${
                  formErrors.text ? "border-red-500" : "border-gray-800 focus:border-gold-500"
                } py-2.5 px-4 text-xs text-white placeholder-gray-600 outline-none transition-colors duration-300 resize-none`}
              />
              {formErrors.text && <span className="text-[10px] text-red-400 font-light">{formErrors.text}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gold-700 shadow-[0_4px_15px_rgba(197,168,128,0.15)]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
              ) : submitSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Review Published</span>
                </>
              ) : (
                <span>Publish Review</span>
              )}
            </button>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-green-400 font-light"
              >
                Thank you! Your review has been added to our guest list and slide showcase.
              </motion.div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
