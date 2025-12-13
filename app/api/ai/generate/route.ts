import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// 🏆 MODEL PRIORITY (Using your latest available models)
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",       // Excellent speed/intelligence balance      
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
    // ============================================================
    if (type === "generate_from_title" || type === "expand_content") {
        try {
            console.log(`🔍 [Agent] Researching topic: "${prompt}"...`);
            
            // We use 'advanced' depth to get better results
            const searchResult = await tvly.search(prompt, {
                search_depth: "advanced", 
                max_results: 7, // Get more sources for a comprehensive blog
                include_answer: true,
                include_raw_content: false, // Set to true if you want HTML parsing (heavy), usually 'content' is enough
            });

            // Construct a rich context block for the LLM
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
          
          TASK:
          Write a comprehensive, long-form blog post (1500+ words) based on the Title and the provided Market Data.
          
          GUIDELINES:
          1. **Accuracy:** Prioritize the provided "Real-Time Market Data". If the data mentions a new version (e.g., Next.js 15), use that.
          2. **Structure:**
             - **Catchy H1 Title**
             - **Introduction:** Hook the reader, define the problem.
             - **Key Takeaways (Bullet points)**
             - **Deep Dive Sections (H2 & H3):** Use the search results to flesh out technical details.
             - **Code Examples:** If technical, provide realistic code blocks.
             - **Conclusion:** Summary and call to action.
          3. **Formatting:** Use semantic HTML (<h1>, <h2>, <p>, <ul>, <pre><code>).
          4. **Citations:** Mentions specific tools or stats found in the search context.
        `;
        
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nBLOG TITLE: "${prompt}"\n\nWRITE THE BLOG POST HTML NOW:`;
        break;

      case "expand_content":
        systemInstruction = `
          You are a Senior Editor.
          
          TASK:
          Take the user's current draft and EXPAND it using the latest market data found in the search context.
          
          GUIDELINES:
          1. Keep the user's original tone.
          2. Inject new statistics, recent updates, or missing technical details found in the search context.
          3. Fix any factual errors based on the search data.
          4. Return the full updated HTML.
        `;
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nUSER'S CURRENT DRAFT:\n${currentContent}`;
        break;

      case "generate_tags":
        // Keep this lightweight
        finalPrompt = `
          Analyze the following Title and Market Context.
          Generate 5 trending, high-traffic SEO tags relevant to right now.
          Return ONLY a JSON array of strings. Example: ["Next.js 15", "AI Agents"]
          
          ${searchContext}
          
          TITLE: "${prompt}"
        `;
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
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            generationConfig: type === "generate_tags" ? { responseMimeType: "application/json" } : undefined
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