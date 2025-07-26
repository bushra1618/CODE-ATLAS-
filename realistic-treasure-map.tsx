"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, BookOpen, Star, Crown, Compass, Scroll } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: any[]
  estimatedTime?: string
  learningObjectives?: string[]
  landmark?: string
  biome?: string
}

interface RealisticTreasureMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
}

export function RealisticTreasureMap({ modules, onModuleClick }: RealisticTreasureMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading animation
    setTimeout(() => setMapLoaded(true), 500)
  }, [])

  // Positions that match the reference treasure map exactly
  const getModulePosition = (index: number, total: number) => {
    const positions = [
      { x: 15, y: 85, landmark: "port", icon: "⚓", name: "Starting Port" },
      { x: 22, y: 75, landmark: "lighthouse", icon: "🗼", name: "Beacon of Knowledge" },
      { x: 30, y: 68, landmark: "island", icon: "🏝️", name: "Syntax Island" },
      { x: 38, y: 58, landmark: "village", icon: "🏘️", name: "Data Village" },
      { x: 45, y: 65, landmark: "forest", icon: "🌲", name: "Control Forest" },
      { x: 52, y: 52, landmark: "mountain", icon: "⛰️", name: "Function Peak" },
      { x: 60, y: 45, landmark: "castle", icon: "🏰", name: "OOP Castle" },
      { x: 68, y: 55, landmark: "cave", icon: "🕳️", name: "Memory Cave" },
      { x: 75, y: 42, landmark: "temple", icon: "🏛️", name: "Error Temple" },
      { x: 82, y: 48, landmark: "harbor", icon: "🚢", name: "Library Harbor" },
      { x: 88, y: 35, landmark: "tower", icon: "🗼", name: "Testing Tower" },
      { x: 92, y: 25, landmark: "treasure", icon: "💎", name: "Master's Treasury" },
    ]

    if (index < positions.length) {
      return positions[index]
    }

    // Additional positions for extra modules
    const angle = (index - positions.length) * 45 * (Math.PI / 180)
    const radius = 8 + (index - positions.length) * 2
    return {
      x: 92 + radius * Math.cos(angle),
      y: 25 + radius * Math.sin(angle),
      landmark: "bonus",
      icon: "✨",
      name: "Bonus Quest",
    }
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    // Create realistic curved paths like on old maps
    const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 6
    const midY = (start.y + end.y) / 2 - 4
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return

    setAnimatingModule(module.id)
    playSound("click")

    setTimeout(() => {
      setAnimatingModule(null)
      onModuleClick(module)
    }, 300)
  }

  const playSound = (type: string) => {
    // Sound effects implementation
    console.log(`🔊 Playing ${type} sound`)
  }

  return (
    <div className="relative w-full h-[800px] rounded-xl overflow-hidden border-4 border-amber-800 shadow-2xl">
      {/* Exact replica of the reference treasure map */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/vintage-treasure-map.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Subtle overlay to ensure readability */}
      <div className="absolute inset-0 bg-amber-50/20" />

      {/* Decorative border matching the reference */}
      <div className="absolute inset-2 border-2 border-amber-900 rounded-lg opacity-80">
        {/* Top coordinate markers */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-amber-200/60 border-b border-amber-800 flex justify-between items-center px-4 text-xs font-bold text-amber-900">
          {["50°", "60°", "70°", "80°", "90°", "100°"].map((coord, i) => (
            <span key={i}>{coord}</span>
          ))}
        </div>
        {/* Left coordinate markers */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-amber-200/60 border-r border-amber-800 flex flex-col justify-between items-center py-4 text-xs font-bold text-amber-900">
          {["30°", "20°", "10°", "0°"].map((coord, i) => (
            <span key={i} className="transform -rotate-90">
              {coord}
            </span>
          ))}
        </div>
      </div>

      {/* SVG for realistic dotted paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index, modules.length)
          const nextPos = getModulePosition(index + 1, modules.length)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Main dotted path */}
              <path
                d={getPathBetweenPoints(currentPos, nextPos)}
                stroke={isPathVisible ? "#92400e" : "#a8a29e"}
                strokeWidth="2.5"
                strokeDasharray="5,5"
                fill="none"
                opacity={isPathVisible ? 0.9 : 0.4}
                filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"
              />

              {/* Glowing overlay for completed paths */}
              {isPathVisible && (
                <path
                  d={getPathBetweenPoints(currentPos, nextPos)}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.7"
                  strokeDasharray="3,3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur="2s" repeatCount="indefinite" />
                </path>
              )}

              {/* Path markers */}
              {isPathVisible && (
                <circle
                  cx={(currentPos.x + nextPos.x) / 2}
                  cy={(currentPos.y + nextPos.y) / 2}
                  r="1"
                  fill="#92400e"
                  opacity="0.8"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Module locations with topic labels */}
      {modules.map((module, index) => {
        const position = getModulePosition(index, modules.length)
        const isHovered = hoveredModule === module.id
        const isAnimating = animatingModule === module.id

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 30 : 20,
            }}
            onMouseEnter={() => {
              setHoveredModule(module.id)
              if (module.unlocked) playSound("hover")
            }}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Location shadow */}
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-black/20 blur-lg transform translate-y-2" />

            {/* Main location marker */}
            <div
              className={`relative w-16 h-16 rounded-full border-4 transition-all duration-500 cursor-pointer ${
                module.completed
                  ? "bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-600 shadow-2xl shadow-yellow-400/50"
                  : module.unlocked
                    ? "bg-gradient-to-br from-red-500 to-red-700 border-red-800 shadow-2xl shadow-red-400/50 hover:scale-110"
                    : "bg-gradient-to-br from-gray-500 to-gray-700 border-gray-800 opacity-60"
              } ${isHovered && module.unlocked ? "scale-110 shadow-3xl" : ""} ${
                isAnimating ? "scale-125 animate-bounce" : ""
              }`}
              onClick={() => handleModuleClick(module)}
            >
              {/* Realistic texture overlay */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

              {/* Landmark icon */}
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-7 h-7 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-7 h-7 text-yellow-200 opacity-30" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <span className="text-white drop-shadow-lg filter text-lg">{position.icon}</span>
                ) : (
                  <Lock className="w-5 h-5 text-white opacity-70" />
                )}
              </div>

              {/* Module number badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-100 rounded-full border-2 border-amber-800 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-amber-900">{module.id}</span>
              </div>

              {/* Completion effects */}
              {module.completed && (
                <>
                  <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-20" />
                  <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-pulse opacity-40" />
                  {/* Sparkle effects */}
                  <div className="absolute -inset-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          top: `${30 + Math.sin((i * 60 * Math.PI) / 180) * 20}px`,
                          left: `${30 + Math.cos((i * 60 * Math.PI) / 180) * 20}px`,
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Unlock glow */}
              {module.unlocked && !module.completed && (
                <>
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-400 to-orange-500 animate-pulse opacity-20" />
                  <div className="absolute -inset-1 rounded-full border border-red-300 animate-pulse opacity-50" />
                </>
              )}
            </div>

            {/* Topic label scroll */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="bg-amber-100/95 border-2 border-amber-800 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm max-w-32">
                <div className="flex items-center space-x-1">
                  <Scroll className="w-3 h-3 text-amber-800" />
                  <span className="text-xs font-bold text-amber-900 text-center leading-tight">{module.title}</span>
                </div>
              </div>
            </div>

            {/* Enhanced hover info card */}
            {isHovered && module.unlocked && (
              <Card className="absolute top-32 left-1/2 transform -translate-x-1/2 w-96 p-6 bg-amber-50/95 backdrop-blur-md shadow-2xl border-2 border-amber-400 z-40 rounded-xl">
                <div className="space-y-4">
                  <div className="border-b border-amber-200 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-amber-900 text-lg flex items-center">
                        <span className="mr-2 text-xl">{position.icon}</span>
                        {module.title}
                      </h3>
                      <Badge
                        variant={module.completed ? "default" : "secondary"}
                        className={`text-sm ${module.completed ? "bg-green-600 text-white" : "bg-amber-200 text-amber-900"}`}
                      >
                        {module.completed ? "⚡ Mastered" : "🎯 Ready"}
                      </Badge>
                    </div>
                    <p className="text-sm text-amber-800 leading-relaxed">{module.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-amber-700">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>{module.resources?.length || 0} resources</span>
                    </div>
                    <div className="flex items-center space-x-2 text-amber-700">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span>{module.estimatedTime || "4-6 hours"}</span>
                    </div>
                  </div>

                  {module.learningObjectives && (
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2 text-sm flex items-center">
                        <Compass className="w-4 h-4 mr-2 text-amber-600" />
                        Quest Objectives:
                      </h4>
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
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => handleModuleClick(module)}
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

      {/* Enhanced legend with realistic styling */}
      <div className="absolute bottom-6 left-6 bg-amber-50/95 backdrop-blur-md rounded-xl p-5 border-2 border-amber-600 shadow-xl">
        <h4 className="text-sm font-bold text-amber-900 mb-4 flex items-center">
          <Compass className="w-5 h-5 mr-2 animate-spin" style={{ animationDuration: "8s" }} />
          Navigator's Guide
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-yellow-600 shadow-lg"></div>
            <span className="text-amber-800 font-medium">Quest Mastered</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full border-2 border-red-800 shadow-lg"></div>
            <span className="text-amber-800 font-medium">Ready to Explore</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full border-2 border-gray-800 opacity-60"></div>
            <span className="text-amber-800 font-medium">Locked Territory</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-6 right-6 bg-amber-50/95 backdrop-blur-md rounded-xl p-5 border-2 border-amber-600 shadow-xl">
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-900 flex items-center justify-center">
            <Crown className="w-8 h-8 mr-2 text-yellow-700" />
            {modules.filter((m) => m.completed).length}/{modules.length}
          </div>
          <div className="text-xs text-amber-700 font-medium">Treasures Discovered</div>
          <div className="mt-2 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-amber-50/95 border-2 border-amber-800 rounded-lg px-6 py-3 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-bold text-amber-900 text-center flex items-center">
            <span className="mr-2">🗺️</span>
            Learning Adventure Map
            <span className="ml-2">⚔️</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
