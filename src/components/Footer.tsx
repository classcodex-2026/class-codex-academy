import { GraduationCap, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-card border-t border-border py-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="blob bg-primary/10 w-[400px] h-[400px] -top-32 -right-20 animate-blob" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Class<span className="gradient-text">Codex</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Premium, project-driven cohorts for SQL, Python, Snowflake, Power BI and Data Science. Launch the career you deserve.
            </p>
            <div className="flex flex-col gap-2 mt-5 text-sm">
              <a href="mailto:classcodexx@gmail.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> classcodexx@gmail.com
              </a>
              <a href="tel:+919442150416" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +91 94421 50416
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Courses", id: "courses" },
                { label: "Pricing", id: "pricing" },
                { label: "Contact", id: "enquiry" },
              ].map((link) => (
                <li key={link.id}>
                  <button onClick={() => scrollToSection(link.id)} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-bold mb-4 text-foreground">Our Courses</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Database & SQL</li>
              <li>Python Programming</li>
              <li>Snowflake</li>
              <li>Power BI</li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-border pt-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} ClassCodex. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
