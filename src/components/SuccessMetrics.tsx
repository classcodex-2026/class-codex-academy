import { TrendingUp, Users, Award, Briefcase, GraduationCap, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  color: string;
}

const MetricCard = ({ icon, value, suffix = "", prefix = "", label, description, color }: MetricCardProps) => {
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
    <div className="group relative bg-card rounded-2xl p-6 card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        <div className="mb-2">
          <span className="text-4xl font-bold text-foreground">
            {prefix}{count.toLocaleString()}{suffix}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {/* Decorative element */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
    </div>
  );
};

const SuccessMetrics = () => {
  const metrics = [
    {
      icon: <Users className="w-7 h-7 text-white" />,
      value: 500,
      suffix: "+",
      label: "Learners Trained",
      description: "Since November 2024, empowering careers across India",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <GraduationCap className="w-7 h-7 text-white" />,
      value: 1200,
      suffix: "+",
      label: "Skills Upgraded",
      description: "New skills mastered by our learners",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      value: 45,
      suffix: "%",
      label: "Average Salary Hike",
      description: "Reported by placed students",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Briefcase className="w-7 h-7 text-white" />,
      value: 85,
      suffix: "%",
      label: "Placement Rate",
      description: "Students placed within 3 months",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <Award className="w-7 h-7 text-white" />,
      value: 95,
      suffix: "%",
      label: "Course Completion",
      description: "Students who complete their courses",
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: <Target className="w-7 h-7 text-white" />,
      value: 20,
      suffix: "+",
      label: "Hiring Partners",
      description: "Companies actively recruiting our students",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Success Stories in Numbers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Since launching in November 2024, we've been transforming careers and empowering 
            learners with industry-relevant skills. Here's our journey so far.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Timeline indicator */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 card-shadow">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Nov 2024</span> - Present
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
