import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import supportImg from "@/assets/support-character.jpg";

const WA_NUMBER = "919629997602";

const WhatsAppEnquiry = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    course: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    const text =
      `Hello ClassCodex,\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      (form.course ? `Course: ${form.course}\n` : "") +
      (form.message ? `\nMessage:\n${form.message}\n` : "") +
      `\nPlease share details about fees, batches and enrollment.`;
    const url = `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp…");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 via-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-card">
              <img
                src={supportImg}
                alt="ClassCodex WhatsApp Support"
                width={768}
                height={1024}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                Talk to us on WhatsApp
              </h2>
              <p className="text-muted-foreground mt-2">
                Instant replies from our mentors — fees, batches & roadmap.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Avg. response under 1 hour
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-primary/20 rounded-2xl p-6 md:p-8 space-y-5 shadow-lg"
          >
            <div>
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                WhatsApp Enquiry
              </span>
              <h1 className="text-3xl font-bold text-foreground mt-1">
                Send us a message
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Fill the form and we'll continue the chat on WhatsApp.
              </p>
            </div>

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="mt-1.5"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="mt-1.5"
                maxLength={20}
              />
            </div>

            <div>
              <Label htmlFor="course">Course of Interest</Label>
              <Input
                id="course"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="e.g. Data Engineering, Snowflake"
                className="mt-1.5"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you'd like to know…"
                className="mt-1.5"
                maxLength={1000}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send on WhatsApp
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatsAppEnquiry;
