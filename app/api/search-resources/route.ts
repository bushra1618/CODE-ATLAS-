import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { searchQueries, currentLanguage, targetLanguage, skillLevel } = await request.json()

    console.log("🔍 Searching for learning resources...")

    // Simulate resource search with realistic data
    const resources = await searchAndCurateResources(searchQueries, currentLanguage, targetLanguage, skillLevel)

    return NextResponse.json({
      success: true,
      resources,
    })
  } catch (error) {
    console.error("❌ Error searching resources:", error)
    return NextResponse.json({ success: false, error: "Failed to search resources" }, { status: 500 })
  }
}

async function searchAndCurateResources(
  queries: string[],
  currentLang: string,
  targetLang: string,
  skillLevel: string,
) {
  // In a real implementation, this would:
  // 1. Use Google Custom Search API or similar
  // 2. Scrape YouTube for educational videos
  // 3. Search GitHub for example repositories
  // 4. Find relevant documentation pages
  // 5. Score and rank resources by quality

  const resourceTypes = ["video", "documentation", "interactive", "article", "exercise"]
  const difficulties = ["beginner", "intermediate", "advanced"]

  const resources = queries.flatMap((query, queryIndex) => {
    return resourceTypes.map((type, typeIndex) => {
      const resourceId = `${queryIndex}_${typeIndex}`

      // Generate realistic URLs based on resource type
      let url = ""
      let duration = undefined
      let timeSegment = undefined
      let section = undefined

      switch (type) {
        case "video":
          url = `https://www.youtube.com/watch?v=${generateYouTubeId()}`
          duration = `${Math.floor(Math.random() * 30) + 15} minutes`
          timeSegment = `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}-${Math.floor(Math.random() * 15) + 20}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
          break
        case "documentation":
          url = `https://docs.${targetLang.toLowerCase()}.org/${query.toLowerCase().replace(/\s+/g, "-")}`
          section = ["getting-started", "core-concepts", "advanced-features", "best-practices"][
            Math.floor(Math.random() * 4)
          ]
          break
        case "interactive":
          url = `https://replit.com/@${targetLang.toLowerCase()}/${query.toLowerCase().replace(/\s+/g, "-")}`
          break
        case "article":
          url = `https://medium.com/@developer/${query.toLowerCase().replace(/\s+/g, "-")}-${generateRandomId()}`
          break
        case "exercise":
          url = `https://codepen.io/collection/${generateRandomId()}`
          break
      }

      return {
        id: resourceId,
        type,
        title: `${capitalizeWords(query)} - ${capitalizeWords(type)} Tutorial`,
        url,
        duration,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        description: `Learn ${query} with this comprehensive ${type} resource tailored for ${currentLang} developers transitioning to ${targetLang}.`,
        aiCurated: true,
        qualityScore: 8.0 + Math.random() * 2.0, // Score between 8.0-10.0
        timeSegment,
        section,
        communityRating: 4.2 + Math.random() * 0.8, // Rating between 4.2-5.0
        lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last year
      }
    })
  })

  // Sort by quality score and return top resources
  return resources.sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 15)
}

function generateYouTubeId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  let result = ""
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}
