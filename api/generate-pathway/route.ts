import { type NextRequest, NextResponse } from "next/server"
import { grokAPI } from "../../lib/grok-api"

export async function POST(request: NextRequest) {
  try {
    const { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment, githubProfile } = await request.json()

    console.log("🚀 Starting pathway generation with Grok for", targetLanguage)
    console.log("📝 User profile:", { currentLanguage, targetLanguage, skillLevel, goals, timeCommitment })

    // Validate required fields
    if (!currentLanguage || !targetLanguage || !skillLevel || !goals) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Please provide currentLanguage, targetLanguage, skillLevel, and goals",
        },
        { status: 400 },
      )
    }

    // Use Grok API to generate the pathway
    const pathway = await grokAPI.generateLearningPathway({
      currentLanguage,
      targetLanguage,
      skillLevel,
      goals,
      githubProfile
    })

    // Enhance with metadata
    pathway.timeCommitment = timeCommitment
    pathway.createdAt = new Date().toISOString()
    pathway.generatedBy = "Grok AI"

    console.log("✅ Pathway generated successfully for", targetLanguage, "with Grok AI")

    return NextResponse.json({
      success: true,
      pathway,
      message: `Pathway generated successfully for ${targetLanguage} using Grok AI`,
    })

  } catch (error) {
    console.error("❌ Error generating pathway with Grok:", error)

    // Get request data for fallback
    const body = await request.clone().json().catch(() => ({}))

    // Fallback pathway
    const fallbackPathway = createLanguageSpecificFallbackPathway(
      body.currentLanguage || "JavaScript",
      body.targetLanguage || "Python",
      body.skillLevel || "intermediate",
      body.goals || "Learn new language",
      body.timeCommitment || "6-8 weeks"
    )

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate pathway with Grok AI",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        pathway: fallbackPathway,
      },
      { status: 500 },
    )
  }
}

function createLanguageSpecificFallbackPathway(
  currentLanguage: string,
  targetLanguage: string,
  skillLevel: string,
  goals: string,
  timeCommitment: string
) {
  // Language-specific pathway content
  const languageSpecificContent = getLanguageSpecificPathwayContent(targetLanguage, currentLanguage, skillLevel)

  return {
    id: Date.now().toString(),
    title: `${currentLanguage} to ${targetLanguage} Learning Path`,
    description: `Structured learning pathway from ${currentLanguage} to ${targetLanguage}. ${languageSpecificContent.description}`,
    estimatedDuration: timeCommitment,
    currentLanguage,
    targetLanguage,
    skillLevel,
    goals,
    timeCommitment,
    personalizedFor: `Designed specifically for ${skillLevel} ${currentLanguage} developers transitioning to ${targetLanguage}`,
    modules: languageSpecificContent.modules,
    totalXP: languageSpecificContent.totalXP,
    currentXP: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    generatedBy: "Language-Specific Fallback System"
  }
}

