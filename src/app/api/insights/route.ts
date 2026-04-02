import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { resumeText, githubData } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: true, message: "Resume text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: true, message: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: process.env.MODEL_ID || "gemini-flash-lite-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const githubContext = githubData
      ? `
GitHub Profile Data:
- Username: ${githubData.username}
- Public Repos: ${githubData.publicRepos}
- Followers: ${githubData.followers}
- Top Repositories: ${JSON.stringify(githubData.topRepos, null, 2)}
`
      : "No GitHub data available.";

    const prompt = `You are an expert technical recruiter and resume analyst. Analyze the following resume text and GitHub data, then return a JSON assessment.

RESUME TEXT:
${resumeText.slice(0, 4000)}

${githubContext}

Return exactly THIS JSON structure:
{
  "score": <number 0-100 representing overall resume strength>,
  "skills": [<array of 6-10 specific technical skills found>],
  "experienceLevel": "<one of: Entry Level, Junior, Mid-Level, Senior, Lead/Staff>",
  "strengths": [<array of 3-5 specific bullet points highlighting what makes this candidate strong>],
  "redFlags": [<array of 1-4 potential concerns, missing critical info, OR explicitly listing misspellings/grammar mistakes found>],
  "ceoSummary": "<2-3 sentence executive summary as if briefing a CEO about this candidate>",
  "skillCategories": [
    {"category": "Frontend", "level": <0-100>},
    {"category": "Backend", "level": <0-100>},
    {"category": "DevOps", "level": <0-100>},
    {"category": "Data/ML", "level": <0-100>},
    {"category": "System Design", "level": <0-100>},
    {"category": "Communication", "level": <0-100>}
  ]
}

IMPORTANT Instructions:
- Be specific and honest in your assessment.
- Actively search the resume for typos, spelling mistakes, or poor grammar and explicitly list them in the "redFlags" array.
- Accurately catch all technical skills mentioned and include them in "skills".
- Clearly pinpoint the candidate's biggest unique advantages in "strengths".
- Base the score on the overall quality, completeness, and impressiveness. Penalize heavily for misspellings.
- Factor in GitHub scale and quality if available.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean the response — strip markdown code fences if present
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const insights = JSON.parse(cleanJson);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        error: true,
        message: "AI analysis failed. Please try again.",
      },
      { status: 200 } // Return 200 so client can still show partial data
    );
  }
}
