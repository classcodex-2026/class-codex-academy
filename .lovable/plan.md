
# Admin Dashboard Plan

Build a Supabase-powered Admin Dashboard so you can manage all website content (courses, syllabus, videos, webinars, consultations, settings) without touching Lovable. Public website pages will read live data from Supabase.

## 1. Authentication (Admin Only)

- Use Lovable Cloud auth (email + password). **No public signup** — disable signup UI.
- Create one admin account manually (you'll provide email/password, or I'll seed one and share credentials).
- Roles stored in dedicated `user_roles` table (`admin` enum) with `has_role()` security-definer function.
- Route guard: `/admin/*` redirects to `/admin/login` unless user has `admin` role.

## 2. Database Schema (Supabase)

Tables (all in `public`, RLS enabled, with proper GRANTs):

- **`courses`** — slug, title, category (enum: python, data_engineering, data_analytics, data_science), status (enum: open, coming_soon, closed), description, instructor_name, duration, timing, fee, banner_url, sort_order
- **`course_modules`** — course_id, title, description, sort_order
- **`course_videos`** — module_id, title, description, video_url (YouTube/Vimeo/uploaded), source_type (youtube/vimeo/upload), sort_order
- **`webinars`** — title, description, banner_url, scheduled_date, scheduled_time, status (upcoming/completed), recording_url
- **`consultation_requests`** — name, email, whatsapp, interested_course, requirement, contacted (bool), submitted_at
- **`site_settings`** — single-row key/value (website_name, logo_url, whatsapp_number, contact_email, about_us, social_links jsonb, footer_content)
- **`user_roles`** — user_id, role

**RLS:**
- Public (`anon` + `authenticated`): SELECT on courses, modules, videos, webinars, site_settings
- `anon`: INSERT on consultation_requests (form submissions)
- `admin` only: full write access on everything; read consultation_requests

**Storage buckets:** `course-banners`, `webinar-banners`, `course-videos`, `site-assets` (public read, admin write).

## 3. Admin Dashboard UI

Route: `/admin` with sidebar layout.

Pages:
- **Dashboard** — counts (courses/webinars/requests) + recent activities
- **Courses** — list, add, edit, delete, change status. Course edit page has tabs: Details / Syllabus (modules CRUD + drag-reorder) / Videos (per module)
- **Webinars** — list + CRUD with banner upload, date/time, recording URL
- **Consultation Requests** — table with View / Mark Contacted / Delete
- **Website Settings** — single form for site-wide content
- **Logout**

## 4. Public Website Integration

Refactor existing pages to fetch from Supabase instead of static `src/data/courses.ts`:
- `Courses`, `CoursePage`, `AllCourses`, `CategoryPage` → live courses + modules + videos
- `Webinar` page → live webinars
- `Navbar`, `Footer`, `FloatingChatWidget`, `Contact` → read WhatsApp number, email, social links, logo from `site_settings`
- Consultation form → inserts into `consultation_requests`

Static `courses.ts` will be used to seed the DB once, then the public pages switch to live data.

## 5. Technical Details

- Stack: React Router admin routes, shadcn forms, react-hook-form + zod, TanStack Query for data fetching/caching, Supabase JS client.
- File uploads via Supabase Storage with signed/public URLs.
- Module reordering via drag-and-drop (`@dnd-kit/sortable`).
- All admin mutations invalidate query cache so the public site reflects changes immediately.

## 6. Delivery Order

1. Migration: schema + RLS + GRANTs + seed admin role + seed existing courses
2. Storage buckets
3. Admin auth + route guard + login page
4. Admin layout + Dashboard overview
5. Courses CRUD + Syllabus + Videos
6. Webinars CRUD
7. Consultation Requests viewer
8. Site Settings
9. Refactor public pages to read live data

## Questions before I start

1. **Admin account**: Should I seed an admin user with an email you provide, or do you want to create the account via the login page and I'll grant admin role manually? Please share the admin email either way.
2. **Video uploads**: Direct upload to Supabase Storage can get expensive for large files. Confirm you want upload support, or is YouTube/Vimeo URL enough?
3. **Seed existing courses**: Migrate the current static courses in `src/data/courses.ts` into the DB as the initial data?
