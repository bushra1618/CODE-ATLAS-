import { type NextRequest, NextResponse } from "next/server"
import { grokAPI } from "../../lib/grok-api"

export async function POST(request: NextRequest) {
  try {
    const { currentLanguage, targetLanguage, skillLevel, goals, githubProfile, sampleCode } = await request.json()

    // Validate required fields
    if (!currentLanguage || !targetLanguage || !skillLevel || !goals) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: currentLanguage, targetLanguage, skillLevel, goals" 
        },
        { status: 400 }
      )
    }

    console.log("🚀 Generating AI pathway with Grok...")
    console.log("📝 Parameters:", { currentLanguage, targetLanguage, skillLevel, goals })

    // Use Grok API to generate the learning pathway with specific language focus
    const pathway = await grokAPI.generateLearningPathway({
      currentLanguage,
      targetLanguage,
      skillLevel,
      goals,
      githubProfile,
      sampleCode
    })

    // Enhance pathway with additional metadata
    pathway.id = pathway.id || Date.now().toString()
    pathway.createdAt = new Date().toISOString()
    pathway.generatedBy = "Grok AI"

    console.log("✅ Pathway generated successfully for", targetLanguage)

    return NextResponse.json({
      success: true,
      pathway,
      generatedBy: "Grok AI"
    })

  } catch (error) {
    console.error("❌ Error generating pathway:", error)
    
    // Get the request data for fallback
    const body = await request.clone().json().catch(() => ({}))
    
    // Create language-specific fallback pathway
    const fallbackPathway = await createLanguageSpecificFallbackPathway(
      body.currentLanguage || "JavaScript",
      body.targetLanguage || "Python",
      body.skillLevel || "intermediate",
      body.goals || "Learn new language"
    )
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate pathway with Grok AI",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        pathway: fallbackPathway,
        generatedBy: "Fallback System"
      },
      { status: 500 }
    )
  }
}

// Language-specific fallback pathway generation
async function createLanguageSpecificFallbackPathway(
  currentLanguage: string,
  targetLanguage: string,
  skillLevel: string,
  goals: string
) {
  // Language-specific learning objectives and resources
  const languageSpecificContent = getLanguageSpecificContent(targetLanguage, currentLanguage, skillLevel)

  return {
    id: Date.now().toString(),
    title: `${currentLanguage} to ${targetLanguage} Learning Path`,
    description: `A structured pathway to transition from ${currentLanguage} to ${targetLanguage}. ${languageSpecificContent.description}`,
    estimatedDuration: "6-8 weeks",
    currentLanguage,
    targetLanguage,
    skillLevel,
    goals,
    personalizedFor: `Designed specifically for ${skillLevel} ${currentLanguage} developers learning ${targetLanguage}`,
    modules: languageSpecificContent.modules,
    totalXP: 500,
    currentXP: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    generatedBy: "Language-Specific Fallback System"
  }
}

