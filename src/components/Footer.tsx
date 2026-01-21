import { GraduationCap, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-primary/10 py-12 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <GraduationCap className="w-6 h-6 text-primary-foreground relative z-10" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Class<span className="text-primary">Codex</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Empowering students with industry-relevant data skills. 
              Learn from experts and launch your tech career.
            </p>
            <div className="flex items-center gap-2 mt-4 text-primary text-sm">
              <Zap className="w-4 h-4" />
              <span>Batch 2026 Enrolling Now</span>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Courses", id: "courses" },
                { label: "Pricing", id: "pricing" },
                { label: "Contact", id: "enquiry" },
              ].map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Our Courses</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-default">Database & SQL</li>
              <li className="hover:text-primary transition-colors cursor-default">Python Programming</li>
              <li className="hover:text-primary transition-colors cursor-default">Snowflake</li>
              <li className="hover:text-primary transition-colors cursor-default">Power BI</li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-primary/10 pt-8 text-center text-muted-foreground text-sm"
        >
          <p>© {new Date().getFullYear()} ClassCodex. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
