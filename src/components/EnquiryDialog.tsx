import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  isNotify?: boolean;
}

const EnquiryDialog = ({ open, onOpenChange, courseName, isNotify = false }: EnquiryDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: courseName,
    message: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, course: courseName }));
  }, [courseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-enquiry", {
        body: {
          ...formData,
          message: isNotify 
            ? `[Notify Me Request] ${formData.message || 'Please notify me when this course is available.'}` 
            : formData.message,
        },
      });

      if (error) throw error;

      toast({
        title: isNotify ? "Notification Request Submitted!" : "Enquiry Submitted!",
        description: "We'll get back to you within 24 hours. Check your email for confirmation.",
      });

      setFormData({ name: "", email: "", phone: "", course: courseName, message: "" });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isNotify ? `Get Notified - ${courseName}` : `Enroll in ${courseName}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              Course
            </label>
            <Input
              value={formData.course}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message (Optional)
            </label>
            <Textarea
              placeholder={isNotify ? "Any specific questions about this course?" : "Tell us about your learning goals..."}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              maxLength={1000}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            <Send className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : isNotify ? "Notify Me" : "Submit Enquiry"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to be contacted regarding your enquiry.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryDialog;
