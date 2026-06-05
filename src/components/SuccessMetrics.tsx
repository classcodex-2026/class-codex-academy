import { TrendingUp, Users, Award, Briefcase, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  delay: number;
}

const MetricCard = ({ icon, value, suffix = "", prefix = "", label, description, delay }: MetricCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay }}
      className="group relative bg-card rounded-2xl p-6 border border-border shadow-card hover-lift overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft text-white [&_svg]:text-white">
          {icon}
        </div>

        <div className="mb-1">
          <span className="text-4xl font-extrabold gradient-text tracking-tight">
            {prefix}{count.toLocaleString()}{suffix}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const SuccessMetrics = () => {
  const metrics = [
    { icon: <Users className="w-6 h-6" />, value: 500, suffix: "+", label: "Learners Trained", description: "Empowering careers across India since Nov 2024." },
    { icon: <TrendingUp className="w-6 h-6" />, value: 35, suffix: "%", label: "Average Salary Hike", description: "Reported by placed students." },
    { icon: <Briefcase className="w-6 h-6" />, value: 78, suffix: "%", label: "Placement Rate", description: "Students placed within 3 months." },
    { icon: <Award className="w-6 h-6" />, value: 92, suffix: "%", label: "Course Completion", description: "Students who finish their cohorts." },
    { icon: <Target className="w-6 h-6" />, value: 12, suffix: "+", label: "Hiring Partners", description: "Companies actively recruiting our graduates." },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "hsl(var(--surface-soft))" }}>
      <div className="absolute inset-0 bg-grid opacity-60" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-block bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-4 mb-4 tracking-tight">
            Success stories in <span className="gradient-text">numbers</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Since November 2024, we've helped hundreds of learners launch and accelerate their tech careers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
