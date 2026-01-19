import { Button } from "@/components/ui/button";
import { 
  HandCoins, 
  MessageCircleQuestion, 
  FolderKanban, 
  Briefcase, 
  FileCheck, 
  Users, 
  Layers 
} from "lucide-react";

const features = [
  {
    icon: HandCoins,
    title: "Beginner Friendly & Affordable",
    description: "Join a passionate community and master data skills without breaking the bank!",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    iconBg: "bg-gradient-to-br from-orange-200 to-orange-300",
    iconColor: "text-orange-600"
  },
  {
    icon: MessageCircleQuestion,
    title: "Online/Offline Doubt Solving",
    description: "Instantly conquer doubts in live classes and discord – your fast track to success!",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-100",
    iconBg: "bg-gradient-to-br from-yellow-200 to-amber-300",
    iconColor: "text-amber-600"
  },
  {
    icon: FolderKanban,
    title: "Industry Level Projects",
    description: "Master real-world skills with our industry-level projects – your gateway to career success!",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    iconBg: "bg-gradient-to-br from-blue-200 to-blue-300",
    iconColor: "text-blue-600"
  },
  {
    icon: Briefcase,
    title: "Placement Assistance",
    description: "Ace your career with resume enhancement, interview mastery, and LinkedIn optimization!",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    iconBg: "bg-gradient-to-br from-purple-200 to-purple-300",
    iconColor: "text-purple-600"
  },
  {
    icon: FileCheck,
    title: "Interview Preparation",
    description: "Boost your mastery with captivating quizzes and assignments after each module!",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    iconBg: "bg-gradient-to-br from-green-200 to-green-300",
    iconColor: "text-green-600"
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Unite with a vibrant, passionate community of like-minded learners for collaborative growth!",
    bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
    iconBg: "bg-gradient-to-br from-pink-200 to-pink-300",
    iconColor: "text-pink-600"
  },
  {
    icon: Layers,
    title: "Modern Tech Stack",
    description: "We focus on teaching modern, in-demand tech stacks through practical learning!",
    bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    iconBg: "bg-gradient-to-br from-cyan-200 to-cyan-300",
    iconColor: "text-cyan-600"
  }
];

const WhyClassCodex = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Title */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Why<br />ClassCodex?
            </h2>
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={() => {
                const element = document.getElementById("enquiry");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              More About Us
            </Button>
          </div>

          {/* Right Columns - Feature Cards */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.slice(0, 3).map((feature, index) => (
                <div 
                  key={index}
                  className={`${feature.bgColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* Second Row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {features.slice(3).map((feature, index) => (
                <div 
                  key={index + 3}
                  className={`${feature.bgColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyClassCodex;
