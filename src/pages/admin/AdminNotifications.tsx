import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { sendAdminEmail, brandedEmail } from "@/lib/admin/notify";

type Log = { id: string; recipient_email: string; template: string; subject: string | null; status: string; error: string | null; sent_at: string };
type Profile = { id: string; full_name: string; email: string };

const templates = {
  payment_reminder: {
    label: "Payment Reminder",
    subject: "Payment reminder from ClassCodex",
    body: "Hi {name},\n\nThis is a gentle reminder that your course fee payment is pending. Please complete it at your earliest convenience.\n\nThanks,\nClassCodex",
  },
  enrollment_confirmation: {
    label: "Enrollment Confirmation",
    subject: "You're enrolled at ClassCodex",
    body: "Hi {name},\n\nYour enrollment has been confirmed. Log in to your dashboard to start learning.\n\nWelcome aboard!\nClassCodex",
  },
  course_completion: {
    label: "Course Completion",
    subject: "Congratulations on completing your course",
    body: "Hi {name},\n\nCongratulations on completing your course at ClassCodex! Your certificate will be issued shortly.\n\nKeep learning!\nClassCodex",
  },
  custom: {
    label: "Custom Message",
    subject: "",
    body: "",
  },
};

export default function AdminNotifications() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tplKey, setTplKey] = useState<keyof typeof templates>("payment_reminder");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState(templates.payment_reminder.subject);
  const [body, setBody] = useState(templates.payment_reminder.body);
  const [busy, setBusy] = useState(false);

  const load = () => supabase.from("notifications_log").select("*").order("sent_at", { ascending: false }).limit(200).then(({ data }) => setLogs((data ?? []) as Log[]));

  useEffect(() => {
    load();
    supabase.from("profiles").select("id, full_name, email").order("full_name").then(({ data }) => setProfiles((data ?? []) as Profile[]));
  }, []);

  const pickTemplate = (k: keyof typeof templates) => {
    setTplKey(k);
    setSubject(templates[k].subject);
    setBody(templates[k].body);
  };

  const toggleRecipient = (id: string) => {
    setRecipients(recipients.includes(id) ? recipients.filter((r) => r !== id) : [...recipients, id]);
  };

  const send = async () => {
    if (!recipients.length || !subject || !body) return toast({ title: "Pick recipients and fill subject/body", variant: "destructive" });
    setBusy(true);
    let ok = 0, fail = 0;
    for (const rid of recipients) {
      const p = profiles.find((x) => x.id === rid);
      if (!p) { fail++; continue; }
      const html = brandedEmail(subject, body.replace(/{name}/g, p.full_name || "there").split("\n").map((l) => `<p>${l}</p>`).join(""));
      try {
        await sendAdminEmail({ to: p.email, subject, html, template: tplKey, recipientId: p.id });
        ok++;
      } catch {
        fail++;
      }
    }
    setBusy(false);
    toast({ title: "Done", description: `${ok} sent, ${fail} failed` });
    setRecipients([]);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 lg:col-span-2">
          <h2 className="font-semibold mb-3">Send notification</h2>
          <div className="space-y-3">
            <div>
              <Label>Template</Label>
              <Select value={tplKey} onValueChange={(v) => pickTemplate(v as keyof typeof templates)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(templates).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            <div><Label>Body (use {"{name}"} for the student's name)</Label><Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} /></div>
            <Button onClick={send} disabled={busy || !recipients.length}><Send className="h-4 w-4 mr-1" /> Send to {recipients.length} recipient(s)</Button>
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Recipients</h2>
          <div className="max-h-96 overflow-y-auto space-y-1 text-sm">
            {profiles.map((p) => (
              <label key={p.id} className="flex items-center gap-2 p-1 hover:bg-muted/40 rounded cursor-pointer">
                <input type="checkbox" checked={recipients.includes(p.id)} onChange={() => toggleRecipient(p.id)} />
                <span className="truncate"><span className="font-medium">{p.full_name || p.email}</span> <span className="text-xs text-muted-foreground">{p.email}</span></span>
              </label>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setRecipients(profiles.map((p) => p.id))}>All</Button>
            <Button size="sm" variant="outline" onClick={() => setRecipients([])}>Clear</Button>
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Sent</th>
              <th className="text-left p-3">To</th>
              <th className="text-left p-3">Template</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="p-3 text-xs text-muted-foreground">{new Date(l.sent_at).toLocaleString()}</td>
                <td className="p-3">{l.recipient_email}</td>
                <td className="p-3 text-xs">{l.template}</td>
                <td className="p-3">{l.subject ?? "—"}</td>
                <td className="p-3"><Badge variant={l.status === "sent" ? "default" : "destructive"}>{l.status}</Badge></td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No notifications yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
