import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Target,
  Eye,
  Briefcase,
  Wrench,
  Compass,
  GraduationCap,
  TrendingUp,
  Award,
} from "lucide-react";

const sections = [
  { icon: Target, title: "Our Mission", body: "Empower learners with practical, industry-aligned tech skills that lead to real career outcomes." },
  { icon: Eye, title: "Our Vision", body: "To become the most trusted edtech platform for in-demand tech careers in India and beyond." },
];

const why = [
  { icon: Briefcase, title: "Industry-Focused Training", body: "Curriculum co-designed with practitioners working in top tech and data teams." },
  { icon: Wrench, title: "Hands-On Projects", body: "Every course ends with portfolio-grade projects you can showcase to recruiters." },
  { icon: Compass, title: "Career Guidance", body: "Resume reviews, mock interviews and guidance from senior engineers and analysts." },
  { icon: GraduationCap, title: "Expert Instructors", body: "Learn from instructors who have shipped real systems in production environments." },
  { icon: TrendingUp, title: "Student Success Focus", body: "We measure ourselves on your outcomes — skills gained, projects shipped, jobs landed." },
  { icon: Award, title: "Recognised Certificates", body: "Verifiable course certificates to boost your profile and LinkedIn presence." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              About ClassCodex
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2 mb-4">
              Mastering In-Demand Tech Skills
            </h1>
            <p className="text-muted-foreground text-lg">
              ClassCodex is a modern edtech platform built to help learners launch and accelerate
              careers in Python, Data, AI and Cyber Security through practical, project-led training.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-primary/20 rounded-2xl p-8"
            >
              <s.icon className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">{s.title}</h2>
              <p className="text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          Why Learn With <span className="text-primary">Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {why.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border hover:border-primary/40 rounded-2xl p-6 transition-colors"
            >
              <w.icon className="w-7 h-7 text-primary mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">{w.title}</h3>
              <p className="text-sm text-muted-foreground">{w.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
