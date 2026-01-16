import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EnquiryRequest {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, course, message }: EnquiryRequest = await req.json();

    console.log("Received enquiry from:", name, email);

    // Send notification email to ClassCodex
    const notificationResponse = await resend.emails.send({
      from: "ClassCodex <onboarding@resend.dev>",
      to: ["classcodexx@gmail.com"],
      subject: `New Course Enquiry: ${course} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">New Student Enquiry</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Course Interested:</strong> ${course}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px;">${message || "No message provided"}</p>
          </div>
          <p style="color: #64748b; font-size: 12px;">This enquiry was submitted via the ClassCodex website.</p>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationResponse);

    // Send confirmation email to the student
    const confirmationResponse = await resend.emails.send({
      from: "ClassCodex <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your enquiry - ClassCodex",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Thank You, ${name}!</h2>
          <p>We have received your enquiry about our <strong>${course}</strong> course.</p>
          <p>Our team will get back to you within 24 hours.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Enquiry Details:</h3>
            <p><strong>Course:</strong> ${course}</p>
            <p><strong>Message:</strong> ${message || "No message provided"}</p>
          </div>
          <p>If you have any urgent questions, feel free to reply to this email.</p>
          <p>Best regards,<br><strong>ClassCodex Team</strong></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 12px;">Online Classes Available Worldwide | Coimbatore | Bangalore | Chennai | Kochi</p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-enquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
