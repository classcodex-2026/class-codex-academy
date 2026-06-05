import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageCircle, Send } from "lucide-react";

const WA_NUMBER = "919629997602";

const FloatingChatWidget = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[100] w-[320px] rounded-2xl overflow-hidden border border-primary/30 bg-card shadow-2xl shadow-primary/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-5 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                Welcome <span>🙏</span>
              </h3>
              <p className="text-sm text-foreground/80 mt-1">
                Welcome to ClassCodex!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Our team will respond within an hour.
              </p>
            </div>

            {/* Options */}
            <div className="p-3 space-y-2 bg-card">
              <Link
                to="/whatsapp-enquiry"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="text-sm font-semibold text-foreground">
                    Enquiry on WhatsApp
                  </p>
                </div>
              </Link>

              <Link
                to="/email-enquiry"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
              >
                <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-foreground">
                    Enquiry on Email
                  </p>
                </div>
              </Link>
            </div>

            <div className="px-4 py-3 border-t border-border/50 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Send className="w-3 h-3" /> Send a message to us
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white"
        aria-label="Chat with us"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 animate-ping" />
        )}
      </motion.button>
    </>
  );
};

export default FloatingChatWidget;
