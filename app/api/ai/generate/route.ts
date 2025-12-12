import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// 🏆 UPDATED MODEL PRIORITY (Based on your available models)
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",       // Newest Fast Model
  "gemini-2.5-pro",         // Newest High-Quality Model
  "gemini-2.0-flash",       // Previous Gen Stable
  "gemini-flash-latest",    // Generic Alias (Safe fallback)
  "gemini-pro-latest"       // Generic Alias (Safe fallback)
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

    // 1. AGENTIC FLOW: RESEARCH PHASE (Tavily)
    if (type === "generate_from_title" || type === "generate_tags") {
        try {
            console.log("🔍 Performing Market Research via Tavily...");
            const searchResult = await tvly.search(prompt, {
                search_depth: "basic",
                max_results: 5,
                include_answer: true
            });

            searchContext = `
            REAL-TIME MARKET DATA & CONTEXT:
            -------------------------------------------------------------
            Summary: ${searchResult.answer}
            
            Sources:
            ${searchResult.results.map((r, i) => `${i+1}. ${r.title} (${r.url}) - ${r.content}`).join("\n")}
            -------------------------------------------------------------
            `;
        } catch (error) {
            console.log("⚠️ Search failed, falling back to internal knowledge.");
            searchContext = "No real-time data available. Rely on internal knowledge.";
        }
    }

    // 2. PROMPT ENGINEERING PHASE
    switch (type) {
      case "generate_from_title":
        systemInstruction = `
          You are an expert Tech Blog Writer. 
          Goal: Write a comprehensive, engaging blog post based on the Title and Market Data provided.
          Rules:
          1. Use the REAL-TIME MARKET DATA to ensure facts are current.
          2. Use HTML formatting for the body (<h1>, <h2>, <p>, <ul>, <li>, <strong>).
          3. Tone: Professional, authoritative, yet accessible.
        `;
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nBLOG TITLE: "${prompt}"\n\nWRITE THE BLOG POST HTML NOW:`;
        break;

      case "expand_content":
        systemInstruction = "You are an editor. Expand the text, adding depth and examples. Return formatted HTML.";
        finalPrompt = `${systemInstruction}\n\nORIGINAL CONTENT:\n${currentContent}`;
        break;

      case "generate_tags":
        systemInstruction = `
          Analyze the Title and Market Context. Generate 5 trending SEO tags.
          Return ONLY a JSON array of strings. Example: ["Next.js", "AI"]
        `;
        finalPrompt = `${systemInstruction}\n\n${searchContext}\n\nTITLE: "${prompt}"`;
        break;

      default:
        return new NextResponse("Invalid generation type", { status: 400 });
    }

    // 3. GENERATION PHASE (Waterfall Strategy)
    let output = "";
    let success = false;
    let lastError = null;

    // Loop through our list of models until one works
    for (const modelName of MODEL_CANDIDATES) {
      try {
        console.log(`🤖 Attempting to generate with model: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            generationConfig: type === "generate_tags" ? { responseMimeType: "application/json" } : undefined
        });

        const response = await result.response;
        output = response.text();
        
        console.log(`✅ Success with ${modelName}`);
        success = true;
        break; // Exit the loop if successful

      } catch (error: any) {
        console.warn(`⚠️ Failed with ${modelName}: ${error.message?.substring(0, 100)}...`);
        lastError = error;
        continue; // Try the next model
      }
    }

    if (!success) {
      console.error("❌ All models failed.");
      throw lastError || new Error("Failed to generate content with any available model.");
    }

    return NextResponse.json({ output });

  } catch (error) {
    console.log("[AI_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}