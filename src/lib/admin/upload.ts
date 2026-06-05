import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to a private bucket and returns a long-lived signed URL.
 * Buckets are private; we use signed URLs (10 years) so they can be embedded on the public site.
 */
export async function uploadFile(
  bucket: "course-banners" | "webinar-banners" | "course-videos" | "site-assets",
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
  if (error || !data) throw error ?? new Error("Failed to sign URL");
  return data.signedUrl;
}
