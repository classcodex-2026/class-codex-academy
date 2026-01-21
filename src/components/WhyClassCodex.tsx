import { GraduationCap, MessageCircleQuestion, Briefcase, FileCheck, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-card rounded-2xl p-6 h-full transition-all duration-300 border border-primary/10 hover:border-primary/30 card-shadow hover:card-shadow-hover group"
    >
      <motion.div
        className="mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
        whileHover={{ 
          boxShadow: "0 0 25px hsl(180 100% 50% / 0.3)",
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const WhyClassCodex = () => {
  const features = [
    {
      icon: <GraduationCap className="w-7 h-7 text-primary" />,
      title: "Beginner Friendly & Affordable",
      description: "Join a passionate community and master data skills without breaking the bank!",
    },
    {
      icon: <MessageCircleQuestion className="w-7 h-7 text-primary" />,
      title: "Online/Offline Doubt Solving",
      description: "Instantly conquer doubts in live classes and discord – your fast track to success!",
    },
    {
      icon: <Layers className="w-7 h-7 text-primary" />,
      title: "Industry Level Projects",
      description: "Master real-world skills with our industry-level projects – your gateway to career success!",
    },
    {
      icon: <Briefcase className="w-7 h-7 text-primary" />,
      title: "Placement Assistance",
      description: "Ace your career with resume enhancement, interview mastery, and LinkedIn optimization!",
    },
    {
      icon: <FileCheck className="w-7 h-7 text-primary" />,
      title: "Interview Preparation",
      description: "Boost your mastery with captivating quizzes and assignments after each module!",
    },
    {
      icon: <Users className="w-7 h-7 text-primary" />,
      title: "Community Learning",
      description: "Unite with a vibrant, passionate community of like-minded learners – grow together!",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Left Title Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
              Why<br />
              <span className="text-gradient">ClassCodex</span>?
            </h2>
            <motion.button
              onClick={() => {
                const element = document.getElementById('enquiry');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-all glow-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              More About Us
            </motion.button>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyClassCodex;
