import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EnquiryForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-enquiry", {
        body: formData,
      });

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
        description: "Please try again or contact us directly at classcodexx@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 section-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Section */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Have questions about our courses? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email Us</h4>
                  <p className="text-muted-foreground">classcodexx@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Call Us</h4>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Locations</h4>
                  <p className="text-muted-foreground">Online Classes Available Worldwide</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-accent text-primary px-2 py-1 rounded-full">Coimbatore</span>
                    <span className="text-xs bg-accent text-primary px-2 py-1 rounded-full">Bangalore</span>
                    <span className="text-xs bg-accent text-primary px-2 py-1 rounded-full">Chennai</span>
                    <span className="text-xs bg-accent text-primary px-2 py-1 rounded-full">Kochi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="bg-card rounded-2xl card-shadow p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Student Enquiry Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  maxLength={15}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Course *
                </label>
                <Select
                  required
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Database & SQL">Database & SQL - ₹999</SelectItem>
                    <SelectItem value="Python Programming">Python Programming - ₹1,499</SelectItem>
                    <SelectItem value="Snowflake">Snowflake - ₹2,999</SelectItem>
                    <SelectItem value="Power BI">Power BI - ₹599</SelectItem>
                    <SelectItem value="Multiple Courses">Multiple Courses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message (Optional)
                </label>
                <Textarea
                  placeholder="Tell us about your learning goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  maxLength={1000}
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to be contacted regarding your enquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
