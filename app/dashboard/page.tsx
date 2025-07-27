"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Code, Plus, Trophy, Target, Clock, Play, BookOpen, Zap, Settings, LogOut, MessageSquare } from "lucide-react"
import { PathwayCreator } from "@/pathway-creator"
import { AiQuestionAnswer } from "@/components/ai-question-answer"

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
  modules: any[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null)
  const [pathways, setPathways] = useState<Pathway[]>([])
  const [showPathwayCreator, setShowPathwayCreator] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      window.location.href = "/"
      return
    }

    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load pathways
    const pathwaysData = localStorage.getItem("pathways")
    if (pathwaysData) {
      setPathways(JSON.parse(pathwaysData))
    }

    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("pathways")
    window.location.href = "/"
  }

  const handlePathwayCreated = (pathway: Pathway) => {
    const updatedPathways = [...pathways, pathway]
    setPathways(updatedPathways)
    localStorage.setItem("pathways", JSON.stringify(updatedPathways))
    setShowPathwayCreator(false)
  }

  const handleLaunchPathway = (pathwayId: string) => {
    window.location.href = `/pathway/${pathwayId}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto animate-pulse">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (showPathwayCreator) {
    return <PathwayCreator onBack={() => setShowPathwayCreator(false)} onPathwayCreated={handlePathwayCreated} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Code Atlas
                </h1>
                <p className="text-sm text-gray-600">Learning Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowPathwayCreator(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Pathway
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700">
                    {user?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-600">Level {user?.level}</div>
                </div>
              </div>

              <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
          <p className="text-gray-600">Ready to continue your coding journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{pathways.length}</div>
                  <div className="text-sm text-gray-600">Active Pathways</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{user?.level}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{user?.totalXP}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {pathways.reduce((total, pathway) => total + (pathway.estimatedHours || 0), 0)}h
                  </div>
                  <div className="text-sm text-gray-600">Learning Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pathways Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Your Learning Pathways</h3>
            {pathways.length === 0 && (
              <Button
                onClick={() => setShowPathwayCreator(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Pathway
              </Button>
            )}
          </div>

          {pathways.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No pathways yet</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first AI-curated learning pathway to start your coding journey. Our AI will personalize
                  content based on your goals and experience.
                </p>
                <Button
                  onClick={() => setShowPathwayCreator(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pathway
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pathways.map((pathway) => (
                <Card
                  key={pathway.id}
                  className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{pathway.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {pathway.currentLanguage} → {pathway.targetLanguage}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {pathway.skillLevel}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{pathway.progress}%</div>
                        <div className="text-xs text-gray-600">Complete</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{pathway.description}</p>

                    <Progress value={pathway.progress} className="h-2" />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>
                            {pathway.completedModules}/{pathway.totalModules} modules
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{pathway.estimatedHours}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        onClick={() => handleLaunchPathway(pathway.id)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {pathway.progress > 0 ? "Continue" : "Start"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity and AI Assistant */}
        {pathways.length > 0 && (
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pathways.slice(0, 3).map((pathway, index) => (
                      <div key={pathway.id} className="flex items-center space-x-4 p-4 bg-white/40 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{pathway.title}</div>
                          <div className="text-sm text-gray-600">
                            {pathway.progress > 0 ? `${pathway.progress}% complete` : "Just created"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(pathway.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Learning Assistant */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                AI Learning Assistant
              </h3>
              <AiQuestionAnswer 
                context="Learning Dashboard - Ask questions about programming, learning paths, or get coding help"
                placeholder="Ask about programming concepts, learning strategies, or get help with code..."
              />
            </div>
          </div>
        )}

        {/* AI Assistant for users with no pathways */}
        {pathways.length === 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              AI Learning Assistant
            </h3>
            <AiQuestionAnswer 
              context="Getting Started - Ask questions about programming languages, learning paths, or career advice"
              placeholder="Ask me anything about programming, which language to learn, or how to get started..."
            />
          </div>
        )}
      </main>
    </div>
  )
}
