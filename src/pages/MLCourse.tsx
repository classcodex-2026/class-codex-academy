import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, PlayCircle, FolderKanban, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import EnquiryDialog from "@/components/EnquiryDialog";

const mlSyllabus = [
  {
    title: "Module 1: Introduction to Machine Learning",
    topics: [
      "What is Machine Learning?",
      "Types: Supervised, Unsupervised, Reinforcement",
      "ML Workflow & Lifecycle",
      "Setting Up Environment (Python, Jupyter, Scikit-learn)",
    ],
  },
  {
    title: "Module 2: Data Preprocessing",
    topics: [
      "Data Cleaning & Handling Missing Values",
      "Feature Scaling & Normalization",
      "Encoding Categorical Variables",
      "Train-Test Split & Cross Validation",
    ],
  },
  {
    title: "Module 3: Supervised Learning - Regression",
    topics: [
      "Linear Regression",
      "Polynomial Regression",
      "Ridge & Lasso Regression",
      "Evaluation Metrics (MSE, RMSE, R²)",
    ],
  },
  {
    title: "Module 4: Supervised Learning - Classification",
    topics: [
      "Logistic Regression",
      "Decision Trees & Random Forest",
      "Support Vector Machines",
      "K-Nearest Neighbors",
    ],
  },
  {
    title: "Module 5: Unsupervised Learning",
    topics: [
      "K-Means Clustering",
      "Hierarchical Clustering",
      "Principal Component Analysis (PCA)",
      "Anomaly Detection",
    ],
  },
  {
    title: "Module 6: Model Optimization & Deployment",
    topics: [
      "Hyperparameter Tuning",
      "GridSearchCV & RandomSearchCV",
      "Model Serialization (Pickle, Joblib)",
      "Capstone Project: ML Model Deployment",
    ],
  },
];

const MLCourse = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Machine Learning</h1>
            <p className="text-sm text-muted-foreground">Complete Course Syllabus</p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold">1 Year</p>
              <p className="text-sm opacity-90">Validity</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">50 Hours</p>
              <p className="text-sm opacity-90">Duration</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">6</p>
              <p className="text-sm opacity-90">Modules</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">1</p>
              <p className="text-sm opacity-90">Project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border-2 border-primary/30 p-6 sticky top-24">
              <div className="mb-4">
                <span className="text-lg text-muted-foreground line-through">₹14,999</span>
                <p className="text-3xl font-bold text-foreground">₹5,499</p>
              </div>
              
              <Button className="w-full mb-6 glow-button" size="lg" onClick={() => setDialogOpen(true)}>
                Enroll Now
              </Button>

              <div className="border-t border-primary/10 pt-4">
                <p className="text-primary font-semibold mb-4">This course includes</p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Content Duration
                    </span>
                    <span className="font-medium text-foreground">50 Hours</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Total Modules
                    </span>
                    <span className="font-medium text-foreground">6</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      Capstone Project
                    </span>
                    <span className="font-medium text-foreground">1</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Validity
                    </span>
                    <span className="font-medium text-foreground">1 Year</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>
            
            <div className="space-y-3">
              {mlSyllabus.map((module, index) => (
                <div key={index} className="bg-card rounded-xl border border-primary/10 overflow-hidden">
                  <button
                    onClick={() => toggleModule(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold text-foreground text-left">{module.title}</span>
                    {expandedModules.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedModules.includes(index) && (
                    <div className="px-4 pb-4 border-t border-primary/10 bg-muted/30">
                      <ul className="mt-3 space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EnquiryDialog open={dialogOpen} onOpenChange={setDialogOpen} courseName="Machine Learning" />
    </div>
  );
};

export default MLCourse;
