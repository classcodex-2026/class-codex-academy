import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const EnquiryForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-enquiry", { body: formData });
      if (error) throw error;
      toast({
        title: "Enquiry Submitted!",
        description: "We'll get back to you within 24 hours. Check your email for confirmation.",
      });
      setFormData({ name: "", email: "", phone: "", course: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us at classcodexx@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-24 relative overflow-hidden" style={{ background: "hsl(var(--surface-soft))" }}>
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="blob bg-primary/20 w-[500px] h-[500px] bottom-0 right-0 animate-blob" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Get in touch
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-4 mb-4 tracking-tight leading-tight">
              Start your <span className="gradient-text">learning journey</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Questions about cohorts, fees or career outcomes? Tell us a bit about yourself and we'll respond within 24 hours.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, title: "Email", info: "classcodexx@gmail.com" },
                { icon: Phone, title: "Call", info: "+91 94421 50416" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-soft">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.info}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-soft flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Locations</h4>
                  <p className="text-muted-foreground text-sm">Online classes available worldwide</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["Coimbatore", "Bangalore", "Chennai", "Kochi"].map((city) => (
                      <span key={city} className="text-xs bg-accent text-accent-foreground border border-border px-2.5 py-0.5 rounded-full font-medium">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 border border-border shadow-elegant"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Enquiry form</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <Input
                  required placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  className="h-11 bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <Input
                    type="email" required placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    maxLength={255}
                    className="h-11 bg-background border-border focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <Input
                    type="tel" required placeholder="+91"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={15}
                    className="h-11 bg-background border-border focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Select Course *</label>
                <Select required value={formData.course} onValueChange={(v) => setFormData({ ...formData, course: v })}>
                  <SelectTrigger className="h-11 bg-background border-border focus:ring-primary">
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {["Python Programming","SQL","Data Warehouse Modelling","Snowflake","AWS Data Engineering","Excel","Power BI","Data Analytics Projects","Data Science","Multiple Courses"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message (optional)</label>
                <Textarea
                  placeholder="Tell us about your goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4} maxLength={1000}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full btn-gradient border-0 rounded-full h-12 font-semibold">
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to be contacted about your enquiry.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
