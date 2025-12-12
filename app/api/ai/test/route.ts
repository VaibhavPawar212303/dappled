import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key is missing in .env" }, { status: 500 });
  }

  try {
    // Direct REST call to Google to list available models for this Key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to fetch models", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter to show only "generateContent" capable models
    const capableModels = data.models?.filter((m: any) => 
      m.supportedGenerationMethods?.includes("generateContent")
    ).map((m: any) => m.name); // e.g. "models/gemini-pro"

    return NextResponse.json({ 
      count: capableModels?.length,
      available_models: capableModels,
      full_response: data 
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
  }
}