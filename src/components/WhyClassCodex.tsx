import { GraduationCap, MessageCircleQuestion, Briefcase, FileCheck, Users, Layers } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const FeatureCard = ({ icon, title, description, bgColor }: FeatureCardProps) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 h-full transition-transform hover:scale-[1.02] hover:shadow-lg`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3 font-poppins">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed text-justify">
        {description}
      </p>
    </div>
  );
};

const WhyClassCodex = () => {
  const features = [
    {
      icon: <GraduationCap className="w-12 h-12 text-amber-500" />,
      title: "Beginner Friendly & Affordable",
      description: "Join a passionate community and master data skills without breaking the bank!",
      bgColor: "bg-purple-50",
    },
    {
      icon: <MessageCircleQuestion className="w-12 h-12 text-orange-500" />,
      title: "Online/Offline Doubt Solving",
      description: "Instantly conquer doubts in live classes and discord – your fast track to success!",
      bgColor: "bg-green-50",
    },
    {
      icon: <Layers className="w-12 h-12 text-blue-500" />,
      title: "Industry Level Projects",
      description: "Master real-world skills with our industry-level projects – your gateway to career success!",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Briefcase className="w-12 h-12 text-pink-500" />,
      title: "Placement Assistance",
      description: "Ace your career with resume enhancement, interview mastery, and LinkedIn optimization!",
      bgColor: "bg-pink-50",
    },
    {
      icon: <FileCheck className="w-12 h-12 text-teal-500" />,
      title: "Interview Preparation",
      description: "Boost your mastery with captivating quizzes and assignments after each module!",
      bgColor: "bg-amber-50",
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-500" />,
      title: "Community Learning",
      description: "Unite with a vibrant, passionate community of like-minded learners – grow together!",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Left Title Section */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins leading-tight mb-6">
              Why<br />ClassCodex?
            </h2>
            <button 
              onClick={() => {
                const element = document.getElementById('enquiry-form');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              More About Us
            </button>
          </div>

          {/* Feature Cards Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                bgColor={feature.bgColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyClassCodex;
