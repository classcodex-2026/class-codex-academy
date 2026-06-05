import { Button } from "@/components/ui/button";
import { BookOpen, FileText, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "./CourseSyllabusPage";

export type CourseStatus = "Open for Enrollment" | "Coming Soon" | "New Batch Starting";

interface CourseCardProps {
  title: string;
  description: string;
  price: number | null;
  originalPrice?: number | null;
  duration: string;
  modulesCount: number;
  icon: React.ReactNode;
  status: CourseStatus;
  syllabusPath: string;
}

const statusStyles: Record<CourseStatus, string> = {
  "Open for Enrollment": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Coming Soon": "bg-amber-50 text-amber-700 border-amber-200",
  "New Batch Starting": "bg-blue-50 text-primary border-blue-200",
};

const CourseCard = ({
  title, description, price, originalPrice, duration,
  modulesCount, icon, status, syllabusPath,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const isComingSoon = status === "Coming Soon";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative bg-card rounded-2xl border border-border shadow-card hover:shadow-elegant hover:border-primary/40 transition-all duration-300 overflow-hidden h-full flex flex-col border-beam"
    >
      {/* Top blue accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 md:p-7 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between mb-5">
          <motion.div
            className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-soft"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="[&_svg]:w-7 [&_svg]:h-7 [&_svg]:text-white">{icon}</div>
          </motion.div>
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${statusStyles[status]}`}>
            {status}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-5 line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 bg-muted border border-border rounded-full px-3 py-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            {modulesCount} Modules
          </div>
          {duration && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 bg-muted border border-border rounded-full px-3 py-1.5">
              {duration}
            </div>
          )}
        </div>

        <div className="mb-6">
          {isComingSoon ? (
            <span className="text-2xl font-bold text-amber-600">Coming Soon</span>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              {originalPrice && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-3xl font-extrabold gradient-text">
                ₹{price?.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">/ course</span>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-2 border-border hover:border-primary hover:bg-accent hover:text-primary rounded-full"
            onClick={() => navigate(syllabusPath)}
          >
            <FileText className="w-4 h-4" />
            Syllabus
          </Button>
          <Button asChild className="btn-gradient border-0 rounded-full">
            <a href={buildWhatsAppLink(title)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              Enroll
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
