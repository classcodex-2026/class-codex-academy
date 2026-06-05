import { motion } from "framer-motion";

const techLogos = [
  { name: "Python", icon: "🐍" },
  { name: "SQL", icon: "🗄️" },
  { name: "Snowflake", icon: "❄️" },
  { name: "Power BI", icon: "📊" },
  { name: "AWS", icon: "☁️" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Pandas", icon: "🐼" },
  { name: "NumPy", icon: "🔢" },
  { name: "Docker", icon: "🐳" },
  { name: "Git", icon: "📁" },
  { name: "Apache Spark", icon: "⚡" },
  { name: "Tableau", icon: "📈" },
];

const TechLogosMarquee = () => {
  return (
    <div className="relative overflow-hidden py-6">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5 font-semibold">
        Tools & technologies you'll master
      </p>

      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: [0, -1920] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" } }}
      >
        {[...techLogos, ...techLogos, ...techLogos].map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-border shadow-card hover:shadow-soft hover:border-primary/30 transition-all"
          >
            <span className="text-xl">{tech.icon}</span>
            <span className="text-foreground/80 font-medium text-sm">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechLogosMarquee;
