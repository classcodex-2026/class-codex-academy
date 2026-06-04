import { Button } from "@/components/ui/button";
import { Clock, BookOpen, FileText, MessageCircle } from "lucide-react";
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
  "Open for Enrollment": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Coming Soon": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "New Batch Starting": "bg-primary/15 text-primary border-primary/30",
};

const CourseCard = ({
  title,
  description,
  price,
  originalPrice,
  duration,
  modulesCount,
  icon,
  status,
  syllabusPath,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const isComingSoon = status === "Coming Soon";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/40 h-full flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6 md:p-7 flex flex-col flex-1 relative z-10">
        {/* Top row: icon + status */}
        <div className="flex items-start justify-between mb-5">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            whileHover={{
              boxShadow: "0 0 30px hsl(180 100% 50% / 0.35)",
              borderColor: "hsl(180 100% 50% / 0.6)",
            }}
          >
            {icon}
          </motion.div>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-5 line-clamp-3">
          {description}
        </p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 border border-border rounded-full px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {duration}
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 border border-border rounded-full px-3 py-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            {modulesCount} Modules
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          {isComingSoon ? (
            <span className="text-2xl font-bold text-amber-400">
              Coming Soon
            </span>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              {originalPrice && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-3xl font-bold text-primary">
                ₹{price?.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">/ course</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
            onClick={() => navigate(syllabusPath)}
          >
            <FileText className="w-4 h-4 mr-1" />
            View Syllabus
          </Button>
          <Button
            asChild
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          >
            <a
              href={buildWhatsAppLink(title)}
              target="_top"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Enroll Now
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
