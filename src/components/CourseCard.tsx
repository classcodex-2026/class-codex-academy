import { Button } from "@/components/ui/button";
import { Check, Clock, BookOpen } from "lucide-react";
import { useState } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  price: number | null;
  duration: string;
  syllabus: string[];
  icon: React.ReactNode;
  popular?: boolean;
  comingSoon?: boolean;
}

const CourseCard = ({ title, description, price, duration, syllabus, icon, popular, comingSoon }: CourseCardProps) => {
  const [showSyllabus, setShowSyllabus] = useState(false);

  const scrollToEnquiry = () => {
    const element = document.getElementById("enquiry");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`relative bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden ${popular ? 'ring-2 ring-primary' : ''}`}>
      {popular && !comingSoon && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}
      
      <div className="p-6">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
          {icon}
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{syllabus.length} Modules</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          {comingSoon ? (
            <span className="text-2xl font-bold text-amber-500">Coming Soon</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-foreground">₹{price?.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm ml-1">/ course</span>
            </>
          )}
        </div>
        
        {/* Syllabus Toggle */}
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
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm text-foreground mb-3">Course Syllabus</h4>
            <ul className="space-y-2">
              {syllabus.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* CTA */}
        <Button className="w-full" onClick={scrollToEnquiry}>
          {comingSoon ? "Notify Me" : "Enroll Now"}
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
