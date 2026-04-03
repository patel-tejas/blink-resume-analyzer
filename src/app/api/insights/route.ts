import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { classifyResume } from "@/lib/classifyResume";

async function fetchLeetCodeData(username: string) {
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = await res.json();
    if (data.status === "success") {
      return {
        platform: "LeetCode",
        username,
        ranking: data.ranking,
        resolved: data.totalSolved,
        acceptance: data.acceptanceRate,
        recent: data.recentSubmissions,
      };
    }
  } catch (e) {
    console.error("LeetCode fetch error", e);
  }
  return null;
}

async function fetchCodeforcesData(username: string) {
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await res.json();
    if (data.status === "OK") {
      const user = data.result[0];
      return {
        platform: "Codeforces",
        username,
        rating: user.rating,
        rank: user.rank,
        maxRating: user.maxRating,
        maxRank: user.maxRank,
      };
    }
  } catch (e) {
    console.error("Codeforces fetch error", e);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { 
      resumeText, 
      githubData, 
      leetcodeUsername, 
      codeforcesUsername 
    } = await request.json();

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

    const category = classifyResume(resumeText);

    const githubContext = (category === "technical" && githubData)
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
      : "No GitHub data available (or non-technical profile).";

    let rolePersona = "technical recruiter and engineering manager";
    let promptFocus = "Focus heavily on technical architecture, coding proficiency, depth of tools used, open-source contributions, and engineering impact.";
    let orgFocus = "FAANG, MAANG, top-tier tech companies, and cutting-edge startups";
    let radarCategories = `    {"category": "Frontend", "level": <0-100>},
    {"category": "Backend", "level": <0-100>},
    {"category": "DevOps/Cloud", "level": <0-100>},
    {"category": "Data/ML", "level": <0-100>},
    {"category": "System Design", "level": <0-100>},
    {"category": "Communication", "level": <0-100>}`;
    
    if (category === "business") {
      rolePersona = "executive recruiter and MBA hiring manager";
      promptFocus = "Focus heavily on business strategy, leadership, cross-functional stakeholder management, revenue/ROI impact, and domain terminology.";
      orgFocus = "Fortune 500 companies, MBB consulting, top investment banks, and global enterprises";
      radarCategories = `    {"category": "Strategy/Ops", "level": <0-100>},
    {"category": "Sales/Marketing", "level": <0-100>},
    {"category": "Finance/Analytics", "level": <0-100>},
    {"category": "Product Mgmt", "level": <0-100>},
    {"category": "Leadership", "level": <0-100>},
    {"category": "Communication", "level": <0-100>}`;
    } else if (category === "general") {
      rolePersona = "senior talent acquisition specialist";
      promptFocus = "Focus on communication, organization, problem-solving, operational efficiency, and general professional soft skills.";
      orgFocus = "top-tier organizations worldwide";
      radarCategories = `    {"category": "Communication", "level": <0-100>},
    {"category": "Organization", "level": <0-100>},
    {"category": "Problem Solving", "level": <0-100>},
    {"category": "Teamwork", "level": <0-100>},
    {"category": "Adaptability", "level": <0-100>},
    {"category": "Leadership", "level": <0-100>}`;
    }

    const prompt = `You are a world-class ${rolePersona}, resume analyst, and career advisor. You have reviewed 100,000+ resumes and placed candidates at ${orgFocus}.

Perform an EXHAUSTIVE, FORENSIC-LEVEL analysis of the following resume. Extract EVERY piece of information. Miss nothing.

${promptFocus}

═══════════════════════════════
RESUME TEXT:
═══════════════════════════════
${resumeText.slice(0, 5000)}

═══════════════════════════════
${githubContext}
═══════════════════════════════

Return this EXACT JSON structure. Fill ALL fields thoroughly. Do NOT skip or leave empty arrays when data exists.

{
  "score": <number 0-100, holistic resume quality score>,

  "contactInfo": {
    "name": "<full name>",
    "email": "<email or null>",
    "phone": "<phone or null>",
    "location": "<city, state/country or null>",
    "github": "<GitHub URL or handle or null>",
    "linkedin": "<LinkedIn URL or handle or null>",
    "hasCompleteContact": <true if name + email + phone + at least one profile link are all present>
  },

  "experienceLevel": "<one of: Entry Level, Junior, Mid-Level, Senior, Staff/Lead, Principal, Executive>",

  "ceoSummary": "<3-4 sentence executive briefing. Be specific about what makes this candidate unique. Mention quantified achievements if any. This should read like a recruiter's pitch to a hiring manager.>",

  "resumeFormat": {
    "likelyTool": "<one of: LaTeX/Overleaf, Microsoft Word, Google Docs, Canva/Designer Tool, Unknown>",
    "isLatex": <true if resume appears to be built with LaTeX/Overleaf — clean typography, consistent spacing, structured layout>,
    "sectionOrder": ["<section1 as it appears>", "<section2>", "..."],
    "sectionOrderFeedback": "<1-2 sentences on whether section ordering is optimal. E.g., for freshers/interns: Education should be first; Experience before Projects if strong. Suggest reordering if needed.>"
  },

  "education": [
    {
      "institution": "<exact institution name>",
      "degree": "<degree type and major, e.g. B.Tech in Computer Science>",
      "year": "<year range, e.g. 2020-2024>",
      "expectedGraduation": "<graduation year if mentioned, null otherwise>",
      "gpa": "<GPA/CGPA/SGPA if mentioned, null otherwise>",
      "location": "<city/country of institution if mentioned, null otherwise>",
      "isRenowned": <true if globally or nationally recognized — IITs, IIMs, NITs, BITS, MIT, Stanford, Harvard, Oxford, UCL, top-50 global universities, or any well-known institution. Be generous.>,
      "highlight": "<If isRenowned, explain WHY — e.g. 'Top-5 engineering institute in India', 'Russell Group university'. null if not renowned.>"
    }
  ],

  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. May 2023 - Aug 2023>",
      "techStack": ["<tech mentioned in this role>"],
      "highlights": ["<accomplishment 1 — include numbers/metrics if present>", "<accomplishment 2>"],
      "usesActionVerbs": <true if bullet points start with strong action verbs like 'Developed', 'Built', 'Reduced', 'Improved', 'Designed', 'Led', etc.>,
      "hasMetrics": <true if ANY highlight contains a number, percentage, or measurable outcome>,
      "isLatestFirst": <true if this appears to be the most recent role listed first — correct ordering>,
      "isNotable": <true if FAANG, MAANG, Big Tech, unicorn startup, Fortune 500, Big 4, major bank, or widely recognized company>,
      "notableReason": "<If isNotable, explain why. null otherwise.>"
    }
  ],

  "projects": [
    {
      "name": "<project name>",
      "description": "<1-2 sentence description>",
      "techStack": ["<tech1>", "<tech2>"],
      "hasLink": <true if a URL or GitHub link is mentioned for this project>,
      "hasReadme": <true if a README or documentation is explicitly mentioned>,
      "isImpressive": <true if: uses advanced tech (ML/AI, distributed systems, blockchain), has real users/deployment, shows end-to-end capability, won awards, or demonstrates exceptional engineering>,
      "impressiveReason": "<If impressive, explain specifically why. null otherwise.>"
    }
  ],

  "achievements": [
    {
      "title": "<achievement description>",
      "hasStatistic": <true if the achievement includes a number, rank, percentile, or scale — e.g. 'top 5% of 50,000+ applicants from 70+ countries'>,
      "statisticQuote": "<the exact statistic phrase if present, e.g. 'top 5% of 50,000+ applications from 70+ countries'. null otherwise.>",
      "hasCodingProfile": <true if this links to or references a coding profile — LeetCode, Codeforces, HackerRank, CodeChef, etc.>,
      "isExceptional": <true if: hackathon wins, competitive programming rankings, open-source with stars, research/publications, patents, scholarships, national/international recognition, leadership positions>,
      "exceptionalReason": "<If exceptional, explain significance. null otherwise.>"
    }
  ],

  "certifications": ["<cert1>", "<cert2>"],

  "skills": {
    "all": ["<array of ALL technical skills mentioned — languages, frameworks, tools, databases, cloud, etc. Be exhaustive.>"],
    "hasKeywordDensity": <true if skills section appears comprehensive with 10+ skills listed>,
    "missingCommonSkills": ["<important skills that appear in their projects/experience but are NOT listed in the skills section>"],
    "note": "<1 sentence feedback on the skills section. E.g., 'Skills section is comprehensive and keyword-rich' or 'Missing Git, Docker from skills despite being used in projects.'>"
  },

  "skillCategories": [
${radarCategories}
  ],

  "strengths": ["<4-6 SPECIFIC strengths referencing actual resume content. Not generic. E.g., 'Quantified impact in experience section — reduced latency by 43%, showing engineering depth'>"],

  "redFlags": ["<2-6 concerns: missing sections, exact typos (quote them), employment gaps, missing metrics, weak descriptions, wrong section order, missing links on projects, no README mentions, no coding profiles>"],

  "atsScore": <number 0-100 based on: keyword density, action verbs, quantified achievements, proper section headings, consistent formatting>,

  "atsIssues": ["<specific ATS problems, e.g. 'Missing quantified metrics in 3/4 experience entries', 'No action verbs in project descriptions', 'Inconsistent date formatting'>"],

  "formatScore": <number 0-100 based on: visual consistency, section organization, date formatting, bullet style, readability, correct chronological ordering>,

  "formatIssues": ["<specific formatting problems, e.g. 'Dates not in consistent format', 'Experience not in reverse-chronological order', 'Section headings inconsistent'>"],

  "sectionCompleteness": {
    "hasTitle": <true if name and contact info section exists>,
    "hasEducation": <true if education section exists>,
    "hasExperience": <true if experience/internships section exists>,
    "hasProjects": <true if projects section exists>,
    "hasSkills": <true if skills section exists>,
    "hasAchievements": <true if achievements/awards section exists>,
    "hasCertifications": <true if certifications section exists>,
    "missingSections": ["<any recommended sections that are missing>"]
  }
}

══════════════ CRITICAL INSTRUCTIONS ══════════════
1. Extract EVERYTHING. Parse every section thoroughly. No section in the resume should be missing from your output.
2. Be GENEROUS with highlight flags (isRenowned, isNotable, isImpressive, isExceptional, hasStatistic). If there's any argument for flagging, flag it.
3. For education: Flag ALL recognized institutions — IITs, NITs, BITS, IIMs, top state/private universities globally.
4. For experience: Flag ALL recognizable companies — tech giants, unicorns, well-funded startups, major banks.
5. SECTION ORDER matters: For freshers/interns, Education should be first. Experience should appear before Projects if it's strong. Penalize wrong ordering in formatIssues.
6. METRICS ARE CRITICAL: Reward experience entries that use numbers (e.g., "43% reduction", "66% performance improvement"). Flag entries that lack them in redFlags.
7. ACTION VERBS: Each experience/project bullet should start with a strong verb (Developed, Built, Reduced, Designed, Led, etc.). Flag missing action verbs.
8. SKILLS SECTION: Candidates should list all skills — even ones they're still learning. Flag if skills section is sparse or missing keywords that appear in their work.
9. PROJECT LINKS: Projects should have links. README presence is a positive signal. Flag missing links in redFlags.
10. ACHIEVEMENTS WITH STATS: Achievements like "top 5% of 50,000+ applicants from 70+ countries" are far stronger than vague ones. Flag and reward statistics.
11. CODING PROFILES: LeetCode, Codeforces, HackerRank links in achievements/contact are a positive signal for tech roles.
12. ACTIVELY search for typos and grammar mistakes. Quote them exactly in redFlags.
13. If a section has NO data, return empty array. Do not omit the key.
14. Factor in GitHub data quality and scale if available.
15. Score breakdown: Completeness (20%) + Technical Depth (25%) + Achievements & Impact (20%) + Presentation & Format (15%) + ATS Readiness (20%).`;

    // Run Groq and Social Enrichment in parallel
    const groqPromise = groq.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "system",
          content: `You are a world-class ${rolePersona} and resume analyst. You always respond with valid JSON only, no markdown formatting.`,
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

    // Only fetch competitive programming data if it's a technical profile
    const leetcodePromise = (category === "technical" && leetcodeUsername) ? fetchLeetCodeData(leetcodeUsername) : Promise.resolve(null);
    const codeforcesPromise = (category === "technical" && codeforcesUsername) ? fetchCodeforcesData(codeforcesUsername) : Promise.resolve(null);

    // Wait for all using allSettled to prevent external API failures from crashing the primary analysis
    const results = await Promise.allSettled([
      groqPromise,
      leetcodePromise,
      codeforcesPromise
    ]);

    // If the primary AI generation fails, we must throw because we have no useful output
    if (results[0].status === "rejected") {
      throw results[0].reason;
    }
    
    const chatCompletion = results[0].value;
    // For enrichment APIs, degrade gracefully to null on failure instead of crashing the request
    const leetcodeData = results[1].status === "fulfilled" ? results[1].value : null;
    const codeforcesData = results[2].status === "fulfilled" ? results[2].value : null;

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";

    // Clean the response — strip markdown code fences if present
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const insights = JSON.parse(cleanJson);

    return NextResponse.json({
      ...insights,
      socialEnrichment: {
        leetcode: leetcodeData,
        codeforces: codeforcesData
      }
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "AI analysis failed. Please try again.",
      },
      { status: 200 } // Return 200 so client can still show partial data
    );
  }
}