function getLanguageSpecificPathwayContent(targetLanguage: string, currentLanguage: string, skillLevel: string) {
  const pathwayContent: { [key: string]: any } = {
    "C++": {
      description: "Master C++ with focus on memory management, OOP, and systems programming.",
      totalXP: 800,
      modules: [
        {
          id: "1",
          name: "C++ Fundamentals and Syntax",
          description: "Learn C++ syntax, compilation, and basic programming concepts",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand C++ compilation process",
            "Master basic syntax and data types",
            "Learn about pointers and references"
          ],
          resources: [
            {
              type: "tutorial",
              title: "C++ Programming Fundamentals",
              description: "Complete introduction to C++ programming",
              language: "C++",
              estimatedTime: "3 hours",
              difficulty: "beginner"
            },
            {
              type: "documentation",
              title: "C++ Reference Manual",
              description: "Official C++ language documentation",
              language: "C++",
              estimatedTime: "1 hour",
              difficulty: "intermediate"
            }
          ],
          xp: 150,
          completed: false
        },
        {
          id: "2",
          name: "Memory Management and Pointers",
          description: "Master C++ memory management, pointers, and dynamic allocation",
          duration: "3 weeks",
          difficulty: "intermediate",
          learningObjectives: [
            "Understand stack vs heap memory",
            "Master pointer arithmetic and dynamic allocation",
            "Learn smart pointers and RAII"
          ],
          resources: [
            {
              type: "tutorial",
              title: "C++ Memory Management Guide",
              description: "Comprehensive guide to C++ memory management",
              language: "C++",
              estimatedTime: "4 hours",
              difficulty: "intermediate"
            }
          ],
          xp: 200,
          completed: false
        },
        {
          id: "3",
          name: "Object-Oriented Programming in C++",
          description: "Master classes, inheritance, polymorphism, and advanced OOP concepts",
          duration: "3 weeks",
          difficulty: "advanced",
          learningObjectives: [
            "Design complex class hierarchies",
            "Implement virtual functions and polymorphism",
            "Master operator overloading and templates"
          ],
          resources: [
            {
              type: "project",
              title: "C++ OOP Design Project",
              description: "Build a complex C++ application using OOP principles",
              language: "C++",
              estimatedTime: "8 hours",
              difficulty: "advanced"
            }
          ],
          xp: 250,
          completed: false
        }
      ]
    },
    "Python": {
      description: "Learn Python with focus on readability, data science, and rapid development.",
      totalXP: 600,
      modules: [
        {
          id: "1",
          name: "Python Basics and Pythonic Programming",
          description: "Learn Python fundamentals and writing idiomatic Python code",
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
              title: "Python Programming for Beginners",
              description: "Complete Python programming tutorial",
              language: "Python",
              estimatedTime: "2 hours",
              difficulty: "beginner"
            }
          ],
          xp: 120,
          completed: false
        },
        {
          id: "2",
          name: "Python Libraries and Frameworks",
          description: "Explore Python's extensive library ecosystem",
          duration: "2 weeks",
          difficulty: "intermediate",
          learningObjectives: [
            "Master popular Python libraries",
            "Learn web development with Flask/Django",
            "Understand data science with pandas/numpy"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Python Libraries Deep Dive",
              description: "Comprehensive guide to Python libraries",
              language: "Python",
              estimatedTime: "3 hours",
              difficulty: "intermediate"
            }
          ],
          xp: 180,
          completed: false
        }
      ]
    },
    "Java": {
      description: "Master Java with focus on enterprise development, OOP, and the JVM ecosystem.",
      totalXP: 750,
      modules: [
        {
          id: "1",
          name: "Java Fundamentals and OOP",
          description: "Learn Java syntax, OOP principles, and the Java ecosystem",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand Java compilation and JVM",
            "Master Java OOP concepts",
            "Learn about packages and access modifiers"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Java Programming Complete Course",
              description: "Comprehensive Java programming guide",
              language: "Java",
              estimatedTime: "3 hours",
              difficulty: "beginner"
            }
          ],
          xp: 140,
          completed: false
        }
      ]
    },
    "Go": {
      description: "Learn Go with focus on simplicity, concurrency, and cloud-native development.",
      totalXP: 650,
      modules: [
        {
          id: "1",
          name: "Go Language Fundamentals",
          description: "Master Go syntax, goroutines, and channels",
          duration: "2 weeks",
          difficulty: "beginner",
          learningObjectives: [
            "Understand Go syntax and package system",
            "Master goroutines and concurrency patterns",
            "Learn interfaces and composition"
          ],
          resources: [
            {
              type: "tutorial",
              title: "Go Programming Language Tutorial",
              description: "Complete introduction to Go programming",
              language: "Go",
              estimatedTime: "2.5 hours",
              difficulty: "beginner"
            }
          ],
          xp: 130,
          completed: false
        }
      ]
    },
    "Rust": {
      description: "Master Rust with focus on memory safety, performance, and systems programming.",
      totalXP: 900,
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
            "Learn pattern matching and error handling"
          ],
          resources: [
            {
              type: "tutorial",
              title: "The Rust Programming Language Book",
              description: "Official comprehensive Rust tutorial",
              language: "Rust",
              estimatedTime: "5 hours",
              difficulty: "intermediate"
            }
          ],
          xp: 200,
          completed: false
        }
      ]
    },
    "JavaScript": {
      description: "Master modern JavaScript with focus on web development and asynchronous programming.",
      totalXP: 550,
      modules: [
        {
          id: "1",
          name: "Modern JavaScript and ES6+",
          description: "Learn modern JavaScript features and best practices",
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
              title: "Modern JavaScript Complete Guide",
              description: "Comprehensive modern JavaScript tutorial",
              language: "JavaScript",
              estimatedTime: "2.5 hours",
              difficulty: "beginner"
            }
          ],
          xp: 110,
          completed: false
        }
      ]
    }
  }

  // Return language-specific content or create generic fallback
  return pathwayContent[targetLanguage] || {
    description: `Learn ${targetLanguage} programming fundamentals and best practices.`,
    totalXP: 400,
    modules: [
      {
        id: "1",
        name: `${targetLanguage} Programming Fundamentals`,
        description: `Core concepts and syntax of ${targetLanguage}`,
        duration: "2 weeks",
        difficulty: "beginner",
        learningObjectives: [
          `Understand ${targetLanguage} syntax and conventions`,
          `Learn ${targetLanguage} development environment`,
          `Build basic ${targetLanguage} applications`
        ],
        resources: [
          {
            type: "tutorial",
            title: `${targetLanguage} Programming Tutorial`,
            description: `Introduction to ${targetLanguage} programming`,
            language: targetLanguage,
            estimatedTime: "2 hours",
            difficulty: "beginner"
          }
        ],
        xp: 100,
        completed: false
      },
      {
        id: "2",
        name: `Advanced ${targetLanguage} Concepts`,
        description: `Advanced features and patterns in ${targetLanguage}`,
        duration: "3 weeks",
        difficulty: "intermediate",
        learningObjectives: [
          `Master advanced ${targetLanguage} features`,
          `Understand ${targetLanguage} design patterns`,
          `Build complex ${targetLanguage} applications`
        ],
        resources: [
          {
            type: "project",
            title: `${targetLanguage} Advanced Project`,
            description: `Build a complex application using ${targetLanguage}`,
            language: targetLanguage,
            estimatedTime: "4 hours",
            difficulty: "intermediate"
          }
        ],
        xp: 150,
        completed: false
      }
    ]
  }
}
