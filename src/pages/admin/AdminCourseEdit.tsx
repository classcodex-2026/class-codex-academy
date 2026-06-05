import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/admin/upload";
import { ArrowLeft, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  category: "python_programming" | "data_engineering" | "data_analytics" | "data_science";
  status: "open" | "coming_soon" | "closed";
  tagline: string | null;
  description: string | null;
  overview: string | null;
  instructor_name: string | null;
  duration: string | null;
  timing: string | null;
  fee: number | null;
  original_fee: number | null;
  banner_url: string | null;
  certification: string | null;
  outcomes: string[];
  prerequisites: string[];
  projects: string[];
};

type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  topics: string[];
  sort_order: number;
};

type Video = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string;
  source_type: "youtube" | "vimeo" | "upload";
  sort_order: number;
};

const empty: Course = {
  id: "", slug: "", title: "", category: "python_programming", status: "open",
  tagline: "", description: "", overview: "", instructor_name: "", duration: "",
  timing: "", fee: null, original_fee: null, banner_url: "", certification: "",
  outcomes: [], prerequisites: [], projects: [],
};

export default function AdminCourseEdit() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [c, setC] = useState<Course>(empty);
  const [modules, setModules] = useState<Module[]>([]);
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("courses").select("*").eq("id", id!).maybeSingle();
      if (data) setC({ ...data, outcomes: data.outcomes ?? [], prerequisites: data.prerequisites ?? [], projects: data.projects ?? [] } as Course);
      const { data: mods } = await supabase
        .from("course_modules").select("*").eq("course_id", id!).order("sort_order");
      const moduleList = (mods ?? []).map((m) => ({ ...m, topics: m.topics ?? [] })) as Module[];
      setModules(moduleList);
      if (moduleList.length) {
        const { data: vids } = await supabase
          .from("course_videos").select("*").in("module_id", moduleList.map((m) => m.id))
          .order("sort_order");
        const grouped: Record<string, Video[]> = {};
        (vids ?? []).forEach((v) => {
          (grouped[v.module_id] ??= []).push(v as Video);
        });
        setVideos(grouped);
      }
    })();
  }, [id, isNew]);

  const save = async () => {
    setBusy(true);
    try {
      const payload = {
        slug: c.slug, title: c.title, category: c.category, status: c.status,
        tagline: c.tagline, description: c.description, overview: c.overview,
        instructor_name: c.instructor_name, duration: c.duration, timing: c.timing,
        fee: c.fee, original_fee: c.original_fee, banner_url: c.banner_url,
        certification: c.certification, outcomes: c.outcomes,
        prerequisites: c.prerequisites, projects: c.projects,
      };
      if (isNew) {
        const { data, error } = await supabase.from("courses").insert(payload).select("id").single();
        if (error) throw error;
        toast({ title: "Course created" });
        navigate(`/admin/courses/${data.id}`, { replace: true });
      } else {
        const { error } = await supabase.from("courses").update(payload).eq("id", c.id);
        if (error) throw error;
        toast({ title: "Course saved" });
      }
    } catch (e) {
      toast({ title: "Save failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const onBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadFile("course-banners", f);
      setC({ ...c, banner_url: url });
      toast({ title: "Banner uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // --- Modules CRUD ---
  const addModule = async () => {
    if (isNew) return toast({ title: "Save course first" });
    const { data, error } = await supabase
      .from("course_modules")
      .insert({ course_id: c.id, title: "New Module", topics: [], sort_order: modules.length + 1 })
      .select().single();
    if (error) return toast({ title: error.message, variant: "destructive" });
    setModules([...modules, { ...data, topics: data.topics ?? [] } as Module]);
  };
  const saveModule = async (m: Module) => {
    const { error } = await supabase
      .from("course_modules")
      .update({ title: m.title, description: m.description, topics: m.topics, sort_order: m.sort_order })
      .eq("id", m.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Module saved" });
  };
  const deleteModule = async (mid: string) => {
    if (!confirm("Delete this module?")) return;
    await supabase.from("course_modules").delete().eq("id", mid);
    setModules(modules.filter((m) => m.id !== mid));
  };
  const moveModule = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= modules.length) return;
    const a = { ...modules[idx], sort_order: modules[j].sort_order };
    const b = { ...modules[j], sort_order: modules[idx].sort_order };
    const next = [...modules];
    next[idx] = b;
    next[j] = a;
    next.sort((x, y) => x.sort_order - y.sort_order);
    setModules(next);
    await Promise.all([
      supabase.from("course_modules").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("course_modules").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  };

  // --- Videos CRUD ---
  const addVideo = async (mid: string) => {
    const count = (videos[mid] ?? []).length;
    const { data, error } = await supabase
      .from("course_videos")
      .insert({ module_id: mid, title: "New Video", video_url: "", source_type: "youtube", sort_order: count + 1 })
      .select().single();
    if (error) return toast({ title: error.message, variant: "destructive" });
    setVideos({ ...videos, [mid]: [...(videos[mid] ?? []), data as Video] });
  };
  const saveVideo = async (v: Video) => {
    const { error } = await supabase
      .from("course_videos")
      .update({ title: v.title, description: v.description, video_url: v.video_url, source_type: v.source_type })
      .eq("id", v.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Video saved" });
  };
  const deleteVideo = async (v: Video) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("course_videos").delete().eq("id", v.id);
    setVideos({ ...videos, [v.module_id]: videos[v.module_id].filter((x) => x.id !== v.id) });
  };
  const uploadVideo = async (v: Video, file: File) => {
    try {
      const url = await uploadFile("course-videos", file);
      const next = { ...v, video_url: url, source_type: "upload" as const };
      setVideos({ ...videos, [v.module_id]: videos[v.module_id].map((x) => x.id === v.id ? next : x) });
      await saveVideo(next);
    } catch (e) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <Button variant="ghost" onClick={() => navigate("/admin/courses")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">{isNew ? "New Course" : c.title || "Edit Course"}</h1>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="syllabus" disabled={isNew}>Syllabus</TabsTrigger>
          <TabsTrigger value="videos" disabled={isNew}>Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title"><Input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} /></Field>
                <Field label="Slug (URL)"><Input value={c.slug} onChange={(e) => setC({ ...c, slug: e.target.value })} placeholder="e.g. python" /></Field>
                <Field label="Category">
                  <Select value={c.category} onValueChange={(v) => setC({ ...c, category: v as Course["category"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python_programming">Python Programming</SelectItem>
                      <SelectItem value="data_engineering">Data Engineering</SelectItem>
                      <SelectItem value="data_analytics">Data Analytics</SelectItem>
                      <SelectItem value="data_science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={c.status} onValueChange={(v) => setC({ ...c, status: v as Course["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open for Enrollment</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Duration"><Input value={c.duration ?? ""} onChange={(e) => setC({ ...c, duration: e.target.value })} placeholder="e.g. 8 Weeks" /></Field>
                <Field label="Timing"><Input value={c.timing ?? ""} onChange={(e) => setC({ ...c, timing: e.target.value })} placeholder="e.g. Mon-Fri 7-9pm" /></Field>
                <Field label="Instructor"><Input value={c.instructor_name ?? ""} onChange={(e) => setC({ ...c, instructor_name: e.target.value })} /></Field>
                <Field label="Tagline"><Input value={c.tagline ?? ""} onChange={(e) => setC({ ...c, tagline: e.target.value })} /></Field>
                <Field label="Fee (₹)"><Input type="number" value={c.fee ?? ""} onChange={(e) => setC({ ...c, fee: e.target.value ? Number(e.target.value) : null })} /></Field>
                <Field label="Original Fee (₹)"><Input type="number" value={c.original_fee ?? ""} onChange={(e) => setC({ ...c, original_fee: e.target.value ? Number(e.target.value) : null })} /></Field>
              </div>
              <Field label="Short Description"><Textarea rows={2} value={c.description ?? ""} onChange={(e) => setC({ ...c, description: e.target.value })} /></Field>
              <Field label="Overview"><Textarea rows={4} value={c.overview ?? ""} onChange={(e) => setC({ ...c, overview: e.target.value })} /></Field>
              <Field label="Certification"><Textarea rows={2} value={c.certification ?? ""} onChange={(e) => setC({ ...c, certification: e.target.value })} /></Field>

              <ListField label="Learning Outcomes" value={c.outcomes} onChange={(v) => setC({ ...c, outcomes: v })} />
              <ListField label="Prerequisites" value={c.prerequisites} onChange={(v) => setC({ ...c, prerequisites: v })} />
              <ListField label="Projects" value={c.projects} onChange={(v) => setC({ ...c, projects: v })} />

              <Field label="Banner Image">
                {c.banner_url && <img src={c.banner_url} alt="" className="h-24 rounded mb-2" />}
                <Input type="file" accept="image/*" onChange={onBanner} disabled={uploading} />
              </Field>

              <Button onClick={save} disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isNew ? "Create Course" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus">
          <div className="flex justify-end mb-3">
            <Button onClick={addModule}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
          </div>
          <div className="space-y-3">
            {modules.map((m, idx) => (
              <Card key={m.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Module {idx + 1}</CardTitle>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => moveModule(idx, -1)}><ChevronUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => moveModule(idx, 1)}><ChevronDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteModule(m.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input value={m.title} onChange={(e) => setModules(modules.map((x) => x.id === m.id ? { ...x, title: e.target.value } : x))} />
                  <Textarea placeholder="Description (optional)" rows={2} value={m.description ?? ""} onChange={(e) => setModules(modules.map((x) => x.id === m.id ? { ...x, description: e.target.value } : x))} />
                  <ListField label="Topics" value={m.topics} onChange={(v) => setModules(modules.map((x) => x.id === m.id ? { ...x, topics: v } : x))} />
                  <Button size="sm" onClick={() => saveModule(m)}>Save Module</Button>
                </CardContent>
              </Card>
            ))}
            {modules.length === 0 && <p className="text-muted-foreground text-sm">No modules yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="space-y-4">
            {modules.map((m) => (
              <Card key={m.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <Button size="sm" onClick={() => addVideo(m.id)}><Plus className="h-4 w-4 mr-1" /> Add Video</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(videos[m.id] ?? []).map((v) => (
                    <div key={v.id} className="border border-border rounded p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Video title" value={v.title} onChange={(e) => setVideos({ ...videos, [m.id]: videos[m.id].map((x) => x.id === v.id ? { ...x, title: e.target.value } : x) })} />
                        <Select value={v.source_type} onValueChange={(val) => setVideos({ ...videos, [m.id]: videos[m.id].map((x) => x.id === v.id ? { ...x, source_type: val as Video["source_type"] } : x) })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youtube">YouTube URL</SelectItem>
                            <SelectItem value="vimeo">Vimeo URL</SelectItem>
                            <SelectItem value="upload">Uploaded File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input placeholder="Video URL" value={v.video_url} onChange={(e) => setVideos({ ...videos, [m.id]: videos[m.id].map((x) => x.id === v.id ? { ...x, video_url: e.target.value } : x) })} />
                      <Textarea placeholder="Description" rows={2} value={v.description ?? ""} onChange={(e) => setVideos({ ...videos, [m.id]: videos[m.id].map((x) => x.id === v.id ? { ...x, description: e.target.value } : x) })} />
                      <div className="flex items-center gap-2">
                        <Input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && uploadVideo(v, e.target.files[0])} className="max-w-xs" />
                        <Button size="sm" onClick={() => saveVideo(v)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteVideo(v)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        rows={Math.max(3, value.length)}
        placeholder="One item per line"
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );
}
