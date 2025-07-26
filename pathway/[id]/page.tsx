"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Space3DMap } from "@/components/space-3d-map"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Rocket, Star, Trophy, Crown, Target, Play, BookOpen, Code, Zap } from "lucide-react"
import Link from "next/link"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: Resource[]
  personalizedFor?: string
  learningObjectives?: string[]
  landmark?: string
  biome?: string
  game_theme: {
    world: string
    icon: string
    color_primary: string
    color_secondary: string
    completion_effect: string
    unlock_animation: string
  }
  estimated_hours: number
  xp_reward: number
  level_requirement: number
}

interface Resource {
  type: string
  title: string
  duration?: string
  timeSegment?: string
  pages?: number
  difficulty?: string
  url?: string
  whyPerfect?: string
  focusArea?: string
}

interface Pathway {
  id: string
  title: string
  from: string
  to: string
  progress: number
  totalModules: number
  completedModules: number
  estimatedHours: number
  difficulty: string
  badges: string[]
  modules: Module[]
  userAnalysis?: {
    skill_gap_analysis: string[]
    learning_style_optimization: {
      preferred_content_types: string[]
      session_length: string
      difficulty_ramp: string
    }
  }
}

export default function PathwayPage() {
  const params = useParams()
  const router = useRouter()
  const [pathway, setPathway] = useState<Pathway | null>(null)
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [userLevel, setUserLevel] = useState(1)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setUserLevel(parsedUser.level || 1)
      setTotalXP(parsedUser.totalXP || 0)
    }

    // Load pathway data
    const pathways = localStorage.getItem("pathways")
    if (pathways) {
      const allPathways = JSON.parse(pathways)
      const currentPathway = allPathways.find((p: Pathway) => p.id === params.id)
      if (currentPathway) {
        // Ensure modules have proper structure with game themes
        if (currentPathway.modules && currentPathway.modules.length > 0) {
          currentPathway.modules = currentPathway.modules.map((module: any, index: number) => ({
            ...module,
            unlocked: index === 0 || currentPathway.modules[index - 1]?.completed || false,
            completed: module.completed || false,
            // Add default game theme if missing
            game_theme: module.game_theme || {
              world: `World ${index + 1}`,
              icon: "🎯",
              color_primary: "#3B82F6",
              color_secondary: "#93C5FD",
              completion_effect: "sparkle",
              unlock_animation: "fade_in",
            },
            xp_reward: module.xp_reward || (index + 1) * 100,
            level_requirement: module.level_requirement || index,
          }))
        }
        setPathway(currentPathway)
      }
    }
  }, [params.id])

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return
    setSelectedModule(module)
  }

  const handleModuleComplete = (moduleId: number) => {
    if (!pathway) return

    const completedModule = pathway.modules.find((m) => m.id === moduleId)
    const xpGained = completedModule?.xp_reward || 100

    const updatedModules = pathway.modules.map((module) => {
      if (module.id === moduleId) {
        return { ...module, completed: true }
      }
      if (module.id === moduleId + 1) {
        return { ...module, unlocked: true }
      }
      return module
    })

    const completedCount = updatedModules.filter((m) => m.completed).length
    const progress = Math.round((completedCount / updatedModules.length) * 100)

    const updatedPathway = {
      ...pathway,
      modules: updatedModules,
      completedModules: completedCount,
      progress,
      total_xp: (pathway.total_xp || 0) + xpGained,
    }

    setPathway(updatedPathway)

    // Update user XP and level
    const newTotalXP = totalXP + xpGained
    const newLevel = Math.floor(newTotalXP / 1000) + 1
    setTotalXP(newTotalXP)
    setUserLevel(newLevel)

    // Update localStorage
    const pathways = JSON.parse(localStorage.getItem("pathways") || "[]")
    const updatedPathways = pathways.map((p: Pathway) => (p.id === pathway.id ? updatedPathway : p))
    localStorage.setItem("pathways", JSON.stringify(updatedPathways))

    // Update user data
    if (user) {
      const updatedUser = { ...user, level: newLevel, totalXP: newTotalXP }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    // Award badges for milestones
    if (completedCount === 1 || completedCount % 3 === 0) {
      const newBadge = `${completedCount === 1 ? "First Quest" : `${completedCount} Quests`} Completed`
      if (!updatedPathway.badges.includes(newBadge)) {
        updatedPathway.badges.push(newBadge)
      }
    }
  }

  if (!pathway || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-purple-400 border-b-transparent rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Loading Your Learning Universe</h2>
            <p className="text-gray-600">Preparing your personalized adventure...</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-500">Brilliant.org-style experience loading</span>
            <Zap className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Space Header */}
      <header className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Mission Control
              </Button>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-6 h-6 text-amber-500" />
                  <span className="text-2xl font-bold text-gray-800">Level {userLevel}</span>
                </div>
                <div className="text-sm text-gray-600">{totalXP} XP</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-6 h-6 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-800">
                    {pathway.completedModules}/{pathway.totalModules}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Planets Explored</div>
              </div>
            </div>
          </div>

          {/* Pathway Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {pathway.title}
                  </h1>
                  <p className="text-gray-600 text-lg">{pathway.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-lg">
                  {pathway.from} → {pathway.to}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 px-4 py-2 text-lg">{pathway.difficulty}</Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                  {pathway.estimatedHours}h journey
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-gray-700">Mission Progress</span>
                  <span className="text-lg font-bold text-gray-800">{pathway.progress}%</span>
                </div>
                <Progress value={pathway.progress} className="h-3" />
              </div>
            </div>

            <div>
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  Space Achievements
                </h3>
                <div className="space-y-3">
                  {pathway.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-amber-800 font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* 3D Space Map */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Your Space Exploration Map</h2>
            <p className="text-xl text-gray-600">Navigate through planets and master {pathway.to}</p>
          </div>

          <Space3DMap
            modules={pathway.modules}
            onModuleClick={handleModuleClick}
            onComplete={handleModuleComplete}
            userLevel={userLevel}
            totalXP={totalXP}
            currentProgress={pathway.progress}
          />
        </div>

        {/* Module Details Panel */}
        {selectedModule && (
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${selectedModule.game_theme.color_primary}, ${selectedModule.game_theme.color_secondary})`,
                    }}
                  >
                    {selectedModule.game_theme.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">{selectedModule.game_theme.world}</h3>
                    <p className="text-gray-600 text-lg">{selectedModule.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-blue-600 font-medium">Resources</div>
                    <div className="text-xl font-bold text-blue-900">{selectedModule.resources.length}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                    <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-green-600 font-medium">Time</div>
                    <div className="text-xl font-bold text-green-900">{selectedModule.estimated_hours}h</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-purple-600 font-medium">XP</div>
                    <div className="text-xl font-bold text-purple-900">{selectedModule.xp_reward}</div>
                  </div>
                </div>

                <Button
                  className="w-full text-white shadow-lg text-lg py-6"
                  style={{
                    background: `linear-gradient(135deg, ${selectedModule.game_theme.color_primary}, ${selectedModule.game_theme.color_secondary})`,
                  }}
                  disabled={!selectedModule.unlocked}
                >
                  <Play className="w-5 h-5 mr-3" />
                  {selectedModule.completed ? "Review Planet" : "Explore Planet"}
                </Button>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Learning Resources</h4>
                <div className="space-y-4">
                  {selectedModule.resources.map((resource: any, index: number) => (
                    <Card
                      key={index}
                      className="p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                          {resource.type === "video" ? (
                            <Play className="w-6 h-6 text-blue-600" />
                          ) : resource.type === "interactive" ? (
                            <Code className="w-6 h-6 text-purple-600" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800">{resource.title}</h5>
                          <p className="text-gray-600 text-sm capitalize">{resource.type}</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-gray-300">
                          Start
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-3xl shadow-lg">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Target className="w-8 h-8 mr-3 text-blue-600" />
            AI Mission Analysis
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Skill Gap Analysis</h4>
              <div className="space-y-3">
                {pathway.userAnalysis?.skill_gap_analysis.map((gap, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Learning Optimization</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Session Length:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {pathway.userAnalysis?.learning_style_optimization.session_length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Difficulty Ramp:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {pathway.userAnalysis?.learning_style_optimization.difficulty_ramp}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Content Types:</span>
                  <div className="flex space-x-2">
                    {pathway.userAnalysis?.learning_style_optimization.preferred_content_types.map(
                      (type: string, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                          {type}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
