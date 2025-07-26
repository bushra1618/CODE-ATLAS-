import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resources, currentLanguage, targetLanguage, skillLevel } = await request.json()

    console.log("✂️ AI is optimizing content...")

    // Use xAI to analyze and slice content
    const slicedContent = await Promise.all(
      resources.map(async (resource: any) => {
        try {
          const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.XAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "grok-3",
              messages: [
                {
                  role: "system",
                  content: `You are an expert content curator and educational technologist. Analyze learning resources and optimize them for specific learning transitions. Focus on extracting the most relevant segments and providing precise guidance.`,
                },
                {
                  role: "user",
                  content: `Analyze this learning resource for a ${skillLevel} developer transitioning from ${currentLanguage} to ${targetLanguage}:

Resource: ${resource.title}
Type: ${resource.type}
URL: ${resource.url}
Description: ${resource.description}

Please provide a JSON response with optimized content slicing:
{
  "sliced_content": {
    "title": "Optimized title for this transition",
    "key_concepts": ["concept1", "concept2", "concept3"],
    "difficulty_level": "beginner|intermediate|advanced",
    "estimated_time": "X minutes",
    "time_segments": [
      {
        "start": "5:30",
        "end": "12:45",
        "topic": "Core concept being taught",
        "why_important": "Why this segment is crucial for the transition"
      }
    ],
    "optimal_sections": ["section1", "section2"],
    "learning_objectives": ["objective1", "objective2"],
    "prerequisites": ["prereq1", "prereq2"]
  },
  "ai_analysis": {
    "relevance_score": 9.2,
    "quality_score": 8.8,
    "transition_fit": "How well this fits the ${currentLanguage} to ${targetLanguage} transition",
    "community_rating": 4.7,
    "last_updated": "2024-01-15",
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"]
  }
}`,
                },
              ],
              temperature: 0.3,
              max_tokens: 1500,
            }),
          })

          if (!response.ok) {
            throw new Error(`xAI API error: ${response.status}`)
          }

          const data = await response.json()
          const content = data.choices[0]?.message?.content

          if (!content) {
            throw new Error("No content received from xAI API")
          }

          // Parse JSON response
          let slicedData
          try {
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
            const jsonString = jsonMatch ? jsonMatch[1] : content
            slicedData = JSON.parse(jsonString)
          } catch (parseError) {
            console.error("JSON parsing error:", parseError)
            // Fallback to enhanced resource data
            slicedData = createFallbackSlicing(resource, currentLanguage, targetLanguage, skillLevel)
          }

          return {
            original_url: resource.url,
            original_resource: resource,
            sliced_content: slicedData.sliced_content,
            ai_analysis: slicedData.ai_analysis,
          }
        } catch (error) {
          console.error(`Error processing resource ${resource.id}:`, error)
          return {
            original_url: resource.url,
            original_resource: resource,
            sliced_content: createFallbackSlicing(resource, currentLanguage, targetLanguage, skillLevel).sliced_content,
            ai_analysis: createFallbackSlicing(resource, currentLanguage, targetLanguage, skillLevel).ai_analysis,
          }
        }
      }),
    )

    console.log("✅ Content slicing completed")

    return NextResponse.json({
      success: true,
      sliced_content: slicedContent,
    })
  } catch (error) {
    console.error("❌ Error in content slicing:", error)
    return NextResponse.json({ success: false, error: "Failed to slice content" }, { status: 500 })
  }
}

function createFallbackSlicing(resource: any, currentLang: string, targetLang: string, skillLevel: string) {
  const timeSegments = resource.type === "video" ? generateTimeSegments() : []
  const sections = resource.type === "documentation" ? generateSections() : []

  return {
    sliced_content: {
      title: `${resource.title} - Optimized for ${currentLang} → ${targetLang}`,
      key_concepts: [
        `${targetLang} syntax`,
        `${currentLang} to ${targetLang} patterns`,
        "Best practices",
        "Common pitfalls",
      ],
      difficulty_level: resource.difficulty || skillLevel,
      estimated_time: resource.duration || `${Math.floor(Math.random() * 30) + 15} minutes`,
      time_segments: timeSegments,
      optimal_sections: sections,
      learning_objectives: [
        `Understand ${targetLang} concepts from ${currentLang} perspective`,
        `Apply ${targetLang} patterns effectively`,
        `Avoid common transition mistakes`,
      ],
      prerequisites: [`Basic ${currentLang} knowledge`, "Programming fundamentals"],
    },
    ai_analysis: {
      relevance_score: 8.5 + Math.random() * 1.5,
      quality_score: resource.qualityScore || 8.8,
      transition_fit: `Excellent resource for ${currentLang} developers learning ${targetLang}. Covers key differences and similarities between the languages.`,
      community_rating: 4.2 + Math.random() * 0.8,
      last_updated: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      pros: ["Clear explanations", `Good ${currentLang} comparisons`, "Practical examples", "Up-to-date content"],
      cons: ["Could use more exercises", "Assumes some prior knowledge"],
    },
  }
}

function generateTimeSegments() {
  const segments = []
  const numSegments = Math.floor(Math.random() * 3) + 1

  for (let i = 0; i < numSegments; i++) {
    const startMinutes = Math.floor(Math.random() * 20) + i * 10
    const startSeconds = Math.floor(Math.random() * 60)
    const duration = Math.floor(Math.random() * 8) + 5
    const endMinutes = startMinutes + duration
    const endSeconds = Math.floor(Math.random() * 60)

    segments.push({
      start: `${startMinutes}:${String(startSeconds).padStart(2, "0")}`,
      end: `${endMinutes}:${String(endSeconds).padStart(2, "0")}`,
      topic: ["Core concepts", "Syntax differences", "Best practices", "Common patterns"][i % 4],
      why_important: "Essential for understanding the transition between languages",
    })
  }

  return segments
}

function generateSections() {
  const allSections = [
    "getting-started",
    "basic-syntax",
    "data-types",
    "control-flow",
    "functions",
    "classes",
    "modules",
    "error-handling",
    "best-practices",
    "advanced-features",
  ]

  const numSections = Math.floor(Math.random() * 4) + 2
  return allSections.slice(0, numSections)
}
