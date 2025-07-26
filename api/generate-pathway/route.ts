import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment, githubProfile } = await request.json()

    console.log("🚀 Starting pathway generation...")
    console.log("📝 User profile:", { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment })

    // Check for API key
    const apiKey = process.env.XAI_API_KEY || process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("❌ No API key found")
      return NextResponse.json(
        {
          success: false,
          error: "API key not configured",
          message: "Please add your Grok API key to environment variables",
        },
        { status: 400 },
      )
    }

    // Step 1: Web scraping for resources
    console.log("🕷️ Starting web scraping...")
    const scrapingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/web-scraper`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLanguage,
          targetLanguage,
          skillLevel,
          goals,
        }),
      },
    )

    let scrapedResources = []
    if (scrapingResponse.ok) {
      const scrapingResult = await scrapingResponse.json()
      scrapedResources = scrapingResult.resources || []
      console.log("✅ Web scraping completed:", scrapedResources.length, "resources found")
    } else {
      console.log("⚠️ Web scraping failed, using fallback resources")
    }

    // Step 2: AI-powered pathway generation
    console.log("🧠 Starting AI pathway generation...")
    const aiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-pathway-generator`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLanguage,
          targetLanguage,
          skillLevel,
          goals,
          timeCommitment,
          scrapedResources,
          apiKey,
        }),
      },
    )

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json()
      console.error("❌ AI generation failed:", errorData)
      throw new Error(errorData.error || "AI pathway generation failed")
    }

    const aiResult = await aiResponse.json()
    console.log("✅ AI pathway generation completed")

    return NextResponse.json({
      success: true,
      pathway: aiResult.pathway,
      metadata: aiResult.metadata,
      curationType: "ai_enhanced_with_web_scraping",
    })
  } catch (error: any) {
    console.error("❌ Pathway generation error:", error)

    let errorMessage = "Failed to generate learning pathway"
    let statusCode = 500

    if (error.message?.includes("API key")) {
      errorMessage = "API key not configured. Please add your Grok API key."
      statusCode = 400
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Rate limit exceeded. Please try again in a moment."
      statusCode = 429
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error. Please check your connection."
      statusCode = 503
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.message,
      },
      { status: statusCode },
    )
  }
}
