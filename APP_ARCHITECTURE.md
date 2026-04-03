 # Blink Resume Parser: System Architecture & Data Flow

This document provides a deep technical breakdown of how a resume is processed, validated, and enriched from the initial upload to the final AI-powered dashboard.

---

## 1. High-Level Request Lifecycle

The application follows a 6-layer validation and enrichment pipeline:

1.  **Client-Side Initialization**: Drag & Drop, initial file type/size sanity check.
2.  **Layer 1: Security (Magic Bytes)**: Validates actual file signatures on the server.
3.  **Layer 2: Content Parsing**: Structural text and link extraction from PDF.
4.  **Layer 3: Heuristics & Anti-OCR**: Rejection of scanned or non-resume PDFs.
5.  **Layer 4: Domain Classification**: Weighted scoring (Technical vs Business vs General).
6.  **Layer 5: Enrichment & AI**: Parallel social data fetching + AI Persona generation.
7.  **Data Persistence**: SessionStorage with Quota-Loss protection.

---

## 2. Layer-by-Layer Detail

### Layer 1 & 2: Parsing & Backend Security
- **Magic Bytes Verification**: Instead of trusting `file.type`, we read the first 4 bytes of the ArrayBuffer.
  - *Internal Rule:* Buffer must start with `25 50 44 46` (`%PDF`).
- **Link Extraction**: We use a `Set` to collect URLs from two sources:
  1.  **Embedded Annotations**: Interactive links built into the PDF.
  2.  **Plaintext RegEx**: Scanning raw text for `https?` strings in case the links aren't clickable.

### Layer 3: The "Anti-OCR" Gate
If a user uploads a scanned image PDF, `pdf-parse` correctly returns almost no text.
- **Rules applied in `/api/parse`:**
  - **Min Length:** Must have > 200 non-whitespace characters.
  - **Max Pages:** Page count from metadata must be ≤ 5.
  - **Signal Detection:** Looks for at least one core resume "signal" (e.g., `experience`, `education`, `skills`). 
- *Result:* Rejects low-signal documents immediately, saving AI costs.

### Layer 4: The Intelligent Classification Engine (`classifyResume.ts`)
Instead of simple boolean matching, we use a **Weighted Confidence Score**:
- **Tech Keywords:** (React, AWS, Python) = +1 point each (capped at +3 per keyword).
- **Business Keywords:** (MBA, ROI, P&L) = +1 point each.
- **Hard Overrides:** Detection of a `github.com`, `leetcode.com`, or `codeforces.com` link adds an unassailable **+10 points** to the `techScore`.
- *Result:* Correctly classifies a "Business Manager with a GitHub profile" as a Technical Technical profile (Engineering Manager).

### Layer 5: Parallel Enrichment (`api/insights/route.ts`)
We use `Promise.allSettled` to fetch AI insights and competitive scores simultaneously.
- **Tasks in Parallel:**
  1. AI (Llama 3/4) generation.
  2. LeetCode Stats API.
  3. Codeforces Profile API.
- **Resilience:** Even if LeetCode returns a 500 or times out, `allSettled` allows the AI analysis to finalize. The dashboard simply shows "N/A" for LeetCode rather than showing a global error.

---

## 3. Progress Stepper Logic

The "Progress Bar" you see is an **Active State Machine** rather than a fake timer.

- **Status: "active"**: Triggered BEFORE the `fetch()` call starts.
- **Status: "done"**: Triggered AFTER the `await fetch()` resolves.
- **Status: "error"**: Triggered if the `catch` block intercepts a network error or a code failure.

### Animation Pipeline:
- **Upload Step:** Fires as soon as the `FormData` is sent.
- **Parsing Step:** Stays "active" while `pdf-parse` runs in server-side CPU.
- **Extracting Links Step:** Fires `fetch(/api/enrich/github)`. Even if non-technical, we use an intentional `setTimeout(600)` to ensure the user sees the "Extracting Links" icon spin for visual feedback consistency.
- **AI Analytics:** Stays active during the full duration of the Groq network request.

---

## 4. Storage & Persistence (The 5MB Limit)

The final payload contains the parsed text, social stats, AI JSON, and a **Base64 version** of the PDF.
- **Base64 Note:** This encoding increases file size by ~33%.
- **Safety Catch:** In `page.tsx`, we intercept `QuotaExceededError`. If the string is too large for the 5MB browser quota, we inform the user to upload a text-optimized PDF instead of crashing silently.

---

## 5. Technology Stack
- **Frontend**: Next.js (App Router), Framer Motion (Animations), Tailwind CSS.
- **Backend APIs**: Groq (Llama Model), LeetCode/Codeforces public APIs.
- **Intelligence**: Custom RegEx parsers + Weighted Scoring Engine.
