import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const WA_NUMBER = "919629997602";

const ROLES = ["Student", "Fresher", "Working Professional"];
const INTERESTS = [
  "Data Engineering",
  "Snowflake",
  "dbt",
  "SQL",
  "Python",
  "Career Guidance",
  "Other",
];

const schema = z.object({
  fullName: z.string().trim().min(1, "Full Name is required").max(100),
  whatsapp: z
    .string()
    .trim()
    .min(7, "WhatsApp Number is required")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Enter a valid number"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  role: z.string().min(1, "Please select your current role"),
  experience: z.string().trim().max(50).optional().or(z.literal("")),
  interest: z.string().min(1, "Please select an area of interest"),
  requirement: z
    .string()
    .trim()
    .min(1, "Requirement description is required")
    .max(1000),
});

type FormState = {
  fullName: string;
  whatsapp: string;
  email: string;
  role: string;
  experience: string;
  interest: string;
  requirement: string;
};

const initial: FormState = {
  fullName: "",
  whatsapp: "",
  email: "",
  role: "",
  experience: "",
  interest: "",
  requirement: "",
};

const Consultation = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    const d = parsed.data;
    const message =
      `New Free Consultation Request\n\n` +
      `Name: ${d.fullName}\n` +
      `WhatsApp: ${d.whatsapp}\n` +
      `Email: ${d.email || "-"}\n` +
      `Role: ${d.role}\n` +
      `Experience: ${d.experience || "-"}\n` +
      `Area of Interest: ${d.interest}\n\n` +
      `Requirement:\n${d.requirement}\n\n` +
      `Please contact me regarding a consultation.`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    toast.success("Consultation request sent");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Free 1:1 Session
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Book Free Consultation
            </h1>
            <p className="text-muted-foreground text-lg">
              Talk to our mentors about your goals, get a personalised learning roadmap and the right
              course recommendation — completely free.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/20 rounded-2xl p-10 text-center card-shadow"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Thank you for your interest.</h2>
            <p className="text-muted-foreground mb-6">
              We have received your consultation request and will contact you shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Open WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(initial);
                  setSubmitted(false);
                }}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Submit another request
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/10 rounded-2xl p-6 md:p-8 space-y-5 card-shadow"
            noValidate
          >
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                className="mt-1.5 bg-muted/40 border-primary/20"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="+91 98765 43210"
                  maxLength={20}
                  className="mt-1.5 bg-muted/40 border-primary/20"
                />
                {errors.whatsapp && (
                  <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  maxLength={255}
                  className="mt-1.5 bg-muted/40 border-primary/20"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label>Current Role *</Label>
                <Select value={form.role} onValueChange={(v) => set("role", v)}>
                  <SelectTrigger className="mt-1.5 bg-muted/40 border-primary/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/20">
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive mt-1">{errors.role}</p>}
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="e.g., 2 years"
                  maxLength={50}
                  className="mt-1.5 bg-muted/40 border-primary/20"
                />
              </div>
            </div>

            <div>
              <Label>Area of Interest *</Label>
              <Select value={form.interest} onValueChange={(v) => set("interest", v)}>
                <SelectTrigger className="mt-1.5 bg-muted/40 border-primary/20">
                  <SelectValue placeholder="Choose an area" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {INTERESTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.interest && (
                <p className="text-xs text-destructive mt-1">{errors.interest}</p>
              )}
            </div>

            <div>
              <Label htmlFor="requirement">Describe Your Requirement *</Label>
              <Textarea
                id="requirement"
                rows={5}
                value={form.requirement}
                onChange={(e) => set("requirement", e.target.value)}
                placeholder="Share your goals, background and what you'd like guidance on…"
                maxLength={1000}
                className="mt-1.5 bg-muted/40 border-primary/20"
              />
              {errors.requirement && (
                <p className="text-xs text-destructive mt-1">{errors.requirement}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send on WhatsApp
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Submitting will open WhatsApp with your message prefilled and ready to send.
            </p>
          </motion.form>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Consultation;
