"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Search, Star, CheckCircle, Zap, Target, BookOpen, Cpu } from "lucide-react"

interface CurationStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "complete"
  progress: number
  details?: string[]
}

interface CurationStatusProps {
  isVisible: boolean
  onComplete: () => void
}

export function CurationStatus({ isVisible, onComplete }: CurationStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([])
  const [steps, setSteps] = useState<CurationStep[]>([
    {
      id: "profile-analysis",
      title: "Profile Analysis",
      description: "Analyzing your programming background and transition goals",
      status: "pending",
      progress: 0,
      details: [],
    },
    {
      id: "resource-discovery",
      title: "Resource Discovery",
      description: "Finding the best community-recommended learning resources",
      status: "pending",
      progress: 0,
      details: [],
    },
    {
      id: "pathway-creation",
      title: "Pathway Assembly",
      description: "Creating your personalized learning journey",
      status: "pending",
      progress: 0,
      details: [],
    },
  ])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps]
        const activeStep = newSteps.find((step) => step.status === "active")

        if (activeStep) {
          // Realistic progress increments
          activeStep.progress += Math.random() * 15 + 5

          // Add step details
          if (activeStep.progress > 30 && activeStep.details!.length === 0) {
            addStepDetails(activeStep)
          }

          if (activeStep.progress >= 100) {
            activeStep.progress = 100
            activeStep.status = "complete"

            const nextStepIndex = newSteps.findIndex((step) => step.status === "pending")
            if (nextStepIndex !== -1) {
              newSteps[nextStepIndex].status = "active"
              setCurrentStep(nextStepIndex)
            } else {
              // All steps complete
              setTimeout(() => {
                onComplete()
              }, 1500)
            }
          }
        } else {
          // Start first step
          const firstPending = newSteps.find((step) => step.status === "pending")
          if (firstPending) {
            firstPending.status = "active"
            setCurrentStep(0)
          }
        }

        return newSteps
      })

      // Add real-time updates
      setRealTimeUpdates((prev) => {
        const updates = [...prev]
        const activeStep = steps.find((step) => step.status === "active")
        if (activeStep && Math.random() < 0.4) {
          updates.push(generateRealtimeUpdate(activeStep.id))
          return updates.slice(-6) // Keep only last 6 updates
        }
        return updates
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isVisible, onComplete, steps])

  const addStepDetails = (step: CurationStep) => {
    const detailsMap: { [key: string]: string[] } = {
      "profile-analysis": [
        "🔍 Analyzing your programming experience",
        "🎯 Identifying specific skill gaps for your transition",
        "📊 Determining optimal learning approach",
        "🔍 Generating targeted resource search strategy",
      ],
      "resource-discovery": [
        "🔍 Searching across learning platforms",
        "📺 Analyzing video content quality",
        "📚 Evaluating documentation resources",
        "⭐ Rating community recommendations",
      ],
      "pathway-creation": [
        "🏗️ Designing optimal learning sequence",
        "📚 Grouping resources into modules",
        "🎯 Creating personalized explanations",
        "✨ Finalizing your learning journey",
      ],
    }

    step.details = detailsMap[step.id] || []
  }

  const generateRealtimeUpdate = (stepId: string): string => {
    const updates: { [key: string]: string[] } = {
      "profile-analysis": [
        "🔍 Processing your language transition profile...",
        "🧠 Analyzing skill gap patterns...",
        "📊 Calculating optimal learning strategy...",
        "🎯 Identifying critical concepts to master...",
      ],
      "resource-discovery": [
        "🔍 Scanning thousands of learning resources...",
        "📺 Analyzing video tutorial quality...",
        "📚 Evaluating documentation effectiveness...",
        "⭐ Cross-referencing community ratings...",
      ],
      "pathway-creation": [
        "🏗️ Assembling your learning modules...",
        "📈 Optimizing resource sequence...",
        "🎯 Creating personalized context...",
        "🎉 Finalizing expert-curated pathway...",
      ],
    }

    const stepUpdates = updates[stepId] || ["🤖 Processing..."]
    return stepUpdates[Math.floor(Math.random() * stepUpdates.length)]
  }

  if (!isVisible) return null

  const completedSteps = steps.filter((step) => step.status === "complete").length
  const overallProgress = (completedSteps / steps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center relative">
            <div className="text-4xl">🧠</div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-spin opacity-30"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Curating Your Perfect Learning Path</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Using advanced analysis to find the perfect resources for your transition.
          </p>

          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <Cpu className="w-4 h-4 mr-2" />
            Expert Curation System
          </Badge>

          <div className="mb-8">
            <Progress value={overallProgress} className="h-4 mb-3" />
            <p className="text-xl font-semibold text-gray-700">{Math.round(overallProgress)}% Complete</p>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Expert Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Resource Discovery</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="font-medium">Personalized Curation</span>
            </div>
          </div>
        </div>

        {/* Real-time updates feed */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Live Activity Feed
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {realTimeUpdates.map((update, index) => (
              <div key={index} className="text-sm text-gray-700 animate-fade-in bg-white/60 rounded-lg p-3">
                {update}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed step progress */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = step.status === "active"
            const isComplete = step.status === "complete"

            return (
              <div
                key={step.id}
                className={`p-6 rounded-xl border-2 transition-all duration-500 ${
                  isActive
                    ? "border-purple-500 bg-purple-50 shadow-xl"
                    : isComplete
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isComplete
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-purple-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-7 h-7" /> : getStepIcon(step.id, isActive)}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-semibold ${
                          isActive ? "text-purple-900" : isComplete ? "text-green-900" : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? "text-purple-700" : isComplete ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isActive && (
                      <Badge className="bg-purple-500 text-white animate-pulse px-4 py-2">🧠 Processing</Badge>
                    )}
                    {isComplete && <Badge className="bg-green-500 text-white px-4 py-2">✓ Complete</Badge>}
                  </div>
                </div>

                {isActive && (
                  <div className="mb-4">
                    <Progress value={step.progress} className="h-3 mb-2" />
                    <p className="text-sm text-purple-600 font-medium">{Math.round(step.progress)}% complete</p>
                  </div>
                )}

                {step.details && step.details.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={`text-sm flex items-center space-x-2 ${
                          isComplete ? "text-green-700" : isActive ? "text-purple-700" : "text-gray-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-blue-900">Expert Curation Process</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">🧠 Deep Analysis</p>
              <p>Advanced analysis of your specific programming transition needs</p>
            </div>
            <div>
              <p className="font-medium mb-1">🎯 Personalized Curation</p>
              <p>Expert selection of resources based on your exact skill gaps and goals</p>
            </div>
            <div>
              <p className="font-medium mb-1">📚 Intelligent Sequencing</p>
              <p>Optimal learning path created by experts for maximum retention</p>
            </div>
            <div>
              <p className="font-medium mb-1">⚡ Free & Fast</p>
              <p>No costs - using expert systems for quality curation</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getStepIcon(stepId: string, isActive: boolean) {
  const iconClass = `w-6 h-6 ${isActive ? "animate-pulse" : ""}`

  switch (stepId) {
    case "profile-analysis":
      return <Sparkles className={iconClass} />
    case "resource-discovery":
      return <Search className={iconClass} />
    case "pathway-creation":
      return <Star className={iconClass} />
    default:
      return <div className="w-6 h-6 bg-current rounded-full" />
  }
}
