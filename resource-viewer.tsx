"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Play,
  FileText,
  Code2,
  Clock,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Star,
  Brain,
  Zap,
} from "lucide-react"

interface Resource {
  id: string
  type: string
  title: string
  duration?: string
  timeSegment?: string
  pages?: number
  difficulty?: string
  url?: string
  whyPerfect?: string
  focusArea?: string
  section?: string
  communityRating?: string
  viewCount?: string
  lastUpdated?: string
  aiCurated?: boolean
  qualityScore?: number
  description: string
}

interface Module {
  id: number
  title: string
  description: string
  resources: Resource[]
  personalizedFor?: string
  learningObjectives?: string[]
  xp: number
}

interface ResourceViewerProps {
  module: Module
  onResourceClick: (resource: Resource) => void
  onBack: () => void
  onComplete: () => void
}

export function ResourceViewer({ module, onResourceClick, onBack, onComplete }: ResourceViewerProps) {
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set())

  const handleResourceComplete = (resource: Resource) => {
    const newCompleted = new Set(completedResources)
    newCompleted.add(resource.title)
    setCompletedResources(newCompleted)
  }

  const handleModuleComplete = () => {
    if (completedResources.size === module.resources.length) {
      onComplete()
    }
  }

  const getResourceIcon = (type: string) => {
    if (type.includes("video")) return <Play className="w-5 h-5" />
    if (type.includes("documentation") || type.includes("article")) return <FileText className="w-5 h-5" />
    if (type.includes("exercise") || type.includes("interactive")) return <Code2 className="w-5 h-5" />
    return <BookOpen className="w-5 h-5" />
  }

  const getResourceColor = (type: string) => {
    if (type.includes("video")) return "text-red-600 bg-red-50 border-red-200"
    if (type.includes("documentation") || type.includes("article")) return "text-blue-600 bg-blue-50 border-blue-200"
    if (type.includes("exercise") || type.includes("interactive")) return "text-green-600 bg-green-50 border-green-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
  }

  // Enhanced function to convert timestamp to seconds for YouTube URLs
  const timestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(":")
    if (parts.length === 2) {
      return Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1])
    } else if (parts.length === 3) {
      return Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2])
    }
    return 0
  }

  // Enhanced function to add timestamp to various video platforms
  const addTimestampToUrl = (url: string, timeSegment: string): string => {
    if (!url || !timeSegment) return url

    // Extract start time from timeSegment (format: "8:30-23:45")
    const startTime = timeSegment.split("-")[0].trim()
    const seconds = timestampToSeconds(startTime)

    // YouTube URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}t=${seconds}`
    }

    // Vimeo URLs
    if (url.includes("vimeo.com")) {
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}t=${Math.floor(seconds / 60)}m${seconds % 60}s`
    }

    // For other platforms, append timestamp as fragment
    return `${url}#t=${seconds}`
  }

  // Enhanced function to add page numbers to documentation URLs
  const addPageToUrl = (url: string, section: string, pages: string): string => {
    if (!url) return url

    // For documentation with anchor links
    if (section) {
      const anchor = section.toLowerCase().replace(/[^a-z0-9]/g, "-")
      return `${url}#${anchor}`
    }

    // For PDFs with page numbers
    if (pages && url.includes(".pdf")) {
      const pageNum = pages.match(/\d+/)?.[0]
      if (pageNum) {
        const separator = url.includes("?") ? "&" : "?"
        return `${url}${separator}page=${pageNum}`
      }
    }

    return url
  }

  const handleResourceClick = (resource: Resource) => {
    if (resource.url && resource.url !== "#") {
      let finalUrl = resource.url

      // For video resources, add timestamp to URL
      if (resource.type.includes("video") && resource.timeSegment) {
        finalUrl = addTimestampToUrl(resource.url, resource.timeSegment)
      }

      // For documentation, add page/section anchors
      if (
        (resource.type.includes("documentation") || resource.type.includes("article")) &&
        (resource.section || resource.pages)
      ) {
        finalUrl = addPageToUrl(resource.url, resource.section || "", resource.pages?.toString() || "")
      }

      window.open(finalUrl, "_blank", "noopener,noreferrer")
    }

    if (resource.type.includes("exercise") || resource.type.includes("interactive")) {
      onResourceClick(resource)
    } else {
      // Mark as completed when clicked
      handleResourceComplete(resource)
    }
  }

  const progressPercentage = (completedResources.size / module.resources.length) * 100

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="hover:bg-purple-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Adventure Map
        </Button>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Brain className="w-3 h-3 mr-1" />
            AI Curated
          </Badge>
          <Badge variant="secondary">Quest {module.id}</Badge>
        </div>
      </div>

      {/* Enhanced Module Info */}
      <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border shadow-lg">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              {module.title}
              <Star className="ml-3 w-6 h-6 text-purple-500" />
              <Zap className="ml-2 w-5 h-5 text-yellow-500" />
            </h1>
            <p className="text-gray-600 mb-3 text-lg">{module.description}</p>
            {module.personalizedFor && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>🎯 AI Personalized for you:</strong> {module.personalizedFor}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Learning Objectives */}
          {module.learningObjectives && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Quest Objectives:
              </h3>
              <ul className="space-y-2">
                {module.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                    <span className="text-blue-500 mt-0.5">⚡</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  {module.resources.length} AI-curated resources
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">{completedResources.size} completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-purple-600 font-medium">AI Quality Assured</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="font-bold text-lg">{Math.round(progressPercentage)}%</p>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-4" />
        </div>
      </Card>

      {/* Enhanced Resources List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Brain className="w-6 h-6 mr-3 text-purple-600" />
          AI-Curated Learning Resources
        </h2>

        {module.resources.length > 0 ? (
          module.resources.map((resource, index) => {
            const isCompleted = completedResources.has(resource.title)
            const colorClasses = getResourceColor(resource.type)

            return (
              <Card
                key={index}
                className={`p-6 bg-white border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  isCompleted ? "ring-2 ring-green-500 bg-green-50" : "hover:ring-2 hover:ring-purple-200"
                }`}
                onClick={() => handleResourceClick(resource)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg border ${colorClasses}`}>{getResourceIcon(resource.type)}</div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {resource.type.replace("_", " ")}
                        </Badge>
                        {resource.difficulty && <Badge variant="secondary">{resource.difficulty}</Badge>}
                        {resource.aiCurated && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            <Brain className="w-3 h-3 mr-1" />
                            AI Curated
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced resource details with AI metrics */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 flex-wrap gap-2">
                        {resource.timeSegment && (
                          <div className="flex items-center space-x-1 bg-red-100 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">{resource.timeSegment}</span>
                          </div>
                        )}
                        {resource.duration && (
                          <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                            <Clock className="w-4 h-4" />
                            <span>{resource.duration}</span>
                          </div>
                        )}
                        {resource.section && (
                          <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                            <FileText className="w-4 h-4" />
                            <span>{resource.section}</span>
                          </div>
                        )}
                        {resource.qualityScore && (
                          <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                            <Star className="w-3 h-3" />
                            <span className="font-medium">{resource.qualityScore.toFixed(1)}/10</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

                      {/* Enhanced Why Perfect explanation */}
                      {resource.whyPerfect && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                          <p className="text-sm text-amber-800">
                            <strong>🎯 AI Analysis - Why this is perfect for you:</strong> {resource.whyPerfect}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}

                    {resource.type.includes("video") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 border-red-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (resource.url && resource.url !== "#") {
                            const timestampedUrl = resource.timeSegment
                              ? addTimestampToUrl(resource.url, resource.timeSegment)
                              : resource.url
                            window.open(timestampedUrl, "_blank", "noopener,noreferrer")
                          }
                        }}
                      >
                        <Play className="w-4 h-4" />
                        <span>Watch {resource.timeSegment ? "Segment" : "Video"}</span>
                        {resource.url && resource.url !== "#" && <ExternalLink className="w-3 h-3" />}
                      </Button>
                    )}

                    {(resource.type.includes("documentation") || resource.type.includes("article")) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (resource.url && resource.url !== "#") {
                            const finalUrl = addPageToUrl(
                              resource.url,
                              resource.section || "",
                              resource.pages?.toString() || "",
                            )
                            window.open(finalUrl, "_blank", "noopener,noreferrer")
                          }
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Read {resource.section ? "Section" : "Article"}</span>
                        {resource.url && resource.url !== "#" && <ExternalLink className="w-3 h-3" />}
                      </Button>
                    )}

                    {(resource.type.includes("exercise") || resource.type.includes("interactive")) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 border-green-200"
                      >
                        <Code2 className="w-4 h-4" />
                        <span>Practice</span>
                      </Button>
                    )}

                    {!isCompleted && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleResourceComplete(resource)
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Resources are being curated by AI...</p>
            <p className="text-sm">This may take a few moments</p>
          </div>
        )}
      </div>

      {/* Enhanced Complete Module Button */}
      {module.resources.length > 0 && completedResources.size === module.resources.length && (
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quest Complete! 🎉</h3>
              <p className="text-gray-600 mb-6 text-lg">
                You've mastered all the AI-curated resources in this module. Your programming skills have leveled up!
              </p>
              <Button size="lg" onClick={handleModuleComplete} className="bg-green-600 hover:bg-green-700 px-8 py-3">
                <Star className="w-5 h-5 mr-2" />
                Complete Quest & Continue Journey (+{module.xp} XP)
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
