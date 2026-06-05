import { GraduationCap, MessageCircleQuestion, Briefcase, FileCheck, Users, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="bg-card rounded-2xl p-6 h-full border border-border shadow-card hover-lift group border-beam"
  >
    <div className="mb-5 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform [&_svg]:text-white">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const WhyClassCodex = () => {
  const features = [
    { icon: <GraduationCap className="w-6 h-6" />, title: "Beginner Friendly & Affordable", description: "Join a passionate community and master data skills without breaking the bank." },
    { icon: <MessageCircleQuestion className="w-6 h-6" />, title: "Online & Offline Doubt Solving", description: "Get help in live classes and on Discord — fast resolution, every time." },
    { icon: <Layers className="w-6 h-6" />, title: "Industry-Level Projects", description: "Build real-world capstones that showcase what you can actually ship." },
    { icon: <Briefcase className="w-6 h-6" />, title: "Placement Assistance", description: "Resume reviews, interview prep and LinkedIn optimisation — end to end." },
    { icon: <FileCheck className="w-6 h-6" />, title: "Interview Preparation", description: "Quizzes, mock interviews and assignments after every module." },
    { icon: <Users className="w-6 h-6" />, title: "Community Learning", description: "Grow alongside a vibrant community of motivated learners." },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="blob bg-secondary/20 w-[450px] h-[450px] top-1/3 -left-32 animate-blob" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-4 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 lg:sticky lg:top-24"
          >
            <span className="inline-block bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mt-4 mb-5 tracking-tight">
              Why <span className="gradient-text">ClassCodex</span>?
            </h2>
            <p className="text-muted-foreground mb-6">
              Premium mentorship, real projects and a job-ready outcome — without the price tag of a bootcamp.
            </p>
            <motion.button
              onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Talk to a mentor <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyClassCodex;
