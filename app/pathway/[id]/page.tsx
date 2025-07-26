"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { EnhancedTreasureMap } from "@/enhanced-treasure-map"
import { ResourceViewer } from "@/resource-viewer"
import { ArrowLeft, Map, List, BookOpen, Trophy, Target, Loader2 } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  status: "available" | "locked" | "completed"
  unlocked: boolean
  completed: boolean
  xp: number
  estimatedTime: string
  resources: Resource[]
  type: "lesson" | "project" | "quiz" | "challenge"
  learningObjectives?: string[]
}

interface Resource {
  id: string
  type: "video" | "article" | "documentation" | "interactive" | "exercise"
  title: string
  url: string
  duration?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  aiCurated: boolean
  qualityScore: number
  timeSegment?: string
  section?: string
  whyPerfect?: string
}

interface Pathway {
  id: string
  title: string
  description: string
  currentLanguage: string
  targetLanguage: string
  skillLevel: string
  goals: string[]
  progress: number
  totalModules: number
  completedModules: number
  estimatedHours: number
  createdAt: string
  modules: Module[]
}

export default function PathwayPage() {
  const params = useParams()
  const router = useRouter()
  const [pathway, setPathway] = useState<Pathway | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"map" | "list" | "resource">("map")
  const [curatingModule, setCuratingModule] = useState<number | null>(null)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load pathway data
    const pathwaysData = localStorage.getItem("pathways")
    if (pathwaysData) {
      const pathways = JSON.parse(pathwaysData)
      const currentPathway = pathways.find((p: Pathway) => p.id === params.id)
      if (currentPathway) {
        setPathway(currentPathway)
      }
    }

    setIsLoading(false)
  }, [params.id, router])

  const curateResourcesForModule = async (module: Module) => {
    if (!pathway) return

    setCuratingModule(module.id)

    try {
      console.log(`🔍 Curating resources for module: ${module.title}`)

      const response = await fetch("/api/curate-resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleTitle: module.title,
          moduleDescription: module.description,
          currentLanguage: pathway.currentLanguage,
          targetLanguage: pathway.targetLanguage,
          skillLevel: pathway.skillLevel,
          userGoals: pathway.goals,
        }),
      })

      const data = await response.json()

      if (data.success && data.resources) {
        // Update the module with curated resources
        const updatedModules = pathway.modules.map((m) =>
          m.id === module.id ? { ...m, resources: data.resources } : m,
        )

        const updatedPathway = {
          ...pathway,
          modules: updatedModules,
        }

        setPathway(updatedPathway)

        // Update localStorage
        const pathwaysData = localStorage.getItem("pathways")
        if (pathwaysData) {
          const pathways = JSON.parse(pathwaysData)
          const updatedPathways = pathways.map((p: Pathway) => (p.id === pathway.id ? updatedPathway : p))
          localStorage.setItem("pathways", JSON.stringify(updatedPathways))
        }

        console.log(`✅ Resources curated for ${module.title}`)
      }
    } catch (error) {
      console.error("❌ Error curating resources:", error)
    } finally {
      setCuratingModule(null)
    }
  }

  const handleModuleClick = async (module: Module) => {
    if (module.status === "locked") return

    // If module has no resources, curate them first
    if (!module.resources || module.resources.length === 0) {
      await curateResourcesForModule(module)
    }

    setSelectedModule(module)
    setViewMode("resource")
  }

  const handleCompleteModule = (moduleId: number) => {
    if (!pathway) return

    const updatedModules = pathway.modules.map((module, index) => {
      if (module.id === moduleId) {
        return {
          ...module,
          status: "completed" as const,
          completed: true,
        }
      }
      // Unlock next module
      if (module.id === moduleId + 1 && module.status === "locked") {
        return {
          ...module,
          status: "available" as const,
          unlocked: true,
        }
      }
      return module
    })

    const completedCount = updatedModules.filter((m) => m.status === "completed").length
    const progress = Math.round((completedCount / updatedModules.length) * 100)

    const updatedPathway = {
      ...pathway,
      modules: updatedModules,
      completedModules: completedCount,
      progress,
    }

    setPathway(updatedPathway)

    // Update localStorage
    const pathwaysData = localStorage.getItem("pathways")
    if (pathwaysData) {
      const pathways = JSON.parse(pathwaysData)
      const updatedPathways = pathways.map((p: Pathway) => (p.id === pathway.id ? updatedPathway : p))
      localStorage.setItem("pathways", JSON.stringify(updatedPathways))
    }

    // Update user XP
    if (user) {
      const moduleXP = pathway.modules.find((m) => m.id === moduleId)?.xp || 100
      const newTotalXP = user.totalXP + moduleXP
      const newLevel = Math.floor(newTotalXP / 1000) + 1
      const updatedUser = { ...user, level: newLevel, totalXP: newTotalXP }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    setViewMode("map")
    setSelectedModule(null)
  }

  const handleResourceClick = (resource: Resource) => {
    let url = resource.url

    // Add timestamp for YouTube videos
    if (resource.timeSegment && url.includes("youtube.com")) {
      const [start] = resource.timeSegment.split("-")
      const [minutes, seconds] = start.split(":").map(Number)
      const totalSeconds = minutes * 60 + seconds
      url += `&t=${totalSeconds}s`
    }

    // Add section anchor for documentation
    if (resource.section && resource.type === "documentation") {
      url += `#${resource.section.toLowerCase().replace(/\s+/g, "-")}`
    }

    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading your pathway...</div>
        </div>
      </div>
    )
  }

  if (!pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-xl font-semibold text-gray-700 mb-4">Pathway not found</div>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pathway.title}</h1>
                <p className="text-sm text-gray-600">
                  {pathway.currentLanguage} → {pathway.targetLanguage}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white/60 rounded-lg p-1">
                <Button variant={viewMode === "map" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("map")}>
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{pathway.progress}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {pathway.completedModules}/{pathway.totalModules}
                </div>
                <div className="text-xs text-gray-600">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">Level {user?.level || 1}</div>
                <div className="text-xs text-gray-600">{user?.totalXP || 0} XP</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={pathway.progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Treasure Map View */}
        {viewMode === "map" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Your Learning Adventure
              </h2>
              <p className="text-gray-600">Navigate through your personalized learning pathway</p>
            </div>

            {curatingModule && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">AI is curating resources...</div>
                    <div className="text-sm text-blue-700">
                      Finding the perfect learning materials for Module {curatingModule}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <EnhancedTreasureMap modules={pathway.modules} onModuleClick={handleModuleClick} />
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                Learning Modules
              </h2>
              <p className="text-gray-600">Complete modules in order to unlock the next challenge</p>
            </div>

            <div className="grid gap-4">
              {pathway.modules.map((module) => (
                <Card
                  key={module.id}
                  className={`p-6 cursor-pointer transition-all ${
                    module.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : module.status === "available"
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400">{module.id}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-gray-600">{module.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{module.xp} XP</Badge>
                          <Badge variant="outline">{module.estimatedTime}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {module.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {module.status === "completed" && <Trophy className="w-8 h-8 text-yellow-500" />}
                      {module.status === "available" && (
                        <div className="text-blue-600">
                          <div className="text-sm font-semibold">Ready</div>
                          {curatingModule === module.id && <Loader2 className="w-4 h-4 animate-spin mx-auto mt-1" />}
                        </div>
                      )}
                      {module.status === "locked" && (
                        <div className="text-gray-400">
                          <div className="text-sm">Locked</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Resource View */}
        {viewMode === "resource" && selectedModule && (
          <ResourceViewer
            module={selectedModule}
            onResourceClick={handleResourceClick}
            onBack={() => setViewMode("map")}
            onComplete={() => handleCompleteModule(selectedModule.id)}
          />
        )}
      </main>
    </div>
  )
}
