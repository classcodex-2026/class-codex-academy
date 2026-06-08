import { supabase } from "@/integrations/supabase/client";

export async function sendAdminEmail(args: {
  to: string;
  subject: string;
  html: string;
  template?: string;
  payload?: Record<string, unknown>;
  recipientId?: string;
}) {
  const { data, error } = await supabase.functions.invoke("send-admin-email", {
    body: args,
  });
  if (error) throw error;
  return data;
}

export function brandedEmail(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f5f7fb;font-family:Inter,Arial,sans-serif;color:#111827">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:linear-gradient(135deg,#2563EB,#3B82F6);padding:20px 28px;color:#fff;font-weight:700;font-size:18px">ClassCodex</div>
    <div style="padding:28px">
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827">${title}</h2>
      <div style="font-size:14px;line-height:1.6;color:#374151">${bodyHtml}</div>
    </div>
    <div style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center">
      ClassCodex &middot; Mastering In-Demand Tech Skills
    </div>
  </div>
</body></html>`;
}
