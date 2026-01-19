import { useState } from "react";
import { X, Sparkles } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const scrollToEnquiry = () => {
    const element = document.getElementById("enquiry");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-red-600 text-white py-2.5 relative overflow-hidden z-[60]">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mx-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              First time here? Get <span className="font-bold">20% OFF</span> as a new user on any course
            </span>
            <button
              onClick={scrollToEnquiry}
              className="ml-4 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Enroll Now 🚀 →
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
