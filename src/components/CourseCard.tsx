import { Button } from "@/components/ui/button";
import { Check, Clock, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EnquiryDialog from "./EnquiryDialog";

interface CourseCardProps {
  title: string;
  description: string;
  price: number | null;
  originalPrice?: number | null;
  duration: string;
  syllabus: string[];
  icon: React.ReactNode;
  popular?: boolean;
  comingSoon?: boolean;
}

const CourseCard = ({ title, description, price, originalPrice, duration, syllabus, icon, popular, comingSoon }: CourseCardProps) => {
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (title === "Python Programming") {
      navigate("/course/python");
    }
  };

  const hasCourseDetail = title === "Python Programming";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/30 h-full flex flex-col"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {popular && !comingSoon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full"
        >
          Most Popular
        </motion.div>
      )}
      {comingSoon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-3 py-1 rounded-full"
        >
          Coming Soon
        </motion.div>
      )}
      
      <div className="p-6 flex flex-col flex-1 relative z-10">
        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
          whileHover={{ 
            boxShadow: "0 0 25px hsl(180 100% 50% / 0.3)",
            borderColor: "hsl(180 100% 50% / 0.5)"
          }}
        >
          {icon}
        </motion.div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>{syllabus.length} Modules</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          {comingSoon ? (
            <span className="text-2xl font-bold text-amber-400">Coming Soon</span>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
              )}
              <span className="text-3xl font-bold text-primary">₹{price?.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">/ course</span>
            </div>
          )}
        </div>
        
        {/* View Details Button - Only for courses with detail pages */}
        {hasCourseDetail && (
          <Button 
            variant="outline" 
            className="w-full mb-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary" 
            onClick={handleCardClick}
          >
            View Details
          </Button>
        )}
        
        {/* Syllabus Toggle - Only for courses without detail pages */}
        {!hasCourseDetail && (
          <>
            <button
              onClick={() => setShowSyllabus(!showSyllabus)}
              className="text-primary text-sm font-medium hover:underline mb-4 flex items-center gap-1"
            >
              {showSyllabus ? "Hide Syllabus" : "View Syllabus"}
              <svg 
                className={`w-4 h-4 transition-transform ${showSyllabus ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Syllabus List */}
            {showSyllabus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-muted/50 rounded-lg border border-primary/10"
              >
                <h4 className="font-semibold text-sm text-foreground mb-3">Course Syllabus</h4>
                <ul className="space-y-2">
                  {syllabus.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}
        
        {/* CTA - Push to bottom */}
        <div className="mt-auto">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-button" 
            onClick={() => setDialogOpen(true)}
          >
            {comingSoon ? "Notify Me" : "Enroll Now"}
          </Button>
        </div>
      </div>

      <EnquiryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courseName={title}
        isNotify={comingSoon}
      />
    </motion.div>
  );
};

export default CourseCard;
