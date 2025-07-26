import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment, learningStyle, projectType } =
      await request.json()

    console.log("🚀 Starting AI pathway generation with Grok...")

    // Real xAI Grok API call with correct model name
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-2-1212", // Updated to correct model name
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

      // Always return a working fallback instead of throwing
      const fallbackPathway = createIntelligentFallback(
        currentLanguage,
        targetLanguage,
        skillLevel,
        goals,
        timeCommitment,
        learningStyle,
        projectType,
      )

      return NextResponse.json({
        success: true,
        pathway: fallbackPathway,
        note: "Generated using intelligent fallback system due to API error",
      })
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

      // Use intelligent fallback
      const fallbackPathway = createIntelligentFallback(
        currentLanguage,
        targetLanguage,
        skillLevel,
        goals,
        timeCommitment,
        learningStyle,
        projectType,
      )

      return NextResponse.json({
        success: true,
        pathway: fallbackPathway,
        note: "Generated using intelligent fallback system due to parsing error",
      })
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

    // Always return working fallback
    const { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment, learningStyle, projectType } =
      await request.json()

    const fallbackPathway = createIntelligentFallback(
      currentLanguage || "JavaScript",
      targetLanguage || "Python",
      skillLevel || "intermediate",
      goals || ["Web Development"],
      timeCommitment || "3-5 hours/week",
      learningStyle || "hands-on",
      projectType || "General applications",
    )

    return NextResponse.json({
      success: true,
      pathway: fallbackPathway,
      note: "Generated using intelligent fallback system",
    })
  }
}

function createIntelligentFallback(
  currentLanguage: string,
  targetLanguage: string,
  skillLevel: string,
  goals: string[],
  timeCommitment: string,
  learningStyle: string,
  projectType: string,
) {
  // Intelligent analysis of language transition
  const languageAnalysis = analyzeLanguageTransition(currentLanguage, targetLanguage)
  const modules = generateIntelligentModules(currentLanguage, targetLanguage, skillLevel, goals, languageAnalysis)

  return {
    id: "pathway_" + Date.now(),
    title: `Master ${targetLanguage}: ${currentLanguage} Developer's Journey`,
    description: `A personalized pathway leveraging your ${currentLanguage} expertise to master ${targetLanguage}. ${languageAnalysis.description}`,
    currentLanguage,
    targetLanguage,
    skillLevel,
    goals,
    progress: 0,
    totalModules: modules.length,
    completedModules: 0,
    estimatedHours: calculateEstimatedHours(modules, timeCommitment),
    createdAt: new Date().toISOString(),
    modules,
  }
}

function analyzeLanguageTransition(currentLang: string, targetLang: string) {
  const transitions: { [key: string]: { [key: string]: any } } = {
    JavaScript: {
      Python: {
        description: "Transition from dynamic web scripting to versatile backend and data science programming.",
        similarities: ["Dynamic typing", "Interpreted", "High-level"],
        differences: ["Indentation-based syntax", "Different OOP model", "Extensive libraries"],
        focus: ["Python syntax", "Data structures", "Libraries ecosystem"],
      },
      TypeScript: {
        description: "Add static typing and advanced features to your JavaScript knowledge.",
        similarities: ["Same runtime", "Similar syntax", "Web ecosystem"],
        differences: ["Static typing", "Interfaces", "Generics"],
        focus: ["Type system", "Advanced features", "Tooling"],
      },
      Java: {
        description: "Move from dynamic scripting to statically-typed, object-oriented programming.",
        similarities: ["C-style syntax", "Object-oriented"],
        differences: ["Static typing", "Compilation", "Verbose syntax"],
        focus: ["OOP principles", "Type system", "JVM ecosystem"],
      },
    },
    Python: {
      JavaScript: {
        description: "Transition from backend/data science to dynamic web development.",
        similarities: ["Dynamic typing", "High-level", "Interpreted"],
        differences: ["Prototype-based OOP", "Async programming", "Web APIs"],
        focus: ["Web development", "Async patterns", "DOM manipulation"],
      },
      Rust: {
        description: "Move from high-level scripting to systems programming with memory safety.",
        similarities: ["Modern syntax", "Strong community"],
        differences: ["Memory management", "Static typing", "Ownership model"],
        focus: ["Memory safety", "Performance", "Systems concepts"],
      },
      Go: {
        description: "Transition to concurrent, compiled systems programming.",
        similarities: ["Simple syntax", "Strong standard library"],
        differences: ["Static typing", "Goroutines", "Compilation"],
        focus: ["Concurrency", "Performance", "Simplicity"],
      },
    },
    Java: {
      Kotlin: {
        description: "Modern, concise alternative that runs on the JVM.",
        similarities: ["JVM ecosystem", "Object-oriented", "Static typing"],
        differences: ["Null safety", "Concise syntax", "Functional features"],
        focus: ["Modern syntax", "Null safety", "Interoperability"],
      },
      Python: {
        description: "Move from verbose, compiled to concise, interpreted programming.",
        similarities: ["Object-oriented", "Large ecosystem"],
        differences: ["Dynamic typing", "Indentation", "Interactive development"],
        focus: ["Dynamic features", "Rapid development", "Data science"],
      },
    },
    "C++": {
      TypeScript: {
        description: "Transition from systems programming to modern web development with type safety.",
        similarities: ["Static typing", "Object-oriented", "Performance focus"],
        differences: ["Web runtime", "Garbage collection", "Different syntax"],
        focus: ["Web development", "Type system", "Modern JavaScript features"],
      },
      Rust: {
        description: "Modern systems programming with memory safety without garbage collection.",
        similarities: ["Systems programming", "Performance", "Memory control"],
        differences: ["Ownership model", "Modern syntax", "Safety guarantees"],
        focus: ["Ownership", "Safety", "Modern tooling"],
      },
    },
  }

  const analysis = transitions[currentLang]?.[targetLang]
  if (analysis) {
    return analysis
  }

  // Generic fallback
  return {
    description: `Learn ${targetLang} by building on your ${currentLang} foundation.`,
    similarities: ["Programming fundamentals", "Problem-solving skills"],
    differences: ["Syntax", "Paradigms", "Ecosystem"],
    focus: ["Core concepts", "Best practices", "Practical application"],
  }
}

