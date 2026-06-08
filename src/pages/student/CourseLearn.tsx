import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, PlayCircle, FileText, StickyNote, ExternalLink, ClipboardList, Lock } from "lucide-react";

const typeIcon: Record<string, any> = {
  video: PlayCircle, pdf: FileText, notes: StickyNote, link: ExternalLink, assignment: ClipboardList,
};

const CourseLearn = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Record<string, any[]>>({});
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !courseId) return;
    (async () => {
      const [{ data: c }, { data: enrol }, { data: mods }] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).maybeSingle(),
        supabase.from("enrollments").select("payment_status").eq("student_id", user.id).eq("course_id", courseId).maybeSingle(),
        supabase.from("course_modules").select("*").eq("course_id", courseId).order("sort_order"),
      ]);
      setCourse(c);
      setEnrolled(enrol?.payment_status === "completed");
      setModules(mods ?? []);
      if (mods?.length) {
        const { data: ls } = await supabase.from("course_lessons")
          .select("*").in("module_id", mods.map((m) => m.id)).order("sort_order");
        const grouped: Record<string, any[]> = {};
        (ls ?? []).forEach((l) => { (grouped[l.module_id] ||= []).push(l); });
        setLessons(grouped);
      }
      setLoading(false);
    })();
  }, [user, courseId]);

  if (loading) {
    return <StudentLayout><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></StudentLayout>;
  }
  if (!course) return <StudentLayout><p>Course not found.</p></StudentLayout>;

  if (!enrolled) {
    return (
      <StudentLayout>
        <Card><CardContent className="py-12 text-center space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Enroll to access this course</h2>
          <p className="text-muted-foreground">Purchase to unlock all modules and lessons.</p>
          <Button asChild><Link to={`/checkout/${course.id}`}>Enroll Now</Link></Button>
        </CardContent></Card>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.tagline}</p>
        </div>

        {modules.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No modules published yet.</CardContent></Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {modules.map((m, i) => (
              <AccordionItem key={m.id} value={m.id} className="bg-white border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left">
                    <span className="text-xs text-primary font-semibold">Module {i + 1}</span>
                    <div className="font-semibold">{m.title}</div>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {(lessons[m.id] ?? []).map((l) => {
                      const Icon = typeIcon[l.lesson_type] ?? FileText;
                      return (
                        <li key={l.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50">
                          <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{l.title}</div>
                            {l.description && <p className="text-sm text-muted-foreground">{l.description}</p>}
                            {l.lesson_type === "notes" && l.content_text && (
                              <div className="prose prose-sm max-w-none mt-2 whitespace-pre-wrap">{l.content_text}</div>
                            )}
                            {l.lesson_type === "video" && l.content_url && (
                              <div className="aspect-video mt-2 rounded overflow-hidden border">
                                <iframe src={toEmbed(l.content_url)} className="w-full h-full" allowFullScreen />
                              </div>
                            )}
                            {(l.lesson_type === "pdf" || l.lesson_type === "assignment") && l.file_path && (
                              <DownloadBtn bucket={l.lesson_type === "pdf" ? "course-pdfs" : "course-resources"} path={l.file_path} />
                            )}
                            {l.lesson_type === "link" && l.content_url && (
                              <a href={l.content_url} target="_blank" rel="noopener noreferrer"
                                className="text-primary text-sm hover:underline inline-flex items-center gap-1 mt-1">
                                Open link <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                    {!(lessons[m.id]?.length) && <p className="text-sm text-muted-foreground">No lessons yet.</p>}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </StudentLayout>
  );
};

const toEmbed = (url: string) => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
};

const DownloadBtn = ({ bucket, path }: { bucket: string; path: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from(bucket).createSignedUrl(path, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [bucket, path]);
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="text-primary text-sm hover:underline inline-flex items-center gap-1 mt-1">
      Download / View <ExternalLink className="w-3 h-3" />
    </a>
  ) : <span className="text-xs text-muted-foreground">Loading...</span>;
};

export default CourseLearn;
