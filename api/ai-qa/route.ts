import { type NextRequest, NextResponse } from "next/server"
import { grokAPI } from "../../lib/grok-api"

export async function POST(request: NextRequest) {
  try {
    const { question, context, sessionId } = await request.json()

    // Validate required fields
    if (!question) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Question is required" 
        },
        { status: 400 }
      )
    }

    console.log("🤖 Processing question with Grok AI...")
    console.log("❓ Question:", question)
    console.log("📝 Context:", context ? "Provided" : "None")

    // Use Grok API to answer the question
    const answer = await grokAPI.answerQuestion(question, context)

    console.log("✅ Answer generated successfully")

    return NextResponse.json({
      success: true,
      answer,
      question,
      sessionId: sessionId || Date.now().toString(),
      timestamp: new Date().toISOString(),
      answeredBy: "Grok AI"
    })

  } catch (error) {
    console.error("❌ Error generating answer:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate answer",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        answer: "I apologize, but I'm unable to answer your question at the moment. Please try again later or rephrase your question."
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Grok AI Q&A endpoint is active",
    status: "ready",
    capabilities: [
      "Answer programming questions",
      "Explain coding concepts",
      "Provide learning guidance",
      "Debug assistance",
      "Best practices recommendations"
    ]
  })
}
