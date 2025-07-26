"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Code, Trophy, Star, Plus, BookOpen, Zap, Target, LogOut, Crown } from "lucide-react"
import { PathwayCreator } from "@/components/pathway-creator"
import { BrilliantGameMap } from "@/components/brilliant-game-map"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  totalXP: number
  joinedAt: string
}

interface Pathway {
  id: string
  title: string
  description: string
  from: string
  to: string
  progress: number
  totalModules: number
  completedModules: number
  estimatedHours: string
  difficulty: string
  badges: string[]
  modules: any[]
  userAnalysis: any
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [pathways, setPathways] = useState<Pathway[]>([])
  const [showPathwayCreator, setShowPathwayCreator] = useState(false)
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      window.location.href = "/"
      return
    }

    // Load user data
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // Load pathways
      const pathwaysData = localStorage.getItem("pathways")
      if (pathwaysData) {
        setPathways(JSON.parse(pathwaysData))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("pathways")
    window.location.href = "/"
  }

  const handlePathwayCreated = (pathway: Pathway) => {
    setShowPathwayCreator(false)
    const updatedPathways = [...pathways, pathway]
    setPathways(updatedPathways)
    localStorage.setItem("pathways", JSON.stringify(updatedPathways))
  }

  const handleModuleClick = (module: any) => {
    console.log("Module clicked:", module)
    // Handle module interaction
  }

  const handleModuleComplete = (moduleId: number) => {
    if (!selectedPathway) return

    // Update module completion
    const updatedPathway = {
      ...selectedPathway,
      modules: selectedPathway.modules.map((module) =>
        module.id === moduleId ? { ...module, completed: true } : module,
      ),
    }

    // Update pathways
    const updatedPathways = pathways.map((p) => (p.id === selectedPathway.id ? updatedPathway : p))

    setPathways(updatedPathways)
    setSelectedPathway(updatedPathway)
    localStorage.setItem("pathways", JSON.stringify(updatedPathways))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Code className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please sign in to access your dashboard</p>
          <Button onClick={() => (window.location.href = "/")}>Go to Homepage</Button>
        </Card>
      </div>
    )
  }

  if (selectedPathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedPathway(null)}
              className="border-pink-200 text-gray-700 hover:bg-pink-50"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedPathway.title}</h1>
          </div>

          <BrilliantGameMap
            modules={selectedPathway.modules || []}
            onModuleClick={handleModuleClick}
            onComplete={handleModuleComplete}
            userLevel={user.level}
            totalXP={user.totalXP}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-purple-400 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Code Atlas
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Level {user.level}</span>
              </div>

              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-400 text-white">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>

              <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total XP</p>
                  <p className="text-2xl font-bold text-gray-800">{user.totalXP}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pathways</p>
                  <p className="text-2xl font-bold text-gray-800">{pathways.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pathways.reduce((acc, p) => acc + p.completedModules, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-800">7 days</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pathways Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Learning Pathways</h2>
            <Button
              onClick={() => setShowPathwayCreator(true)}
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Pathway
            </Button>
          </div>

          {pathways.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Learning Journey</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first personalized learning pathway and begin mastering new programming languages with AI
                  guidance.
                </p>
                <Button
                  onClick={() => setShowPathwayCreator(true)}
                  className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Pathway
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pathways.map((pathway) => (
                <Card
                  key={pathway.id}
                  className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedPathway(pathway)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {pathway.title}
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200">
                        {pathway.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{pathway.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-800">
                          {pathway.completedModules}/{pathway.totalModules} modules
                        </span>
                      </div>
                      <Progress value={(pathway.completedModules / pathway.totalModules) * 100} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs border-pink-200 text-pink-700">
                            {pathway.from}
                          </Badge>
                          <span className="text-gray-400">→</span>
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                            {pathway.to}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">{pathway.estimatedHours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pathways.length > 0 ? (
                pathways.slice(0, 3).map((pathway) => (
                  <div
                    key={pathway.id}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{pathway.title}</p>
                      <p className="text-sm text-gray-600">
                        {pathway.completedModules} of {pathway.totalModules} modules completed
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200">
                      {Math.round((pathway.completedModules / pathway.totalModules) * 100)}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No activity yet. Create your first pathway to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Pathway Creator Modal */}
      {showPathwayCreator && (
        <PathwayCreator onClose={() => setShowPathwayCreator(false)} onPathwayCreated={handlePathwayCreated} />
      )}
    </div>
  )
}
