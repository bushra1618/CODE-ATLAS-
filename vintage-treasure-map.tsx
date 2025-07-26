"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, BookOpen, Compass, Star, Crown } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: any[]
  estimatedTime?: string
  learningObjectives?: string[]
}

interface VintageTreasureMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
}

export function VintageTreasureMap({ modules, onModuleClick }: VintageTreasureMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  // Vintage map positions inspired by the treasure map image
  const getModulePosition = (index: number, total: number) => {
    const positions = [
      { x: 15, y: 75, landmark: "port", icon: "⚓" },
      { x: 25, y: 60, landmark: "lighthouse", icon: "🗼" },
      { x: 40, y: 65, landmark: "island", icon: "🏝️" },
      { x: 55, y: 45, landmark: "mountain", icon: "⛰️" },
      { x: 70, y: 50, landmark: "castle", icon: "🏰" },
      { x: 85, y: 25, landmark: "treasure", icon: "💎" },
    ]

    if (index < positions.length) {
      return positions[index]
    }

    // Additional positions in spiral
    const angle = index * 60 * (Math.PI / 180)
    const radius = 15 + (index - positions.length) * 3
    return {
      x: 85 + radius * Math.cos(angle),
      y: 25 + radius * Math.sin(angle),
      landmark: "bonus",
      icon: "✨",
    }
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    // Create curved paths like on old maps
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2 - 5
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div className="relative w-full h-[700px] bg-amber-100 rounded-xl overflow-hidden border-4 border-amber-800 shadow-2xl">
      {/* Vintage map background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url('/images/vintage-map-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Parchment texture overlay */}
      <div className="absolute inset-0 bg-amber-50 opacity-60" />

      {/* Decorative border */}
      <div className="absolute inset-2 border-2 border-amber-700 rounded-lg">
        <div className="absolute inset-2 border border-amber-600 rounded-lg opacity-50" />
      </div>

      {/* Compass rose in top right */}
      <div className="absolute top-8 right-8 w-24 h-24 opacity-60">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M50,15 L55,45 L50,50 L45,45 Z" fill="currentColor" />
          <path d="M85,50 L55,55 L50,50 L55,45 Z" fill="currentColor" />
          <path d="M50,85 L45,55 L50,50 L55,55 Z" fill="currentColor" />
          <path d="M15,50 L45,45 L50,50 L45,55 Z" fill="currentColor" />
          <text x="50" y="10" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
            N
          </text>
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-12 left-12 text-2xl opacity-40">🏴‍☠️</div>
      <div className="absolute bottom-16 left-8 text-xl opacity-40">⚓</div>
      <div className="absolute top-20 left-1/3 text-lg opacity-30">🦅</div>
      <div className="absolute bottom-20 right-16 text-xl opacity-40">🐙</div>

      {/* Sea monsters and ships */}
      <div className="absolute top-1/3 left-8 text-3xl opacity-30 transform rotate-12">🐉</div>
      <div className="absolute bottom-1/3 right-12 text-2xl opacity-40 transform -rotate-12">⛵</div>

      {/* SVG for paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index, modules.length)
          const nextPos = getModulePosition(index + 1, modules.length)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Dotted path like old treasure maps */}
              <path
                d={getPathBetweenPoints(currentPos, nextPos)}
                stroke={isPathVisible ? "#92400e" : "#d6d3d1"}
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
                opacity={isPathVisible ? 0.8 : 0.4}
              />
              {/* Path decorations */}
              {isPathVisible && (
                <circle
                  cx={(currentPos.x + nextPos.x) / 2}
                  cy={(currentPos.y + nextPos.y) / 2}
                  r="1"
                  fill="#92400e"
                  opacity="0.6"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Module locations */}
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
              zIndex: module.unlocked ? 20 : 10,
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Location marker */}
            <div
              className={`relative w-16 h-16 rounded-full border-4 transition-all duration-300 cursor-pointer ${
                module.completed
                  ? "bg-yellow-600 border-yellow-800 shadow-lg"
                  : module.unlocked
                    ? "bg-red-600 border-red-800 shadow-lg hover:scale-110"
                    : "bg-gray-500 border-gray-700 opacity-60"
              } ${isHovered && module.unlocked ? "scale-110" : ""}`}
              onClick={() => module.unlocked && onModuleClick(module)}
            >
              {/* Vintage paper texture */}
              <div className="absolute inset-1 rounded-full bg-amber-50 opacity-20" />

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                {module.completed ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : module.unlocked ? (
                  <span className="text-white">{position.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Module number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-100 rounded-full border-2 border-amber-800 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-900">{module.id}</span>
              </div>

              {/* Completion glow */}
              {module.completed && (
                <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-pulse opacity-60" />
              )}
            </div>

            {/* Location label */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="bg-amber-100 border-2 border-amber-800 rounded-lg px-3 py-1 shadow-lg">
                <span className="text-xs font-bold text-amber-900 capitalize">{position.landmark}</span>
              </div>
            </div>

            {/* Hover info card */}
            {isHovered && module.unlocked && (
              <Card className="absolute top-28 left-1/2 transform -translate-x-1/2 w-80 p-4 bg-amber-50 border-2 border-amber-800 shadow-xl z-30">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-amber-900 text-lg flex items-center">
                      <span className="mr-2">{position.icon}</span>
                      {module.title}
                    </h3>
                    <p className="text-sm text-amber-800">{module.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={module.completed ? "default" : "secondary"}
                      className={`${module.completed ? "bg-yellow-600 text-white" : "bg-amber-200 text-amber-900"}`}
                    >
                      {module.completed ? "⚡ Mastered" : "🎯 Ready"}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-amber-700">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.resources?.length || 0} resources</span>
                    </div>
                  </div>

                  {module.learningObjectives && (
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2 text-sm">Quest Objectives:</h4>
                      <ul className="text-xs text-amber-700 space-y-1">
                        {module.learningObjectives.slice(0, 3).map((objective, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-600 mt-0.5">⚡</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.unlocked && !module.completed && (
                    <Button
                      size="sm"
                      className="w-full bg-red-700 hover:bg-red-800 text-white"
                      onClick={() => onModuleClick(module)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Begin Quest
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-amber-50 border-2 border-amber-800 rounded-lg p-4 shadow-lg">
        <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center">
          <Compass className="w-4 h-4 mr-2" />
          Navigator's Guide
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-yellow-800"></div>
            <span className="text-amber-800 font-medium">Quest Completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-red-800"></div>
            <span className="text-amber-800 font-medium">Ready to Explore</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-700 opacity-60"></div>
            <span className="text-amber-800 font-medium">Locked Territory</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-6 right-6 bg-amber-50 border-2 border-amber-800 rounded-lg p-4 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-900 flex items-center justify-center">
            <Crown className="w-6 h-6 mr-2 text-yellow-700" />
            {modules.filter((m) => m.completed).length}/{modules.length}
          </div>
          <div className="text-xs text-amber-700 font-medium">Treasures Found</div>
        </div>
      </div>

      {/* Decorative title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-amber-50 border-2 border-amber-800 rounded-lg px-6 py-2 shadow-lg">
          <h2 className="text-lg font-bold text-amber-900 text-center">⚔️ Learning Adventure Map ⚔️</h2>
        </div>
      </div>
    </div>
  )
}
