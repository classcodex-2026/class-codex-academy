import { useState } from "react";
import { X, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  const waLink = "https://web.whatsapp.com/send?phone=919629997602";

  return (
    <div className="relative z-[60] gradient-primary text-primary-foreground">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center relative">
        <Sparkles className="w-4 h-4 hidden sm:inline" />
        <p className="text-sm font-medium">
          New learner offer — <span className="font-bold">20% OFF</span> on every course this month
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 ml-3 text-sm font-semibold underline-offset-2 hover:underline"
        >
          <MessageCircle className="w-4 h-4" />
          Enroll now →
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
