import { Link } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => (
  <StudentLayout>
    <div className="max-w-xl mx-auto pt-10">
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">Your enrollment is confirmed. You can now access the course content.</p>
          <Button asChild size="lg"><Link to="/dashboard/my-courses">Go to My Courses</Link></Button>
        </CardContent>
      </Card>
    </div>
  </StudentLayout>
);

export default PaymentSuccess;
