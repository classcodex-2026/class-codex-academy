import { Link } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailure = () => (
  <StudentLayout>
    <div className="max-w-xl mx-auto pt-10">
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">Your payment couldn't be completed. No amount has been charged.</p>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline"><Link to="/dashboard/browse">Back to Courses</Link></Button>
            <Button asChild><Link to="/dashboard/my-courses">My Courses</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </StudentLayout>
);

export default PaymentFailure;
