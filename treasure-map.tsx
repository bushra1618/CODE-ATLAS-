"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, Play, BookOpen, FileText, Code2, Compass, Anchor, Mountain } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: any[]
}

interface TreasureMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
}

export function TreasureMap({ modules, onModuleClick }: TreasureMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  // Create a path through the modules in a treasure map style
  const getModulePosition = (index: number, total: number) => {
    const pathPoints = [
      { x: 15, y: 80 }, // Start bottom left
      { x: 25, y: 60 },
      { x: 40, y: 70 },
      { x: 55, y: 45 },
      { x: 70, y: 55 },
      { x: 85, y: 30 }, // End top right
    ]

    if (index < pathPoints.length) {
      return pathPoints[index]
    }

    // For additional modules, create a spiral pattern
    const angle = index * 60 * (Math.PI / 180)
    const radius = 20 + index * 5
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    }
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    // Create a curved path between points
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2 - 10 // Curve upward
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl overflow-hidden border-4 border-amber-200">
      {/* Treasure Map Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Decorative compass */}
          <g transform="translate(85, 15)">
            <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M-6,0 L0,-8 L6,0 L0,8 Z" fill="currentColor" opacity="0.3" />
          </g>

          {/* Decorative islands */}
          <ellipse cx="20" cy="25" rx="8" ry="5" fill="currentColor" opacity="0.1" />
          <ellipse cx="75" cy="75" rx="12" ry="8" fill="currentColor" opacity="0.1" />

          {/* Wave patterns */}
          <path d="M0,90 Q25,85 50,90 T100,90" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
          <path d="M0,95 Q25,90 50,95 T100,95" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
        </svg>
      </div>

      {/* SVG for paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw paths between modules */}
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index, modules.length)
          const nextPos = getModulePosition(index + 1, modules.length)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <path
              key={`path-${index}`}
              d={getPathBetweenPoints(currentPos, nextPos)}
              stroke={isPathVisible ? "#059669" : "#d1d5db"}
              strokeWidth="0.8"
              strokeDasharray={isPathVisible ? "none" : "2,2"}
              fill="none"
              opacity={isPathVisible ? 0.8 : 0.4}
            />
          )
        })}
      </svg>

      {/* Module Stones */}
      {modules.map((module, index) => {
        const position = getModulePosition(index, modules.length)
        const isHovered = hoveredModule === module.id

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 10 : 5,
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Module Stone */}
            <div
              className={`relative w-16 h-16 rounded-full border-4 transition-all duration-300 cursor-pointer ${
                module.completed
                  ? "bg-green-500 border-green-600 shadow-lg shadow-green-500/30"
                  : module.unlocked
                    ? "bg-blue-500 border-blue-600 shadow-lg shadow-blue-500/30 hover:scale-110"
                    : "bg-gray-400 border-gray-500 opacity-60"
              } ${isHovered && module.unlocked ? "scale-110" : ""}`}
              onClick={() => module.unlocked && onModuleClick(module)}
            >
              {/* Stone Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {module.completed ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : module.unlocked ? (
                  <Play className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Module Number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-current flex items-center justify-center">
                <span className="text-xs font-bold">{module.id}</span>
              </div>

              {/* Completion Glow Effect */}
              {module.completed && (
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
              )}
            </div>

            {/* Module Info Card (on hover) */}
            {isHovered && module.unlocked && (
              <Card className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 p-4 bg-white shadow-xl border-0 z-20">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={module.completed ? "default" : "secondary"}>
                      {module.completed ? "Completed" : "Available"}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.resources.length} resources</span>
                    </div>
                  </div>

                  {/* Resource Types */}
                  <div className="flex space-x-2">
                    {module.resources.some((r) => r.type === "video") && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Play className="w-3 h-3" />
                        <span>Video</span>
                      </div>
                    )}
                    {module.resources.some((r) => r.type === "article") && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        <span>Article</span>
                      </div>
                    )}
                    {module.resources.some((r) => r.type === "exercise") && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Code2 className="w-3 h-3" />
                        <span>Exercise</span>
                      </div>
                    )}
                  </div>

                  {module.unlocked && !module.completed && (
                    <Button size="sm" className="w-full" onClick={() => onModuleClick(module)}>
                      Start Module
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )
      })}

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 opacity-30">
        <Compass className="w-8 h-8 text-amber-800" />
      </div>

      <div className="absolute bottom-4 right-4 opacity-30">
        <Anchor className="w-6 h-6 text-amber-800" />
      </div>

      <div className="absolute top-1/3 right-1/4 opacity-20">
        <Mountain className="w-10 h-10 text-amber-800" />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-amber-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Locked</span>
          </div>
        </div>
      </div>
    </div>
  )
}
