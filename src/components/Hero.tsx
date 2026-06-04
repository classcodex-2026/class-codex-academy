import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award, Zap, Calendar, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TechLogosMarquee from "./TechLogosMarquee";

const Hero = () => {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[128px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/20 blur-[128px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 neon-border"
          >
            <motion.span
              className="w-2.5 h-2.5 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              Enrolling Batch 2026
            </span>
            <Zap className="w-4 h-4 text-primary" />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Master{" "}
            <span className="text-gradient">In-Demand</span>
            <br />
            Tech Skills with{" "}
            <motion.span
              className="text-primary neon-text inline-block"
              animate={{ textShadow: [
                "0 0 10px hsl(180 100% 50% / 0.8), 0 0 20px hsl(180 100% 50% / 0.5)",
                "0 0 20px hsl(180 100% 50% / 1), 0 0 40px hsl(180 100% 50% / 0.7)",
                "0 0 10px hsl(180 100% 50% / 0.8), 0 0 20px hsl(180 100% 50% / 0.5)",
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ClassCodex
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Learn industry-relevant technologies like SQL, Python, Snowflake, and Power BI 
            from expert instructors. Start your data career today.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-button text-lg px-8 py-6"
              onClick={() => scrollToSection("courses")}
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 text-lg px-8 py-6"
              asChild
            >
              <a
                href="https://wa.me/919442150416?text=Hello%2C%20I%20would%20like%20to%20book%20a%20free%20consultation%20with%20ClassCodex.%20Please%20share%20available%20slots."
                target="_top"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book Free Consultation
              </a>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { icon: BookOpen, value: "4+", label: "Courses" },
              { icon: Users, value: "500+", label: "Students" },
              { icon: Award, value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary group-hover:drop-shadow-[0_0_10px_hsl(180_100%_50%)] transition-all" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tech Logos Marquee */}
      <div className="relative z-10 mt-8">
        <TechLogosMarquee />
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
