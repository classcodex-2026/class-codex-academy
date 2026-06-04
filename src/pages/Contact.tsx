import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, Clock } from "lucide-react";

const WA_NUMBER = "919442150416";
const EMAIL = "info@classcodex.com";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello, I'd like to get in touch.\n\nName: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.whatsapp}\n\nMessage:\n${form.message}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2 mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about courses, batches or enrollment? We're one message away.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-card border border-primary/20 rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+91 9XXXXXXXXX"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                className="mt-2"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Send via WhatsApp
            </Button>
          </form>

          {/* Info */}
          <aside className="space-y-4">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card border border-primary/20 hover:border-primary/40 rounded-2xl p-6 transition-colors"
            >
              <MessageCircle className="w-7 h-7 text-emerald-400 mb-3" />
              <p className="font-semibold text-foreground">WhatsApp</p>
              <p className="text-sm text-muted-foreground mt-1">+91 94421 50416</p>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="block bg-card border border-primary/20 hover:border-primary/40 rounded-2xl p-6 transition-colors"
            >
              <Mail className="w-7 h-7 text-primary mb-3" />
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground mt-1">{EMAIL}</p>
            </a>
            <div className="bg-card border border-primary/20 rounded-2xl p-6">
              <Clock className="w-7 h-7 text-primary mb-3" />
              <p className="font-semibold text-foreground">Business Hours</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mon – Sat, 9:00 AM – 8:00 PM IST
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
