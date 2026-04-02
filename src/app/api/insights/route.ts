import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const { resumeText, githubData } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: true, message: "Resume text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const modelId = process.env.MODEL_ID || "meta-llama/llama-4-scout-17b-16e-instruct";

    const githubContext = githubData
      ? `
GitHub Profile Data:
- Username: ${githubData.username}
- Bio: ${githubData.bio || "N/A"}
- Public Repos: ${githubData.publicRepos}
- Followers: ${githubData.followers}
- Following: ${githubData.following}
- Top Repositories:
${githubData.topRepos
  .map(
    (r: { name: string; description: string | null; stars: number; language: string | null }) =>
      `  • ${r.name} (★${r.stars}, ${r.language || "N/A"}): ${r.description || "No description"}`
  )
  .join("\n")}
`
      : "No GitHub data available.";

    const prompt = `You are a world-class technical recruiter, resume analyst, and career advisor. You have reviewed 100,000+ resumes across FAANG, startups, and Fortune 500 companies. 

Perform an EXHAUSTIVE, FORENSIC-LEVEL analysis of the following resume. Extract EVERY piece of information. Miss nothing.

═══════════════════════════════
RESUME TEXT:
═══════════════════════════════
${resumeText.slice(0, 5000)}

═══════════════════════════════
${githubContext}
═══════════════════════════════

Return this EXACT JSON structure. Fill ALL fields thoroughly. Do NOT skip or leave empty arrays when data exists in the resume.

{
  "score": <number 0-100, holistic resume quality score>,
  
  "contactInfo": {
    "name": "<full name extracted from resume>",
    "email": "<email if found, null otherwise>",
    "phone": "<phone if found, null otherwise>",
    "location": "<city, state/country if found, null otherwise>"
  },

  "experienceLevel": "<one of: Entry Level, Junior, Mid-Level, Senior, Staff/Lead, Principal, Executive>",
  
  "ceoSummary": "<3-4 sentence executive briefing. Be specific about what makes this candidate unique. Mention quantified achievements if any. This should read like a recruiter's pitch to a hiring manager.>",

  "education": [
    {
      "institution": "<exact institution name>",
      "degree": "<degree type and major, e.g. B.Tech in Computer Science>",
      "year": "<year or year range, e.g. 2020-2024>",
      "gpa": "<GPA if mentioned, null otherwise>",
      "isRenowned": <true if the institution is globally/nationally recognized — IITs, IIMs, MIT, Stanford, Harvard, Oxford, NIT, BITS, top-50 global universities, or any well-known institution. Be generous with this flag.>,
      "highlight": "<If isRenowned is true, explain WHY it's notable, e.g. 'Top-5 engineering institute in India', 'Ivy League university'. null if not renowned.>"
    }
  ],

  "experience": [
    {
      "company": "<company name>",
      "role": "<job title/role>",
      "duration": "<time period, e.g. May 2023 - Aug 2023>",
      "highlights": ["<key accomplishment 1 - include numbers/metrics if present>", "<accomplishment 2>"],
      "isNotable": <true if the company is well-known — FAANG, MAANG, Big Tech, unicorn startups, Fortune 500, Big 4 consulting, major banks, or any widely recognized company>,
      "notableReason": "<If isNotable, explain why, e.g. 'FAANG company', 'Unicorn startup valued at $10B'. null if not notable.>"
    }
  ],

  "projects": [
    {
      "name": "<project name>",
      "description": "<concise description of what the project does, 1-2 sentences>",
      "techStack": ["<tech1>", "<tech2>", ...],
      "isImpressive": <true if: uses advanced tech (ML/AI, distributed systems, blockchain), has real users/deployment, shows end-to-end capability, won awards, or demonstrates exceptional engineering>,
      "impressiveReason": "<If impressive, explain specifically why. null otherwise.>"
    }
  ],

  "achievements": [
    {
      "title": "<achievement description>",
      "isExceptional": <true if: hackathon wins, competitive programming rankings, open-source contributions with stars, research publications, patents, scholarships, national/international recognition, leadership roles>,
      "exceptionalReason": "<If exceptional, explain the significance. e.g. 'National-level competitive win among 5000+ participants'. null otherwise.>"
    }
  ],

  "certifications": ["<cert1>", "<cert2>"],

  "skills": [<array of 8-15 specific technical skills found in the resume. Include programming languages, frameworks, tools, databases, cloud services. Be comprehensive.>],
  
  "skillCategories": [
    {"category": "Frontend", "level": <0-100>},
    {"category": "Backend", "level": <0-100>},
    {"category": "DevOps/Cloud", "level": <0-100>},
    {"category": "Data/ML", "level": <0-100>},
    {"category": "System Design", "level": <0-100>},
    {"category": "Communication", "level": <0-100>}
  ],

  "strengths": [<array of 4-6 SPECIFIC, DETAILED strengths. Not generic. Reference actual items from the resume. e.g. "Strong full-stack capability demonstrated through 3 deployed projects using React + Node.js">],
  
  "redFlags": [<array of 2-5 concerns. Include: missing sections, typos/grammar errors (quote them exactly), gaps in experience, missing quantified achievements, weak descriptions, formatting issues>],

  "atsScore": <number 0-100. Score based on: keyword density, action verbs usage, quantified achievements, proper section headings, consistent formatting>,
  
  "atsIssues": [<specific ATS problems: "Missing quantified metrics in 3/4 experience entries", "No action verbs in project descriptions", "Inconsistent date formatting">],
  
  "formatScore": <number 0-100. Score based on: visual consistency, section organization, date formatting, bullet point style, overall readability>,
  
  "formatIssues": [<specific formatting problems found>]
}

══════════════ CRITICAL INSTRUCTIONS ══════════════
1. Extract EVERYTHING. Parse every section of the resume thoroughly. If a section exists, it MUST appear in your output.
2. Be GENEROUS with highlight flags (isRenowned, isNotable, isImpressive, isExceptional). If there's any argument for flagging something, flag it. The user wants to see what stands out.
3. For education: Flag ALL recognized institutions — not just Ivy League. Include IITs, NITs, BITS, top state universities, well-known private universities globally.
4. For experience: Flag ALL recognizable companies — tech giants, unicorns, well-funded startups, major corporations.
5. For achievements: Flag competition wins, rankings, scholarships, publications, open-source work, leadership positions.
6. ACTIVELY search for typos and grammar mistakes. Quote them exactly in redFlags.
7. In strengths, REFERENCE specific items from the resume. No generic statements.
8. Factor in GitHub data quality and scale if available.
9. If a section has NO data in the resume, return an empty array for that section. Do not omit the key.
10. The score should reflect: completeness (20%), technical depth (25%), achievements (20%), presentation quality (15%), ATS readiness (20%).`;

    const chatCompletion = await groq.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "system",
          content: "You are a world-class technical recruiter and resume analyst. You always respond with valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_completion_tokens: 4096,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";

    // Clean the response — strip markdown code fences if present
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const insights = JSON.parse(cleanJson);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "AI analysis failed. Please try again.",
      },
      { status: 200 } // Return 200 so client can still show partial data
    );
  }
}
