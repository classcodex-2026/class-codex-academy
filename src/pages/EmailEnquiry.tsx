import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import supportImg from "@/assets/support-character.jpg";

const EMAIL = "classcodexx@gmail.com";

const EmailEnquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }
    const subject = form.subject || `Enquiry from ${form.name}`;
    const body =
      `Hello ClassCodex Team,\n\n` +
      `${form.message}\n\n` +
      `Regards,\n${form.name}\n${form.email}`;
    const url = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    toast.success("Opening your email app…");
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
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-card">
              <img
                src={supportImg}
                alt="ClassCodex Email Support"
                width={768}
                height={1024}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                Drop us an email
              </h2>
              <p className="text-muted-foreground mt-2">
                Write to <span className="text-primary">{EMAIL}</span> — we
                reply within 24 hours.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-sm text-primary">
                <CheckCircle2 className="w-4 h-4" /> Detailed responses with
                course brochures
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
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                Email Enquiry
              </span>
              <h1 className="text-3xl font-bold text-foreground mt-1">
                Send us an email
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in your details — we'll open your email app to send.
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
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5"
                maxLength={255}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                className="mt-1.5"
                maxLength={150}
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your message here…"
                className="mt-1.5"
                maxLength={2000}
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EmailEnquiry;
