import { TrendingUp, Users, Award, Briefcase, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
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
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden border border-primary/10"
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, hsl(180 100% 50% / 0.1), transparent, hsl(280 100% 65% / 0.1))",
        }}
      />
      
      <div className="relative z-10">
        <motion.div
          className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30"
          whileHover={{ 
            boxShadow: "0 0 30px hsl(180 100% 50% / 0.4)",
            borderColor: "hsl(180 100% 50% / 0.6)"
          }}
        >
          {icon}
        </motion.div>
        
        <div className="mb-2">
          <span className="text-4xl font-bold text-foreground">
            {prefix}{count.toLocaleString()}{suffix}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {/* Corner decoration */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300" />
    </motion.div>
  );
};

const SuccessMetrics = () => {
  const metrics = [
    {
      icon: <Users className="w-7 h-7 text-primary" />,
      value: 500,
      suffix: "+",
      label: "Learners Trained",
      description: "Since November 2024, empowering careers across India",
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-primary" />,
      value: 35,
      suffix: "%",
      label: "Average Salary Hike",
      description: "Reported by placed students",
    },
    {
      icon: <Briefcase className="w-7 h-7 text-primary" />,
      value: 78,
      suffix: "%",
      label: "Placement Rate",
      description: "Students placed within 3 months",
    },
    {
      icon: <Award className="w-7 h-7 text-primary" />,
      value: 92,
      suffix: "%",
      label: "Course Completion",
      description: "Students who complete their courses",
    },
    {
      icon: <Target className="w-7 h-7 text-primary" />,
      value: 12,
      suffix: "+",
      label: "Hiring Partners",
      description: "Companies actively recruiting our students",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Success Stories in{" "}
            <span className="text-gradient">Numbers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Since launching in November 2024, we've been transforming careers and empowering 
            learners with industry-relevant skills. Here's our journey so far.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} delay={index * 0.1} />
          ))}
        </div>

        {/* Timeline indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 border border-primary/20">
            <motion.span
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Nov 2024</span> - Present
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
