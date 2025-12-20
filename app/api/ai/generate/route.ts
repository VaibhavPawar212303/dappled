import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// 🏆 MODEL PRIORITY
// Added fallbacks to ensure uptime if 2.5 is region-locked or beta-gated
const MODEL_CANDIDATES = [
  "gemini-2.5-flash", 
  "gemini-2.0-flash", 
  "gemini-1.5-pro",
  "gemini-1.5-flash"
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { prompt, type, currentContent } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!process.env.GEMINI_API_KEY || !process.env.TAVILY_API_KEY) {
      return new NextResponse("API Keys missing", { status: 500 });
    }

    let finalPrompt = "";
    let systemInstruction = "";
    let searchContext = "";

    // ============================================================
    // 1. AGENTIC RESEARCH PHASE (The "MCP" Logic)
    // Only run search for writing/expanding tasks, not for quizzes
    // ============================================================
    if (type === "generate_from_title" || type === "expand_content") {
        try {
            console.log(`🔍 [Agent] Researching topic: "${prompt}"...`);
            
            const searchResult = await tvly.search(prompt, {
                search_depth: "advanced", 
                max_results: 7, 
                include_answer: true,
                include_raw_content: false, 
            });

            searchContext = `
            REAL-TIME MARKET DATA & COMPETITOR CONTENT:
            -------------------------------------------------------------
            Tavily AI Summary: ${searchResult.answer}
            
            TOP SEARCH RESULTS (Use these facts/stats to write the blog):
            ${searchResult.results.map((r, i) => `
            [Source ${i+1}]: ${r.title}
            URL: ${r.url}
            Content Excerpt: ${r.content}
            `).join("\n\n")}
            -------------------------------------------------------------
            `;
        } catch (error) {
            console.log("⚠️ Search failed, falling back to internal knowledge:", error);
            searchContext = "No real-time data available. Rely on internal knowledge.";
        }
    }

    // ============================================================
    // 2. PROMPT ENGINEERING PHASE
    // ============================================================
    switch (type) {
      case "generate_from_title":
        systemInstruction = `
          You are a Senior Technical Blog Writer.
          TASK: Write a comprehensive, long-form blog post (1500+ words) based on the Title and Market Data.
          GUIDELINES:
          1. **Accuracy:** Prioritize "Real-Time Market Data".
          2. **Structure:** Catchy H1, Intro, Bullet points, Deep Dive H2/H3s, Code Examples, Conclusion.
          3. **Formatting:** Use semantic HTML.
        `;
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nBLOG TITLE: "${prompt}"\n\nWRITE THE BLOG POST HTML NOW:`;
        break;

      case "expand_content":
        systemInstruction = `
          You are a Senior Editor.
          TASK: Expand the user's draft using the latest market data found in the search context.
          GUIDELINES: Keep the original tone. Inject new statistics and updates. Fix factual errors.
        `;
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nUSER'S CURRENT DRAFT:\n${currentContent}`;
        break;

      case "generate_tags":
        finalPrompt = `
          Analyze the Title and Market Context. Generate 5 trending SEO tags.
          Return ONLY a JSON array of strings. Example: ["Next.js 15", "AI Agents"]
          ${searchContext}
          TITLE: "${prompt}"
        `;
        break;

      // ✅ NEW: Quiz Generation Logic
      case "generate_quiz":
        systemInstruction = `
          You are an expert Teacher. 
          Analyze the provided text content.
          Generate 3 Multiple Choice Questions (MCQ) to test the student's understanding.
          
          RETURN FORMAT:
          You MUST return a raw JSON array. Do not wrap in markdown code blocks.
          
          JSON Structure:
          [
            {
              "question": "The question text?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0, // Index of the correct option (0-3)
              "explanation": "Why this is correct."
            }
          ]
        `;
        // Limit content length to prevent context window overflow
        finalPrompt = `${systemInstruction}\n\nCHAPTER CONTENT:\n${currentContent?.substring(0, 15000)}`;
        break;

      default:
        return new NextResponse("Invalid generation type", { status: 400 });
    }

    // ============================================================
    // 3. GENERATION PHASE (Waterfall Strategy)
    // ============================================================
    let output = "";
    let success = false;
    let lastError = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        console.log(`🤖 [Agent] Generating with model: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Determine if we need JSON mode (for Tags and Quizzes)
        const isJsonMode = type === "generate_tags" || type === "generate_quiz";

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            generationConfig: isJsonMode ? { responseMimeType: "application/json" } : undefined
        });

        const response = await result.response;
        output = response.text();
        
        console.log(`✅ [Agent] Success with ${modelName}`);
        success = true;
        break; 

      } catch (error: any) {
        console.warn(`⚠️ Failed with ${modelName}: ${error.message?.substring(0, 100)}...`);
        lastError = error;
        continue;
      }
    }

    if (!success) {
      throw lastError || new Error("Failed to generate content.");
    }

    return NextResponse.json({ output });

  } catch (error) {
    console.log("[AI_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}