function getLanguageSpecificContent(targetLanguage: string, currentLanguage: string, skillLevel: string) {
  const content: { [key: string]: any } = {
    "C++": {
      description: "Focus on memory management, object-oriented programming, and systems programming concepts.",
      modules: [
        {
          id: "1",
          name: "C++ Fundamentals and Syntax",
          description: "Learn C++ syntax, data types, and basic programming constructs",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand C++ syntax and compilation process",
            "Master data types, variables, and operators",
            "Learn control structures and functions"
          ],
          resources: [
            {
              type: "tutorial",
              title: "C++ Tutorial for Beginners",
              description: "Complete introduction to C++ programming",
              estimatedTime: "2 hours",
              difficulty: "beginner",
              language: "C++"
            },
            {
              type: "documentation",
              title: "C++ Reference Documentation",
              description: "Official C++ language reference",
              estimatedTime: "1 hour",
              difficulty: "intermediate",
              language: "C++"
            }
          ],
          xp: 100,
          completed: false
        },
        {
          id: "2",
          name: "Object-Oriented Programming in C++",
          description: "Master classes, objects, inheritance, and polymorphism",
          duration: "3 weeks",
          difficulty: "intermediate",
          learningObjectives: [
            "Understand classes and objects",
            "Master inheritance and polymorphism",
            "Learn about constructors and destructors"
          ],
          resources: [
            {
              type: "tutorial",
              title: "C++ OOP Concepts",
              description: "Deep dive into object-oriented programming with C++",
              estimatedTime: "3 hours",
              difficulty: "intermediate",
              language: "C++"
            }
          ],
          xp: 200,
          completed: false
        }
      ]
    },
    "Python": {
      description: "Focus on Python's simplicity, data science capabilities, and extensive libraries.",
      modules: [
        {
          id: "1",
          name: "Python Basics and Syntax",
          description: "Learn Python fundamentals and Pythonic programming",
          duration: "1.5 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand Python syntax and indentation",
            "Master Python data structures",
            "Learn list comprehensions and generators"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Python for Beginners",
              description: "Complete Python programming tutorial",
              estimatedTime: "2 hours",
              difficulty: "beginner",
              language: "Python"
            }
          ],
          xp: 100,
          completed: false
        }
      ]
    },
    "Java": {
      description: "Focus on object-oriented programming, JVM concepts, and enterprise development.",
      modules: [
        {
          id: "1",
          name: "Java Fundamentals",
          description: "Learn Java syntax, OOP concepts, and JVM basics",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand Java syntax and compilation",
            "Master Java OOP principles",
            "Learn about packages and access modifiers"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Java Programming Tutorial",
              description: "Comprehensive Java programming guide",
              estimatedTime: "3 hours",
              difficulty: "beginner",
              language: "Java"
            }
          ],
          xp: 120,
          completed: false
        }
      ]
    },
    "JavaScript": {
      description: "Focus on modern JavaScript, DOM manipulation, and web development.",
      modules: [
        {
          id: "1",
          name: "Modern JavaScript Fundamentals",
          description: "Learn ES6+ features and JavaScript best practices",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Master ES6+ syntax and features",
            "Understand closures and prototypes",
            "Learn async/await and promises"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Modern JavaScript Tutorial",
              description: "Complete guide to modern JavaScript",
              estimatedTime: "2.5 hours",
              difficulty: "beginner",
              language: "JavaScript"
            }
          ],
          xp: 100,
          completed: false
        }
      ]
    },
    "Go": {
      description: "Focus on Go's simplicity, concurrency, and systems programming.",
      modules: [
        {
          id: "1",
          name: "Go Language Fundamentals",
          description: "Learn Go syntax, goroutines, and channels",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand Go syntax and package system",
            "Master goroutines and concurrency",
            "Learn about interfaces and structs"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Go Programming Tutorial",
              description: "Complete introduction to Go programming",
              estimatedTime: "2 hours",
              difficulty: "beginner",
              language: "Go"
            }
          ],
          xp: 110,
          completed: false
        }
      ]
    },
    "Rust": {
      description: "Focus on Rust's ownership system, memory safety, and systems programming.",
      modules: [
        {
          id: "1",
          name: "Rust Fundamentals and Ownership",
          description: "Learn Rust syntax and the unique ownership system",
          duration: "3 weeks",
          difficulty: "intermediate",
          learningObjectives: [
            "Understand Rust syntax and cargo",
            "Master ownership, borrowing, and lifetimes",
            "Learn about structs and enums"
          ],
          resources: [
            {
              type: "tutorial",
              title: "The Rust Programming Language",
              description: "Official Rust book and tutorial",
              estimatedTime: "4 hours",
              difficulty: "intermediate",
              language: "Rust"
            }
          ],
          xp: 150,
          completed: false
        }
      ]
    }
  }

  // Return language-specific content or default
  return content[targetLanguage] || {
    description: `Learn ${targetLanguage} programming concepts and best practices.`,
    modules: [
      {
        id: "1",
        name: `${targetLanguage} Fundamentals`,
        description: `Core concepts of ${targetLanguage} programming`,
        duration: "2 weeks",
        difficulty: "beginner",
        learningObjectives: [
          `Understand ${targetLanguage} syntax`,
          `Learn ${targetLanguage} best practices`,
          `Build simple ${targetLanguage} programs`
        ],
        resources: [
          {
            type: "tutorial",
            title: `${targetLanguage} Programming Tutorial`,
            description: `Introduction to ${targetLanguage} programming`,
            estimatedTime: "2 hours",
            difficulty: "beginner",
            language: targetLanguage
          }
        ],
        xp: 100,
        completed: false
      }
    ]
  }
}
