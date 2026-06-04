import {
  Code,
  Database,
  Snowflake,
  Layers,
  FolderKanban,
  FileSpreadsheet,
  BarChart3,
  Brain,
  Sigma,
  ShieldCheck,
  Bug,
  Network,
  BookOpen,
} from "lucide-react";

export const getCourseIcon = (name: string, className = "w-8 h-8 text-primary") => {
  const map: Record<string, JSX.Element> = {
    Code: <Code className={className} />,
    Database: <Database className={className} />,
    Snowflake: <Snowflake className={className} />,
    Layers: <Layers className={className} />,
    FolderKanban: <FolderKanban className={className} />,
    FileSpreadsheet: <FileSpreadsheet className={className} />,
    BarChart3: <BarChart3 className={className} />,
    Brain: <Brain className={className} />,
    Sigma: <Sigma className={className} />,
    ShieldCheck: <ShieldCheck className={className} />,
    Bug: <Bug className={className} />,
    Network: <Network className={className} />,
  };
  return map[name] ?? <BookOpen className={className} />;
};
