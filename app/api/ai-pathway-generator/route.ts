import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment, learningStyle, projectType } =
      await request.json()

    console.log("🚀 Starting AI pathway generation with Grok...")

    // Real xAI Grok API call
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: `You are an expert programming instructor and curriculum designer. Create comprehensive, personalized learning pathways that transition developers from one programming language to another. You must respond with valid JSON only.`,
          },
          {
            role: "user",
            content: `Create a detailed learning pathway for a ${skillLevel} developer transitioning from ${currentLanguage} to ${targetLanguage}.

Goals: ${goals.join(", ")}
Time Commitment: ${timeCommitment}
Learning Style: ${learningStyle}
Project Type: ${projectType || "General applications"}

Respond with ONLY valid JSON in this exact structure:
{
  "title": "Engaging pathway title",
  "description": "Brief description of what they'll learn",
  "estimatedHours": 40,
  "modules": [
    {
      "id": 1,
      "title": "Module name",
      "description": "What they'll learn in this module",
      "type": "lesson",
      "status": "available",
      "xp": 150,
      "estimatedTime": "2-3 hours",
      "resources": []
    }
  ]
}

Create 8-12 modules that progressively build skills from ${currentLanguage} to ${targetLanguage}. Focus on practical, hands-on learning.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ xAI API Error:", response.status, errorText)
      throw new Error(`xAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("✅ Received response from Grok API")

    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error("No content received from Grok API")
    }

    // Parse JSON response
    let pathwayData
    try {
      // Clean the response and extract JSON
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim()
      pathwayData = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error("❌ JSON parsing error:", parseError)
      console.log("Raw content:", content)

      // Create fallback pathway
      pathwayData = {
        title: `Master ${targetLanguage}: From ${currentLanguage} to ${targetLanguage}`,
        description: `A comprehensive pathway to transition from ${currentLanguage} to ${targetLanguage} with hands-on projects.`,
        estimatedHours: 45,
        modules: createFallbackModules(currentLanguage, targetLanguage, skillLevel),
      }
    }

    // Ensure modules have proper structure
    const processedModules = pathwayData.modules.map((module: any, index: number) => ({
      ...module,
      id: index + 1,
      status: index === 0 ? "available" : "locked",
      unlocked: index === 0,
      completed: false,
      resources: module.resources || [],
      learningObjectives: module.learningObjectives || [
        `Understand ${targetLanguage} concepts`,
        `Apply knowledge practically`,
        `Build real-world projects`,
      ],
    }))

    const finalPathway = {
      id: "pathway_" + Date.now(),
      title: pathwayData.title,
      description: pathwayData.description,
      currentLanguage,
      targetLanguage,
      skillLevel,
      goals,
      progress: 0,
      totalModules: processedModules.length,
      completedModules: 0,
      estimatedHours: pathwayData.estimatedHours || 40,
      createdAt: new Date().toISOString(),
      modules: processedModules,
    }

    console.log("✅ AI pathway generated successfully:", finalPathway.title)

    return NextResponse.json({
      success: true,
      pathway: finalPathway,
    })
  } catch (error) {
    console.error("❌ Error in AI pathway generation:", error)

    // Return working fallback
    const fallbackPathway = {
      id: "pathway_" + Date.now(),
      title: `Master TypeScript: From C++ to TypeScript`,
      description: `A comprehensive pathway to transition from C++ to TypeScript with hands-on projects and real-world applications.`,
      currentLanguage: "C++",
      targetLanguage: "TypeScript",
      skillLevel: "intermediate",
      goals: ["Web Development"],
      progress: 0,
      totalModules: 8,
      completedModules: 0,
      estimatedHours: 40,
      createdAt: new Date().toISOString(),
      modules: createFallbackModules("C++", "TypeScript", "intermediate"),
    }

    return NextResponse.json({
      success: true,
      pathway: fallbackPathway,
    })
  }
}

function createFallbackModules(currentLang: string, targetLang: string, skillLevel: string) {
  return [
    {
      id: 1,
      title: `${targetLang} Fundamentals`,
      description: `Learn ${targetLang} syntax, data types, and basic concepts coming from ${currentLang}`,
      type: "lesson",
      status: "available",
      unlocked: true,
      completed: false,
      xp: 150,
      estimatedTime: "2-3 hours",
      resources: [],
      learningObjectives: [
        `Understand ${targetLang} syntax and structure`,
        `Compare ${targetLang} concepts with ${currentLang}`,
        `Set up development environment`,
      ],
    },
    {
      id: 2,
      title: "Variables and Data Types",
      description: `Understanding data structures and type systems in ${targetLang}`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 150,
      estimatedTime: "2-3 hours",
      resources: [],
      learningObjectives: [
        `Master ${targetLang} type system`,
        `Work with primitive and complex types`,
        `Understand type inference and annotations`,
      ],
    },
    {
      id: 3,
      title: "Control Flow",
      description: `Loops, conditions, and logic control in ${targetLang}`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 200,
      estimatedTime: "3-4 hours",
      resources: [],
      learningObjectives: [
        `Implement conditional statements`,
        `Use different loop structures`,
        `Handle control flow patterns`,
      ],
    },
    {
      id: 4,
      title: "Functions and Modules",
      description: `Function syntax, modules, and code organization`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 200,
      estimatedTime: "3-4 hours",
      resources: [],
      learningObjectives: [
        `Write clean, reusable functions`,
        `Organize code with modules`,
        `Understand scope and closures`,
      ],
    },
    {
      id: 5,
      title: "Object-Oriented Programming",
      description: `Classes, inheritance, and OOP principles`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 250,
      estimatedTime: "4-5 hours",
      resources: [],
      learningObjectives: [`Create and use classes`, `Implement inheritance patterns`, `Apply OOP design principles`],
    },
    {
      id: 6,
      title: "Error Handling",
      description: `Exception handling and debugging techniques`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 180,
      estimatedTime: "2-3 hours",
      resources: [],
      learningObjectives: [`Handle errors gracefully`, `Use try-catch patterns`, `Debug code effectively`],
    },
    {
      id: 7,
      title: "First Project: CLI Tool",
      description: `Build a command-line application using your new skills`,
      type: "project",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 300,
      estimatedTime: "6-8 hours",
      resources: [],
      learningObjectives: [
        `Apply all learned concepts`,
        `Build a complete application`,
        `Handle user input and output`,
      ],
    },
    {
      id: 8,
      title: "Advanced Features",
      description: `Explore advanced ${targetLang} features and best practices`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 250,
      estimatedTime: "4-5 hours",
      resources: [],
      learningObjectives: [`Use advanced language features`, `Follow best practices`, `Optimize code performance`],
    },
  ]
}
