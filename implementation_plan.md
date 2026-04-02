# Blink Resume Parser — Implementation Plan

A Next.js application that parses PDF resumes, extracts social links, enriches data via GitHub API, and generates AI-powered insights via Gemini — presented in a stunning dark-themed dashboard.

## User Review Required

> [!IMPORTANT]
> **API Keys Needed**: You'll need to provide:
> 1. A **Gemini API key** (free tier from [Google AI Studio](https://aistudio.google.com/apikey))
> 2. A **GitHub Personal Access Token** (optional but recommended to avoid rate limits)
>
> These go in `.env.local` — I'll create the template.

> [!NOTE]
> **Key improvements over your original spec:**
> 1. **Animated stepper UI** — not just text, but a visual pipeline with icons + glowing active step
> 2. **Resume Score Badge** — Gemini returns a 0-100 score, displayed as an animated circular gauge
> 3. **Skills Radar Chart** — Recharts radar visualization of skill categories
> 4. **Glassmorphism dark theme** — frosted glass cards, gradient accents, micro-animations
> 5. **Framer Motion** throughout — page transitions, staggered card reveals, hover effects
> 6. **Better prompt engineering** — structured JSON schema enforced in Gemini prompt for reliable parsing

---

## Proposed Changes

### Project Initialization

#### [NEW] Next.js App (root)
- `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` (non-interactive)
- Install deps: `pdf-parse`, `@octokit/rest`, `@google/generative-ai`, `framer-motion`, `recharts`, `react-dropzone`, `lucide-react`

#### [NEW] [.env.local](file:///d:/NextJs/blink-resume-parser/.env.local)
- `GEMINI_API_KEY`, `GITHUB_TOKEN` (optional)

---

### Design System & Layout

#### [NEW] [globals.css](file:///d:/NextJs/blink-resume-parser/src/app/globals.css)
- Dark theme CSS variables (deep navy/charcoal background, accent gradients)
- Glassmorphism utility classes (backdrop-blur, border-opacity, bg-opacity)
- Custom scrollbar styling, smooth scrolling

#### [MODIFY] [layout.tsx](file:///d:/NextJs/blink-resume-parser/src/app/layout.tsx)
- Google Font (Inter/Outfit), dark background, meta tags for SEO

---

### Backend — API Routes

#### [NEW] [route.ts](file:///d:/NextJs/blink-resume-parser/src/app/api/parse/route.ts)
- `POST /api/parse` — accepts `multipart/form-data` with `resume` field
- Validates: file exists, is PDF, ≤5MB
- Uses `pdf-parse` to extract text
- Regex to extract GitHub URL (`github.com/<username>`) and LinkedIn (`linkedin.com/in/<username>`)
- Returns `{ jobId, text, githubUrl, linkedinUsername }`

#### [NEW] [route.ts](file:///d:/NextJs/blink-resume-parser/src/app/api/enrich/github/route.ts)
- `GET /api/enrich/github?username=<username>`
- Uses `@octokit/rest` to fetch user profile + top 5 repos (sorted by stars)
- Returns `{ username, avatar, bio, followers, following, publicRepos, topRepos[] }`
- Graceful error: returns `{ error: true, message: "..." }` on failure

#### [NEW] [route.ts](file:///d:/NextJs/blink-resume-parser/src/app/api/insights/route.ts)
- `POST /api/insights` — body: `{ resumeText, githubData? }`
- Builds structured Gemini prompt requesting **strict JSON** output:
  ```
  { score: number, skills: string[], experienceLevel: string,
    strengths: string[], redFlags: string[], ceoSummary: string,
    skillCategories: { category: string, level: number }[] }
  ```
- Strips markdown fences from response, parses JSON
- Returns parsed insights or `{ error: true }` on failure

---

### Frontend — Components

#### [NEW] [FileUpload.tsx](file:///d:/NextJs/blink-resume-parser/src/components/FileUpload.tsx)
- `react-dropzone` powered drag & drop zone
- Animated border (dashed → solid on hover), file icon animation
- Validates size + type client-side before upload
- Shows filename + size after selection

#### [NEW] [ProgressStepper.tsx](file:///d:/NextJs/blink-resume-parser/src/components/ProgressStepper.tsx)
- 5 steps: Upload → Parse → GitHub → AI → Done
- Each step has icon (lucide), label, status (pending/active/done/error)
- Active step has glowing pulse animation
- Connectors animate between steps

#### [NEW] [ScoreBadge.tsx](file:///d:/NextJs/blink-resume-parser/src/components/ScoreBadge.tsx)
- Circular SVG gauge that animates from 0 to final score
- Color transitions: red (<40) → yellow (40-70) → green (>70)

#### [NEW] [SkillsRadar.tsx](file:///d:/NextJs/blink-resume-parser/src/components/SkillsRadar.tsx)
- Recharts `RadarChart` showing skill categories + levels
- Styled with theme colors, animated on mount

#### [NEW] [InsightCard.tsx](file:///d:/NextJs/blink-resume-parser/src/components/InsightCard.tsx)
- Reusable glassmorphism card with icon, title, content
- Framer Motion entrance animation (fade up + scale)

#### [NEW] [GitHubCard.tsx](file:///d:/NextJs/blink-resume-parser/src/components/GitHubCard.tsx)
- Shows avatar, bio, follower/repo counts, top repos with stars
- Links to actual GitHub profile

---

### Frontend — Pages

#### [MODIFY] [page.tsx](file:///d:/NextJs/blink-resume-parser/src/app/page.tsx)
- Landing page: hero headline, animated subtitle, FileUpload component
- ProgressStepper appears after file selected
- Orchestrates the multi-step API workflow:
  1. Upload → `/api/parse`
  2. If GitHub found → `/api/enrich/github`
  3. Send to → `/api/insights`
  4. Store in sessionStorage → redirect to `/dashboard/[id]`

#### [NEW] [page.tsx](file:///d:/NextJs/blink-resume-parser/src/app/dashboard/[id]/page.tsx)
- Reads `sessionStorage.getItem(id)`
- If missing → shows "Session expired" with re-upload button
- Dashboard layout:
  - **Top row**: ScoreBadge + CEO Summary + Experience Level
  - **Middle**: SkillsRadar + Strengths list + Red Flags
  - **Bottom**: GitHubCard + Raw text viewer (collapsible)
- All cards animate in with staggered delay

---

### Types

#### [NEW] [types.ts](file:///d:/NextJs/blink-resume-parser/src/lib/types.ts)
- `ParseResponse`, `GitHubData`, `AIInsights`, `ResumeResult` interfaces
- Shared between client and server

---

## Verification Plan

### Manual Verification (Primary)

Since this is a greenfield project with API-key-dependent features, manual testing is most appropriate:

1. **Start dev server**: `npm run dev` and open `http://localhost:3000`
2. **Upload flow — happy path**:
   - Drop a real PDF resume (with GitHub link) onto the upload zone
   - Verify progress stepper advances through each stage
   - Verify redirect to `/dashboard/<jobId>`
   - Verify all cards render: score, skills radar, strengths, GitHub data
3. **Upload flow — no GitHub link**:
   - Upload a PDF without a GitHub URL
   - Verify "GitHub enrichment" step shows as skipped (not error)
   - Verify AI insights still generate
4. **Error cases**:
   - Try uploading a `.txt` file → should show rejection message
   - Try uploading a file >5MB → should show size error
   - Visit `/dashboard/nonexistent-id` → should show "session expired" UI
5. **Production build** (final check):
   - Run `npm run build` to verify no TypeScript or build errors

### Automated (Build Verification)
```bash
npm run build   # Catches type errors, import issues, missing modules
npm run lint    # ESLint check
```
