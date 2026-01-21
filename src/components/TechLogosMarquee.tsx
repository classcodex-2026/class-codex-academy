import { motion } from "framer-motion";

const techLogos = [
  { name: "Python", icon: "🐍", color: "from-yellow-400 to-blue-500" },
  { name: "SQL", icon: "🗄️", color: "from-orange-400 to-red-500" },
  { name: "Snowflake", icon: "❄️", color: "from-cyan-400 to-blue-400" },
  { name: "Power BI", icon: "📊", color: "from-yellow-400 to-yellow-600" },
  { name: "AWS", icon: "☁️", color: "from-orange-400 to-orange-600" },
  { name: "PostgreSQL", icon: "🐘", color: "from-blue-400 to-blue-600" },
  { name: "Pandas", icon: "🐼", color: "from-purple-400 to-pink-500" },
  { name: "NumPy", icon: "🔢", color: "from-cyan-400 to-cyan-600" },
  { name: "Docker", icon: "🐳", color: "from-blue-400 to-cyan-400" },
  { name: "Git", icon: "📁", color: "from-orange-500 to-red-500" },
  { name: "Apache Spark", icon: "⚡", color: "from-orange-400 to-yellow-400" },
  { name: "Tableau", icon: "📈", color: "from-blue-500 to-orange-400" },
];

const TechLogosMarquee = () => {
  return (
    <div className="relative overflow-hidden py-8 bg-black/50">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...techLogos, ...techLogos, ...techLogos].map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border border-primary/20 backdrop-blur-sm"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 30px hsl(180 100% 50% / 0.3)",
              borderColor: "hsl(180 100% 50% / 0.5)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl">{tech.icon}</span>
            <span className="text-foreground font-medium tracking-wide">{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechLogosMarquee;
