import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Sparkles, Play, Star, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TechLogosMarquee from "./TechLogosMarquee";

const ROTATING = ["SQL", "Python", "Snowflake", "Power BI", "Data Science"];

const Hero = () => {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const current = ROTATING[wordIdx];
    const speed = deleting ? 55 : 110;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % ROTATING.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden bg-background pt-12 md:pt-20 pb-16">
      {/* Soft gradient background */}
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute inset-0 bg-grid" />

      {/* Animated blobs */}
      <div className="blob bg-primary/30 w-[520px] h-[520px] -top-40 -left-32 animate-blob" />
      <div className="blob bg-secondary/30 w-[460px] h-[460px] top-20 -right-32 animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="blob bg-sky-400/25 w-[380px] h-[380px] bottom-0 left-1/3 animate-blob" style={{ animationDelay: "-12s" }} />

      {/* Floating tech icons */}
      {[
        { label: "🐍", top: "12%", left: "8%", d: 0 },
        { label: "📊", top: "20%", right: "10%", d: 1.2 },
        { label: "❄️", bottom: "18%", left: "6%", d: 2.4 },
        { label: "🗄️", bottom: "22%", right: "8%", d: 0.6 },
        { label: "☁️", top: "55%", left: "3%", d: 1.8 },
        { label: "⚡", top: "60%", right: "4%", d: 3 },
      ].map((f, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex w-14 h-14 rounded-2xl bg-white shadow-elegant items-center justify-center text-2xl border border-border"
          style={{ top: f.top as any, left: f.left as any, right: f.right as any, bottom: f.bottom as any }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + f.d * 0.1, duration: 0.6 }}
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: f.d }}
          >
            {f.label}
          </motion.span>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white border border-border shadow-soft rounded-full pl-2 pr-4 py-1.5 mb-6"
          >
            <span className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3 h-3" /> NEW
            </span>
            <span className="text-sm text-foreground/70">Batch 2026 enrolling — limited seats</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight"
          >
            Master In-Demand
            <br />
            <span className="gradient-text caret">{text || "\u00A0"}</span>
            <br />
            <span className="text-foreground/90">skills that get you hired</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Live, project-driven cohorts in SQL, Python, Snowflake, Power BI and Data Science —
            taught by industry mentors with placement support.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Button
              size="lg"
              onClick={() => scrollTo("courses")}
              className="btn-gradient border-0 rounded-full h-14 px-8 text-base font-semibold"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full h-14 px-7 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://wa.me/919629997602?text=Hello%2C%20I%20would%20like%20to%20book%20a%20free%20consultation%20with%20ClassCodex."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                Book Free Consultation
              </a>
            </Button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full gradient-primary ring-2 ring-background flex items-center justify-center text-[10px] text-white font-bold">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
              </div>
              <span><b className="text-foreground">500+</b> learners trained</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-1"><b className="text-foreground">4.9/5</b> avg rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span><b className="text-foreground">78%</b> placement rate</span>
            </div>
          </motion.div>
        </div>

        {/* Tech marquee */}
        <div className="mt-16">
          <TechLogosMarquee />
        </div>
      </div>
    </section>
  );
};

export default Hero;
