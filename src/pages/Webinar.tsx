import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppLink } from "@/components/CourseSyllabusPage";

interface Webinar {
  title: string;
  topic: string;
  date: string;
  time: string;
  speaker: string;
  description: string;
}

// Set this list as new webinars are scheduled.
const upcoming: Webinar[] = [];

const Webinar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Live Sessions
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2 mb-4">
              Upcoming Webinars
            </h1>
            <p className="text-muted-foreground text-lg">
              Join live, expert-led sessions on the most in-demand tech skills.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {upcoming.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-card border border-primary/20 rounded-2xl p-10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No upcoming webinars currently
            </h2>
            <p className="text-muted-foreground mb-6">
              Follow us for updates — we announce new sessions every month.
            </p>
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <a
                href={buildWhatsAppLink("Webinar Updates")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Get Notified on WhatsApp
              </a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {upcoming.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="text-2xl font-bold text-foreground mb-1">{w.title}</h3>
                <p className="text-primary font-medium mb-3">{w.topic}</p>
                <p className="text-sm text-muted-foreground mb-5">{w.description}</p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> {w.date}</li>
                  <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {w.time}</li>
                  <li className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {w.speaker}</li>
                </ul>
                <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  <a
                    href={buildWhatsAppLink(`Webinar: ${w.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Register Now
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Webinar;
