import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Parse PDF and embedded links
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = require("pdf-parse");
    
    // We'll collect all embedded URLs here
    const embeddedUrls = new Set<string>();

    const options = {
      pagerender: async function (pageData: any) {
        // Extract annotations (hyperlinks)
        try {
          const annotations = await pageData.getAnnotations();
          for (const annot of annotations) {
            if (annot.subtype === 'Link' && annot.url) {
              embeddedUrls.add(annot.url);
            }
          }
        } catch (err) {
          console.error("Error getting PDF annotations:", err);
        }

        // Standard text extraction
        const textContent = await pageData.getTextContent();
        let lastY, text = '';
        for (const item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        return text;
      }
    };

    const pdfData = await pdfParse(buffer, options);
    const rawText: string = pdfData.text;

    // Extract generic links from text (just in case they are plaintext)
    const urlPattern = /https?:\/\/[a-zA-Z0-9.\-_~:/?#\[\]@!$&'()*+,;=]+/gi;
    const textUrls = rawText.match(urlPattern) || [];
    
    // Combine embedded URLs with plaintext URLs
    textUrls.forEach(url => embeddedUrls.add(url));

    let githubMatch: string | null = null;
    let linkedinMatch: string | null = null;
    const portfolioLinks: string[] = [];

    // Categorize Links
    Array.from(embeddedUrls).forEach(url => {
      const lowerUrl = url.toLowerCase();
      
      // Match GitHub
      if (lowerUrl.includes("github.com/")) {
        const match = url.match(/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})/i);
        if (match && !githubMatch) githubMatch = match[1];
      } 
      // Match LinkedIn
      else if (lowerUrl.includes("linkedin.com/in/")) {
        const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
        if (match && !linkedinMatch) linkedinMatch = match[1];
      } 
      // Other Links
      else {
        portfolioLinks.push(url);
      }
    });

    const jobId = crypto.randomUUID();

    return NextResponse.json({
      jobId,
      text: rawText.slice(0, 5000), // cap at 5000 chars
      githubUrl: githubMatch ? `https://github.com/${githubMatch}` : null,
      githubUsername: githubMatch || null,
      linkedinUsername: linkedinMatch || null,
      portfolioLinks: portfolioLinks.length > 0 ? portfolioLinks : null,
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. The file may be corrupted or encrypted." },
      { status: 500 }
    );
  }
}

