# ProjectHub — Technical System Architecture & Workflow

ProjectHub is a high-performance peer-matching and slot-reservation portal designed for academic and development project collaboration. It is built as a modern, type-safe web application that leverages serverless compute, real-time database transactions, and automated scheduling.

---

## 🛠️ Technology Stack
1. **Frontend Core**: [Next.js](https://nextjs.org) (App Router, Server Actions, React)
2. **Styling & UX**: Vanilla CSS (highly tailored retro-engineering blueprint theme with CSS variables, grid lines, and custom media queries for fluid typography and mobile responsiveness)
3. **Database Layer**: [Supabase](https://supabase.com) (PostgreSQL database instance utilizing connection pooling)
4. **Hosting & Serverless**: [Vercel](https://vercel.com) (Edge router rendering, Serverless Functions, and Vercel Cron jobs)
5. **Email System**: [Resend](https://resend.com) (Transactional Email API for report delivery)

---

## 🗄️ Database Architecture & Schema

The database consists of three core relational tables defined in PostgreSQL:

### 1. `projects` Table
Holds all project listing metadata, expiration details, and creator info.
* `id` (`UUID`, PK, default: `gen_random_uuid()`): Unique identifier of the project.
* `title` (`TEXT`): Project name (sanitized).
* `abstract` (`TEXT`): Short project description (sanitized).
* `caller_name` (`TEXT`): Creator's name (sanitized).
* `caller_dept` (`TEXT`): Lead department code (e.g. `ECE`, `CSE`).
* `caller_email` (`TEXT`): Private email address of the creator.
* `slots_needed` (`INTEGER`): Maximum confirmed students target.
* `review_days` (`INTEGER`): Active duration (1 to 14 days).
* `expires_at` (`TIMESTAMPTZ`): Timestamp indicating when the project ceases activity.
* `keywords` (`TEXT[]`): Postgres array of keywords associated with the call.
* `status` (`TEXT`, default `'pending'`): State flow of the listing: `'pending'`, `'active'`, or `'closed'`.
* `email_sent` (`BOOLEAN`, default `false`): Track if matching email summary has been dispatched.
* `created_at` (`TIMESTAMPTZ`, default `now()`): Creation timestamp.

### 2. `applicants` Table
Tracks student slot reservations and waitlist queues.
* `id` (`BIGINT`, PK, identity): Sequential application ID.
* `project_id` (`UUID`, FK references `projects.id` with `ON DELETE CASCADE`): Associated project call.
* `name` (`TEXT`): Applicant student's name.
* `dept_sem` (`TEXT`): Applicant's department and semester (e.g. "ECE Sem 5").
* `linkedin_url` (`TEXT`): Verified student LinkedIn address.
* `status` (`TEXT`): Slot allocation state: `'confirmed'` or `'waitlist'`.
* `created_at` (`TIMESTAMPTZ`, default `now()`): Booking timestamp.

### 3. `mentors` Table
Stores faculty mentor directory listings.
* `id` (`UUID`, PK, default: `gen_random_uuid()`): Mentor ID.
* `name` (`TEXT`): Mentor's name.
* `college` (`TEXT`): Affiliated institution.
* `dept` (`TEXT`): Department assignment.
* `contact` (`TEXT`): Contact email/address.
* `created_at` (`TIMESTAMPTZ`, default `now()`): Insertion timestamp.

---

## 🔄 End-to-End Data Workflows

![System Workflow](/C:/Users/LENOVO/.gemini/antigravity-ide/brain/79a8a66c-98d0-4080-85be-69a959d8fa7b/projecthub_workflow.png)

### 1. Project Submission & Security Hardening
1. The creator submits the **Post a project call** form.
2. The form data is sent to the server via Next.js **Server Actions** (`createProjectCall`).
3. **Security Check - Sanitization**: The server interceptor calls `escapeHtml()` on the string fields (`title`, `abstract`, `caller_name`), replacing characters (`<`, `>`, `&`, `"`, `'`) with safe HTML entities (`&lt;`, `&gt;`, `&amp;`, `&quot;`, `&#x27;`). This neutralizes Cross-Site Scripting (XSS) injection attempts.
4. **Security Check - Validation**: Runs a strict regex check on `caller_email`.
5. **Database Entry**: Calculates the future `expires_at` datetime value (`NOW() + review_days`) and writes a new project record into Supabase with the status `'pending'`.

### 2. Admin Review & Feed Bump
1. The admin authenticates at `/admin` (credentials are validated securely and kept in client `sessionStorage`).
2. The admin reviews pending items. When clicking **Approve**:
   * It runs `approveProjectCall`.
   * It updates the project's status from `'pending'` to `'active'`.
   * **Feed Bumping**: Bumps the project's `created_at` timestamp to `now()`. Because our feed query sorts by `created_at DESC`, this automatically bumps the approved project to the very top of the live projects feed!

### 3. Slot Reservation & Auto-Waitlisting
1. Live listings are queried: `.eq('status', 'active').gte('expires_at', now)`.
2. A student applies to a project.
3. The server action fetches all current applicants for that project.
4. **Allocation Calculation**:
   * Counts applicants with status `'confirmed'`.
   * If `confirmed count < project.slots_needed`, the applicant's status is assigned as `'confirmed'`.
   * If the confirmed slots are full, the status is assigned as `'waitlist'`.
   * Waitlist slots are restricted to double the target slots (`slots_needed * 2`). Once reached, the database rejects additional applications to prevent spam.
5. The applicant record is saved to Supabase.

### 4. Automated Expiration & Transactional Emailing (Cron Job)
1. **Trigger**: Vercel Cron pings the handler `/api/cron/process-expired-projects` (e.g. hourly).
2. **Security Check - Authorization**: The handler verifies that the header contains `Authorization: Bearer ${process.env.CRON_SECRET}`. If missing or incorrect, it returns a `401 Unauthorized` status immediately.
3. **Query**: The handler queries up to 15 projects where:
   `status = 'active' AND email_sent = false AND expires_at <= NOW()`
4. **Email Generation**:
   * For each expired project, the system queries the associated `applicants` records.
   * Renders a clean HTML blueprint summary containing project meta details and a table of applicants (with clickable LinkedIn links).
5. **Dispatch**: Pings Resend's transactional API (`https://api.resend.com/emails`) carrying the payload.
6. **Finalization**: If Resend returns `200 OK`, the server updates `email_sent = true` in Supabase for that project.

### 5. Faculty Mentors Directory Fallback Sync
1. The app supports a dynamic mentors directory at the bottom of the page.
2. If the user's Supabase instance does not contain the `mentors` table, the code catches the PostgreSQL relational error code (`PGRST116`).
3. **Local Syncing Fallback**: The app falls back to local client state and synchronizes CRUD additions/edits/deletions directly to browser `localStorage` under keys `ph_mentors`. This ensures the directory is operational under any database state.
