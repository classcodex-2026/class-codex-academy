import { useState } from "react";
import { X, Sparkles, Zap, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const waLink = "https://wa.me/919442150416?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20in%20a%20course%20at%20ClassCodex.%20Please%20share%20course%20details%2C%20fees%2C%20and%20upcoming%20batches.";

  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 text-foreground py-2.5 relative overflow-hidden z-[60] border-b border-primary/20">
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="flex animate-marquee whitespace-nowrap relative z-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mx-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              First time here? Get <span className="font-bold text-primary">20% OFF</span> as a new user on any course
            </span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Enroll Now 🚀 →
            </a>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