function generateIntelligentModules(
  currentLang: string,
  targetLang: string,
  skillLevel: string,
  goals: string[],
  analysis: any,
) {
  const baseModules = [
    {
      id: 1,
      title: `${targetLang} Fundamentals for ${currentLang} Developers`,
      description: `Learn ${targetLang} syntax and core concepts by comparing with your ${currentLang} knowledge`,
      type: "lesson",
      status: "available",
      unlocked: true,
      completed: false,
      xp: 150,
      estimatedTime: "3-4 hours",
      resources: [],
      learningObjectives: [
        `Understand ${targetLang} syntax compared to ${currentLang}`,
        `Set up ${targetLang} development environment`,
        `Write your first ${targetLang} programs`,
      ],
    },
    {
      id: 2,
      title: "Data Types and Variables",
      description: `Master ${targetLang} data types and variable handling`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 175,
      estimatedTime: "2-3 hours",
      resources: [],
      learningObjectives: [
        `Work with ${targetLang} primitive types`,
        `Understand type conversion and casting`,
        `Handle collections and data structures`,
      ],
    },
    {
      id: 3,
      title: "Control Flow and Functions",
      description: `Learn ${targetLang} control structures and function definitions`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 200,
      estimatedTime: "3-4 hours",
      resources: [],
      learningObjectives: [
        `Implement conditional logic in ${targetLang}`,
        `Use loops and iteration patterns`,
        `Define and call functions effectively`,
      ],
    },
    {
      id: 4,
      title: "Object-Oriented Programming",
      description: `Understand ${targetLang} OOP concepts and patterns`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 225,
      estimatedTime: "4-5 hours",
      resources: [],
      learningObjectives: [
        `Create classes and objects in ${targetLang}`,
        `Implement inheritance and polymorphism`,
        `Apply design patterns effectively`,
      ],
    },
    {
      id: 5,
      title: "Error Handling and Debugging",
      description: `Master ${targetLang} error handling and debugging techniques`,
      type: "lesson",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 200,
      estimatedTime: "3-4 hours",
      resources: [],
      learningObjectives: [
        `Handle exceptions and errors gracefully`,
        `Use debugging tools and techniques`,
        `Write robust, error-resistant code`,
      ],
    },
  ]

  // Add goal-specific modules
  if (goals.includes("Web Development")) {
    baseModules.push({
      id: baseModules.length + 1,
      title: `${targetLang} for Web Development`,
      description: `Build web applications using ${targetLang}`,
      type: "project",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 300,
      estimatedTime: "5-6 hours",
      resources: [],
      learningObjectives: [
        `Create web servers with ${targetLang}`,
        `Handle HTTP requests and responses`,
        `Build RESTful APIs`,
      ],
    })
  }

  if (goals.includes("Data Science")) {
    baseModules.push({
      id: baseModules.length + 1,
      title: `${targetLang} for Data Analysis`,
      description: `Use ${targetLang} for data science and analytics`,
      type: "project",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 350,
      estimatedTime: "6-7 hours",
      resources: [],
      learningObjectives: [
        `Work with data manipulation libraries`,
        `Perform statistical analysis`,
        `Create data visualizations`,
      ],
    })
  }

  if (goals.includes("Mobile Development")) {
    baseModules.push({
      id: baseModules.length + 1,
      title: `${targetLang} Mobile Development`,
      description: `Build mobile applications with ${targetLang}`,
      type: "project",
      status: "locked",
      unlocked: false,
      completed: false,
      xp: 400,
      estimatedTime: "7-8 hours",
      resources: [],
      learningObjectives: [`Create mobile app interfaces`, `Handle device-specific features`, `Deploy to app stores`],
    })
  }

  // Add final project
  baseModules.push({
    id: baseModules.length + 1,
    title: `Capstone Project: ${targetLang} Application`,
    description: `Build a complete application showcasing your ${targetLang} skills`,
    type: "project",
    status: "locked",
    unlocked: false,
    completed: false,
    xp: 500,
    estimatedTime: "8-10 hours",
    resources: [],
    learningObjectives: [
      `Apply all learned ${targetLang} concepts`,
      `Build a production-ready application`,
      `Deploy and share your project`,
    ],
  })

  return baseModules
}

function calculateEstimatedHours(modules: any[], timeCommitment: string) {
  const totalHours = modules.reduce((sum, module) => {
    const hours = Number.parseInt(module.estimatedTime.split("-")[0]) || 3
    return sum + hours
  }, 0)

  // Adjust based on time commitment
  if (timeCommitment.includes("1-2 hours")) return Math.ceil(totalHours * 1.5)
  if (timeCommitment.includes("10+")) return Math.ceil(totalHours * 0.8)
  return totalHours
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
