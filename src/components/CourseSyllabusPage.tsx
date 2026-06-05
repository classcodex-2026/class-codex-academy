import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  FolderKanban,
  Award,
  CheckCircle2,
  Target,
  ListChecks,
  MessageCircle,
} from "lucide-react";

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface CourseSyllabusData {
  name: string;
  tagline: string;
  overview: string;
  duration: string;
  modulesCount?: number;
  projectsCount?: number;
  status: "Open for Enrollment" | "Coming Soon" | "New Batch Starting";
  price?: number | null;
  originalPrice?: number | null;
  outcomes: string[];
  prerequisites: string[];
  projects: string[];
  certification: string;
  modules: SyllabusModule[];
  faqs: FAQItem[];
  icon?: React.ReactNode;
}

const WA_NUMBER = "919629997602";

export const buildWhatsAppLink = (courseName: string) => {
  const message = `Hello I am interested in enrolling in ${courseName}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

const statusStyles: Record<CourseSyllabusData["status"], string> = {
  "Open for Enrollment":
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Coming Soon": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "New Batch Starting": "bg-primary/15 text-primary border-primary/30",
};

const CourseSyllabusPage = ({ data }: { data: CourseSyllabusData }) => {
  const navigate = useNavigate();
  const modulesCount = data.modulesCount ?? data.modules.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/60 backdrop-blur border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{data.name}</h1>
            <p className="text-sm text-muted-foreground">{data.tagline}</p>
          </div>
          <span
            className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[data.status]}`}
          >
            {data.status}
          </span>
        </div>
      </header>

      {/* Hero / Stats */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span
              className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[data.status]} mb-4`}
            >
              {data.status}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {data.name}
            </h2>
            <p className="text-muted-foreground text-lg">{data.overview}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: BookOpen, label: "Modules", value: String(modulesCount) },
              {
                icon: FolderKanban,
                label: "Projects",
                value: String(data.projectsCount ?? data.projects.length),
              },
              { icon: Award, label: "Certificate", value: "Included" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur p-4"
              >
                <s.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Batch Timings */}
          <div className="mt-6 rounded-xl border border-primary/20 bg-card/60 backdrop-blur p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Batch Timings</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-primary font-semibold mb-1">Weekdays Batch (Monday – Friday)</p>
                <p className="text-muted-foreground">
                  1 – 1.5 hr&nbsp;&nbsp;:&nbsp;&nbsp;7 AM to 9 PM (in-between any timings)
                </p>
              </div>
              <div>
                <p className="text-primary font-semibold mb-1">Weekend Batch (Sat & Sun)</p>
                <p className="text-muted-foreground">
                  2 – 3 hr&nbsp;&nbsp;:&nbsp;&nbsp;8 AM to 8 PM (in-between any timings)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-card rounded-2xl border-2 border-primary/30 p-6 sticky top-24">
              {data.price != null ? (
                <div className="mb-4">
                  {data.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{data.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <p className="text-3xl font-bold text-foreground">
                    ₹{data.price.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-amber-400 mb-4">
                  Coming Soon
                </p>
              )}

              <Button
                asChild
                className="w-full mb-3 bg-emerald-500 hover:bg-emerald-600 text-white"
                size="lg"
              >
                <a
                  href={buildWhatsAppLink(data.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Enroll Now
                </a>
              </Button>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-primary font-semibold mb-3">
                  This course includes
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Modules
                    </span>
                    <span className="font-medium text-foreground">
                      {modulesCount}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      Projects
                    </span>
                    <span className="font-medium text-foreground">
                      {data.projectsCount ?? data.projects.length}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Certification
                    </span>
                    <span className="font-medium text-foreground">Yes</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-10">
            {/* Outcomes */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Learning Outcomes
                </h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {data.outcomes.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground bg-card/60 border border-border rounded-lg p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Modules */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Detailed Module Breakdown
                </h3>
              </div>
              <Accordion
                type="multiple"
                defaultValue={["module-0"]}
                className="space-y-3"
              >
                {data.modules.map((m, i) => (
                  <AccordionItem
                    key={i}
                    value={`module-${i}`}
                    className="bg-card rounded-xl border border-border px-4 !border-b"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-foreground text-left">
                        {m.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 mt-2">
                        {m.topics.map((t, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Prerequisites & Projects */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-bold text-foreground mb-3">
                  Prerequisites
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {data.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-bold text-foreground mb-3">Projects</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {data.projects.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FolderKanban className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Certification */}
            <section className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Certification
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.certification}
              </p>
            </section>

            {/* FAQs */}
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="space-y-3">
                {data.faqs.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-card rounded-xl border border-border px-4 !border-b"
                  >
                    <AccordionTrigger className="hover:no-underline text-left font-medium">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Bottom CTA */}
            <div className="bg-card border border-primary/30 rounded-2xl p-6 text-center">
              <h4 className="text-xl font-bold text-foreground mb-2">
                Ready to start?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Talk to our team on WhatsApp for fees, batch dates and
                enrollment.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <a
                  href={buildWhatsAppLink(data.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Enroll Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSyllabusPage;
