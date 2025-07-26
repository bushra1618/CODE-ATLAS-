"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Search, Star, CheckCircle, Zap, Target, Sparkles, Cpu, Globe, Clock, BookOpen } from "lucide-react"

interface CurationStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "complete"
  progress: number
  details?: string[]
}

interface AICurationStatusProps {
  isVisible: boolean
  onComplete: () => void
  currentLanguage?: string
  targetLanguage?: string
  skillLevel?: string
}

export function AICurationStatus({
  isVisible,
  onComplete,
  currentLanguage = "JavaScript",
  targetLanguage = "Python",
  skillLevel = "intermediate",
}: AICurationStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([])
  const [aiProvider, setAiProvider] = useState<string>("xAI Grok-3")
  const [resourcesFound, setResourcesFound] = useState(0)
  const [timestampsExtracted, setTimestampsExtracted] = useState(0)
  const [steps, setSteps] = useState<CurationStep[]>([
    {
      id: "ai-analysis",
      title: "AI Profile Analysis",
      description: `Analyzing your ${currentLanguage} background for optimal ${targetLanguage} transition`,
      status: "pending",
      progress: 0,
      details: [],
    },
    {
      id: "web-scraping",
      title: "Intelligent Web Scraping",
      description: "AI searching thousands of resources across the web",
      status: "pending",
      progress: 0,
      details: [],
    },
    {
      id: "content-analysis",
      title: "Content Quality Analysis",
      description: "AI analyzing video timestamps, documentation sections, and community ratings",
      status: "pending",
      progress: 0,
      details: [],
    },
    {
      id: "personalization",
      title: "Personalized Curation",
      description: `Creating your perfect ${currentLanguage} → ${targetLanguage} learning path`,
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
          // Realistic progress increments with AI-specific updates
          const increment = Math.random() * 8 + 4
          activeStep.progress += increment

          // Add step-specific details and metrics
          if (activeStep.progress > 25 && activeStep.details!.length === 0) {
            addStepDetails(activeStep, aiProvider, currentLanguage, targetLanguage)
          }

          // Update metrics based on step
          if (activeStep.id === "web-scraping" && Math.random() < 0.3) {
            setResourcesFound((prev) => prev + Math.floor(Math.random() * 5) + 1)
          }

          if (activeStep.id === "content-analysis" && Math.random() < 0.4) {
            setTimestampsExtracted((prev) => prev + Math.floor(Math.random() * 3) + 1)
          }

          // Simulate AI provider optimization
          if (activeStep.progress > 60 && Math.random() < 0.15) {
            if (aiProvider === "xAI Grok-3") {
              setAiProvider("xAI Grok-3 + Web APIs")
              setRealTimeUpdates((prev) => [...prev, "🔄 Integrating web APIs for better resource discovery..."])
            } else if (aiProvider === "xAI Grok-3 + Web APIs") {
              setAiProvider("xAI Grok-3 + Community Analysis")
              setRealTimeUpdates((prev) => [...prev, "🧠 Adding community validation and rating analysis..."])
            }
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
              }, 2000)
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

      // Add real-time updates with AI-specific information
      setRealTimeUpdates((prev) => {
        const updates = [...prev]
        const activeStep = steps.find((step) => step.status === "active")
        if (activeStep && Math.random() < 0.5) {
          updates.push(generateAIRealtimeUpdate(activeStep.id, aiProvider, currentLanguage, targetLanguage))
          return updates.slice(-8) // Keep only last 8 updates
        }
        return updates
      })
    }, 600)

    return () => clearInterval(interval)
  }, [isVisible, onComplete, steps, aiProvider, currentLanguage, targetLanguage])

  const addStepDetails = (step: CurationStep, provider: string, currentLang: string, targetLang: string) => {
    const detailsMap: { [key: string]: { [key: string]: string[] } } = {
      "ai-analysis": {
        "xAI Grok-3": [
          `🦙 Grok-3 analyzing your ${currentLang} experience patterns`,
          `🎯 Identifying optimal ${targetLang} learning sequence`,
          `📊 Mapping ${currentLang} concepts to ${targetLang} equivalents`,
          `🧠 Creating personalized difficulty progression`,
        ],
        "xAI Grok-3 + Web APIs": [
          `🤖 Advanced AI analyzing your programming profile`,
          `📊 Cross-referencing with successful transition patterns`,
          `🎯 Optimizing learning path based on community data`,
          `✅ Personalized analysis complete`,
        ],
      },
      "web-scraping": {
        "xAI Grok-3": [
          `🌐 AI scanning YouTube for ${targetLang} tutorials`,
          `📚 Analyzing official ${targetLang} documentation`,
          `🔍 Finding community-recommended resources`,
          `⭐ Cross-referencing Stack Overflow discussions`,
        ],
        "xAI Grok-3 + Web APIs": [
          `🚀 Enhanced web scraping with multiple APIs`,
          `📺 YouTube API finding optimal video segments`,
          `📖 Documentation API extracting relevant sections`,
          `🏆 Reddit API finding community favorites`,
        ],
      },
      "content-analysis": {
        "xAI Grok-3": [
          `🎥 AI analyzing video content for optimal timestamps`,
          `📄 Extracting key sections from documentation`,
          `⭐ Evaluating community ratings and reviews`,
          `🎯 Matching content difficulty to your skill level`,
        ],
        "xAI Grok-3 + Community Analysis": [
          `🧠 Advanced content quality assessment`,
          `📊 Community sentiment analysis complete`,
          `🎯 Precision timestamp extraction finished`,
          `✅ Quality-assured resource curation ready`,
        ],
      },
      personalization: {
        "xAI Grok-3": [
          `🏗️ AI assembling your personalized learning modules`,
          `📚 Sequencing resources for optimal retention`,
          `🎯 Adding ${currentLang}-specific context and explanations`,
          `✨ Finalizing your AI-curated ${targetLang} journey`,
        ],
        "xAI Grok-3 + Community Analysis": [
          `🎨 Creating your unique learning experience`,
          `📈 Optimizing progression based on success patterns`,
          `🎯 Adding intelligent guidance and tips`,
          `🎉 Your personalized pathway is ready!`,
        ],
      },
    }

    step.details = detailsMap[step.id]?.[provider] || []
  }

  const generateAIRealtimeUpdate = (
    stepId: string,
    provider: string,
    currentLang: string,
    targetLang: string,
  ): string => {
    const updates: { [key: string]: { [key: string]: string[] } } = {
      "ai-analysis": {
        "xAI Grok-3": [
          `🦙 Grok-3 processing ${currentLang} → ${targetLang} transition patterns...`,
          `🧠 AI identifying your specific learning preferences...`,
          `📊 Analyzing optimal difficulty progression for ${skillLevel} developers...`,
          `🎯 Mapping ${currentLang} expertise to ${targetLang} concepts...`,
        ],
        "xAI Grok-3 + Web APIs": [
          `🤖 Enhanced AI analysis with web data integration...`,
          `📊 Cross-referencing with 10K+ successful transitions...`,
          `🎯 Optimizing based on community success patterns...`,
          `✅ Advanced profile analysis complete...`,
        ],
      },
      "web-scraping": {
        "xAI Grok-3": [
          `🌐 AI discovering ${resourcesFound} high-quality resources...`,
          `📺 Scanning YouTube for ${targetLang} tutorial gems...`,
          `📚 Analyzing ${targetLang} documentation depth...`,
          `🔍 Finding community-validated learning materials...`,
        ],
        "xAI Grok-3 + Web APIs": [
          `🚀 Multi-API resource discovery in progress...`,
          `📊 YouTube API found ${Math.floor(Math.random() * 50) + 20} relevant videos...`,
          `📖 Documentation API extracted ${Math.floor(Math.random() * 30) + 15} key sections...`,
          `🏆 Reddit API identified top community recommendations...`,
        ],
      },
      "content-analysis": {
        "xAI Grok-3": [
          `🎥 AI extracting optimal timestamps from ${timestampsExtracted} videos...`,
          `📄 Analyzing documentation for ${currentLang} developer context...`,
          `⭐ Evaluating resource quality and community ratings...`,
          `🎯 Matching content difficulty to your ${skillLevel} level...`,
        ],
        "xAI Grok-3 + Community Analysis": [
          `🧠 Advanced quality assessment using community data...`,
          `📊 Sentiment analysis on ${Math.floor(Math.random() * 1000) + 500} reviews...`,
          `🎯 Precision timestamp extraction: ${timestampsExtracted} segments found...`,
          `✅ Quality-assured curation complete...`,
        ],
      },
      personalization: {
        "xAI Grok-3": [
          `🏗️ AI building your personalized ${targetLang} learning modules...`,
          `📚 Sequencing ${resourcesFound} resources for optimal flow...`,
          `🎯 Adding ${currentLang}-specific explanations and context...`,
          `✨ Finalizing your intelligent learning pathway...`,
        ],
        "xAI Grok-3 + Community Analysis": [
          `🎨 Creating your unique ${currentLang} → ${targetLang} experience...`,
          `📈 Applying success patterns from similar developers...`,
          `🎯 Adding AI-generated tips and guidance...`,
          `🎉 Your personalized pathway is almost ready!`,
        ],
      },
    }

    const stepUpdates = updates[stepId]?.[provider] || ["🤖 AI processing your learning requirements..."]
    return stepUpdates[Math.floor(Math.random() * stepUpdates.length)]
  }

  if (!isVisible) return null

  const completedSteps = steps.filter((step) => step.status === "complete").length
  const overallProgress = (completedSteps / steps.length) * 100

  const getProviderIcon = () => {
    if (aiProvider.includes("xAI")) return "🦙"
    return "🤖"
  }

  const getProviderColor = () => {
    if (aiProvider.includes("Community")) return "from-green-100 to-blue-100 border-green-200"
    if (aiProvider.includes("Web APIs")) return "from-blue-100 to-purple-100 border-blue-200"
    return "from-orange-100 to-red-100 border-orange-200"
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl p-8 bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center relative">
            <div className="text-5xl">{getProviderIcon()}</div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-spin opacity-30"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            AI Curating Your Perfect {currentLanguage} → {targetLanguage} Path
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            Advanced AI analyzing the web to find the perfect resources with exact timestamps and page numbers for your
            transition.
          </p>

          <Badge className={`mb-6 px-6 py-3 bg-gradient-to-r ${getProviderColor().replace("border-", "")} text-lg`}>
            <Cpu className="w-5 h-5 mr-2" />
            Powered by {aiProvider}
          </Badge>

          <div className="mb-8">
            <Progress value={overallProgress} className="h-6 mb-4" />
            <p className="text-2xl font-semibold text-gray-700">{Math.round(overallProgress)}% Complete</p>
          </div>

          {/* Real-time metrics */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-900">{resourcesFound}</span>
              </div>
              <p className="text-sm text-blue-700 font-medium">Resources Found</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-900">{timestampsExtracted}</span>
              </div>
              <p className="text-sm text-green-700 font-medium">Timestamps Extracted</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-900">{skillLevel}</span>
              </div>
              <p className="text-sm text-purple-700 font-medium">Skill Level</p>
            </div>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-medium">AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Web Scraping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-medium">Smart Curation</span>
            </div>
          </div>
        </div>

        {/* Real-time AI activity feed */}
        <div className={`mb-8 bg-gradient-to-r ${getProviderColor()} rounded-xl p-6 border`}>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Live AI Curation Feed
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {realTimeUpdates.map((update, index) => (
              <div
                key={index}
                className="text-sm text-gray-700 animate-fade-in bg-white/70 rounded-lg p-3 border border-white/50"
              >
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
                    ? "border-purple-500 bg-purple-50 shadow-xl scale-105"
                    : isComplete
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isComplete
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-purple-500 text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-8 h-8" /> : getStepIcon(step.id, isActive)}
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
                      <Badge className="bg-purple-500 text-white animate-pulse px-4 py-2">
                        {getProviderIcon()} Processing
                      </Badge>
                    )}
                    {isComplete && <Badge className="bg-green-500 text-white px-4 py-2">✓ Complete</Badge>}
                  </div>
                </div>

                {isActive && (
                  <div className="mb-4">
                    <Progress value={step.progress} className="h-4 mb-2" />
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

        {/* Enhanced feature showcase */}
        <div className={`mt-8 p-6 bg-gradient-to-r ${getProviderColor()} rounded-xl border`}>
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-blue-900">Advanced AI-Powered Curation</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">
                {getProviderIcon()} {aiProvider} Intelligence
              </p>
              <p>
                Advanced AI analyzing your specific {currentLanguage} → {targetLanguage} transition needs
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🎯 Precision Timestamps</p>
              <p>AI extracts exact video segments and documentation sections for optimal learning</p>
            </div>
            <div>
              <p className="font-medium mb-1">🌐 Web-Scale Curation</p>
              <p>Intelligent scraping of YouTube, documentation, Stack Overflow, and community forums</p>
            </div>
            <div>
              <p className="font-medium mb-1">⚡ Real-Time Quality Analysis</p>
              <p>Community ratings, view counts, and success patterns analyzed in real-time</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getStepIcon(stepId: string, isActive: boolean) {
  const iconClass = `w-7 h-7 ${isActive ? "animate-pulse" : ""}`

  switch (stepId) {
    case "ai-analysis":
      return <Brain className={iconClass} />
    case "web-scraping":
      return <Globe className={iconClass} />
    case "content-analysis":
      return <Search className={iconClass} />
    case "personalization":
      return <Star className={iconClass} />
    default:
      return <div className="w-7 h-7 bg-current rounded-full" />
  }
}
