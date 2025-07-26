"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Lock,
  Play,
  BookOpen,
  FileText,
  Code2,
  Compass,
  Anchor,
  Mountain,
  Star,
  Crown,
  Gem,
  Clock,
  Zap,
  Trophy,
  Flame,
  Sparkles,
  Target,
} from "lucide-react"

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

interface TreasureMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
}

export function EnhancedTreasureMap({ modules, onModuleClick }: TreasureMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  // Create floating particles for ambiance
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({ ...p, y: p.y - 0.5, opacity: p.opacity - 0.01 }))
          .filter((p) => p.opacity > 0)

        // Add new particles occasionally
        if (Math.random() < 0.3) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: 100,
            opacity: 0.6,
          })
        }

        return newParticles
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Enhanced path points with more variety
  const getModulePosition = (index: number, total: number) => {
    const pathPoints = [
      { x: 8, y: 88, landmark: "port", biome: "coastal" },
      { x: 18, y: 75, landmark: "lighthouse", biome: "coastal" },
      { x: 32, y: 78, landmark: "island", biome: "tropical" },
      { x: 45, y: 65, landmark: "jungle", biome: "tropical" },
      { x: 58, y: 68, landmark: "cave", biome: "mountain" },
      { x: 68, y: 52, landmark: "mountain", biome: "mountain" },
      { x: 75, y: 38, landmark: "temple", biome: "ancient" },
      { x: 82, y: 25, landmark: "fortress", biome: "ancient" },
      { x: 88, y: 15, landmark: "castle", biome: "royal" },
      { x: 92, y: 8, landmark: "treasure", biome: "legendary" },
    ]

    if (index < pathPoints.length) {
      return pathPoints[index]
    }

    // Spiral pattern for additional modules
    const angle = index * 45 * (Math.PI / 180)
    const radius = 12 + (index - pathPoints.length) * 2
    return {
      x: 92 + radius * Math.cos(angle),
      y: 8 + radius * Math.sin(angle),
      landmark: "bonus",
      biome: "mystical",
    }
  }

  const getBiomeColors = (biome: string) => {
    const colors = {
      coastal: "from-blue-400 to-cyan-500",
      tropical: "from-green-400 to-emerald-500",
      mountain: "from-gray-500 to-slate-600",
      ancient: "from-amber-500 to-orange-600",
      royal: "from-purple-500 to-violet-600",
      legendary: "from-yellow-400 to-gold-500",
      mystical: "from-pink-400 to-rose-500",
    }
    return colors[biome as keyof typeof colors] || colors.coastal
  }

  const getLandmarkIcon = (landmark: string, isCompleted: boolean, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isCompleted ? "text-yellow-300" : isUnlocked ? "text-white" : "text-gray-400"}`

    const icons = {
      port: <Anchor className={iconClass} />,
      lighthouse: <Zap className={iconClass} />,
      island: <Mountain className={iconClass} />,
      jungle: <BookOpen className={iconClass} />,
      cave: <Gem className={iconClass} />,
      mountain: <Mountain className={iconClass} />,
      temple: <Star className={iconClass} />,
      fortress: <Trophy className={iconClass} />,
      castle: <Crown className={iconClass} />,
      treasure: <Crown className={`${iconClass} animate-pulse`} />,
      bonus: <Sparkles className={iconClass} />,
    }

    return icons[landmark as keyof typeof icons] || <Play className={iconClass} />
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const controlX1 = start.x + (end.x - start.x) * 0.25
    const controlY1 = start.y - 8
    const controlX2 = start.x + (end.x - start.x) * 0.75
    const controlY2 = end.y - 8

    return `M ${start.x} ${start.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${end.x} ${end.y}`
  }

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return

    setAnimatingModule(module.id)
    setTimeout(() => {
      setAnimatingModule(null)
      onModuleClick(module)
    }, 400)
  }

  return (
    <div
      className="relative w-full h-[800px] rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100"
      style={{
        backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animated background with layers */}
      <div className="absolute inset-0">
        {/* Base terrain */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-amber-100/40 to-blue-100/30" />

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
          />
        ))}

        {/* Decorative elements */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Animated compass */}
          <g transform="translate(5, 8)">
            <circle cx="0" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" className="animate-spin" />
            <path d="M-3,0 L0,-4 L3,0 L0,4 Z" fill="currentColor" opacity="0.6" />
            <text x="0" y="8" textAnchor="middle" fontSize="1.5" fill="currentColor" className="font-bold">
              N
            </text>
          </g>

          {/* Mystical creatures */}
          <g transform="translate(15, 35)" opacity="0.4">
            <circle cx="0" cy="0" r="2" fill="currentColor" className="animate-pulse" />
            <path d="M-2,-2 Q0,-4 2,-2 Q0,0 -2,-2" fill="currentColor" />
            <text x="0" y="6" textAnchor="middle" fontSize="1" fill="currentColor">
              🐉
            </text>
          </g>

          {/* Sailing ships */}
          <g transform="translate(25, 85)" opacity="0.3">
            <path d="M0,2 L6,2 L6,0 L8,1 L6,2 L6,4 L0,4 Z" fill="currentColor" />
            <path d="M1,2 L1,-2 M3,2 L3,-3 M5,2 L5,-2" stroke="currentColor" strokeWidth="0.2" />
            <text x="4" y="-4" textAnchor="middle" fontSize="1.2">
              ⛵
            </text>
          </g>

          {/* Treasure islands */}
          <g transform="translate(70, 75)" opacity="0.25">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="currentColor" />
            <text x="0" y="1" textAnchor="middle" fontSize="2">
              🏝️
            </text>
          </g>

          {/* Ancient ruins */}
          <g transform="translate(85, 45)" opacity="0.3">
            <rect x="-3" y="-2" width="6" height="4" fill="currentColor" />
            <text x="0" y="1" textAnchor="middle" fontSize="1.5">
              🏛️
            </text>
          </g>

          {/* Wave animations */}
          <path
            d="M0,92 Q10,90 20,92 T40,92 T60,92 T80,92 T100,92"
            stroke="currentColor"
            strokeWidth="0.4"
            fill="none"
            opacity="0.3"
            className="animate-pulse"
          />
          <path
            d="M0,96 Q15,94 30,96 T60,96 T90,96 T100,96"
            stroke="currentColor"
            strokeWidth="0.3"
            fill="none"
            opacity="0.2"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* SVG for enhanced paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index, modules.length)
          const nextPos = getModulePosition(index + 1, modules.length)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Main path with glow effect */}
              <path
                d={getPathBetweenPoints(currentPos, nextPos)}
                stroke={isPathVisible ? "#dc2626" : "#9ca3af"}
                strokeWidth="1.5"
                strokeDasharray={isPathVisible ? "none" : "4,4"}
                fill="none"
                opacity={isPathVisible ? 0.9 : 0.4}
                filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
              />

              {/* Glowing overlay for completed paths */}
              {isPathVisible && (
                <path
                  d={getPathBetweenPoints(currentPos, nextPos)}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.7"
                  strokeDasharray="3,3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur="2s" repeatCount="indefinite" />
                </path>
              )}

              {/* Magical sparkles along completed paths */}
              {module.completed && (
                <circle cx={(currentPos.x + nextPos.x) / 2} cy={(currentPos.y + nextPos.y) / 2} r="0.5" fill="#fbbf24">
                  <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="r" values="0.5;1.5;0.5" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      {/* Enhanced module stones */}
      {modules.map((module, index) => {
        const position = getModulePosition(index, modules.length)
        const isHovered = hoveredModule === module.id
        const isAnimating = animatingModule === module.id
        const biomeColors = getBiomeColors(position.biome)

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 30 : 20,
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Enhanced shadow with biome colors */}
            <div
              className={`absolute inset-0 w-24 h-24 rounded-full blur-lg transform translate-y-2 ${
                module.completed ? "bg-yellow-400/40" : module.unlocked ? "bg-blue-400/30" : "bg-gray-400/20"
              }`}
            />

            {/* Main enhanced stone */}
            <div
              className={`relative w-20 h-20 rounded-full border-4 transition-all duration-500 cursor-pointer ${
                module.completed
                  ? `bg-gradient-to-br from-yellow-300 to-amber-400 border-yellow-500 shadow-2xl shadow-yellow-400/50`
                  : module.unlocked
                    ? `bg-gradient-to-br ${biomeColors} border-blue-600 shadow-2xl shadow-blue-400/50 hover:scale-110`
                    : "bg-gradient-to-br from-gray-400 to-gray-600 border-gray-700 opacity-70"
              } ${isHovered && module.unlocked ? "scale-110 shadow-3xl" : ""} ${
                isAnimating ? "scale-125 animate-bounce" : ""
              }`}
              onClick={() => handleModuleClick(module)}
            >
              {/* Animated texture overlay */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

              {/* Biome-specific patterns */}
              {position.biome === "legendary" && (
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-2 rounded-full border-2 border-yellow-300 animate-spin opacity-50" />
                  <div className="absolute inset-4 rounded-full border border-yellow-200 animate-ping opacity-30" />
                </div>
              )}

              {/* Enhanced landmark icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-10 h-10 text-yellow-200 opacity-30" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <div className="relative">
                    {getLandmarkIcon(position.landmark, false, true)}
                    {isHovered && (
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-spin" />
                    )}
                  </div>
                ) : (
                  <Lock className="w-7 h-7 text-gray-300" />
                )}
              </div>

              {/* Enhanced module number badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full border-3 border-current flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-gray-800">{module.id}</span>
              </div>

              {/* Completion effects */}
              {module.completed && (
                <>
                  <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-20" />
                  <div className="absolute -inset-3 rounded-full border-2 border-yellow-400 animate-pulse opacity-40" />
                  <div className="absolute -inset-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 25}px`,
                          left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 25}px`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Unlock glow for available modules */}
              {module.unlocked && !module.completed && (
                <>
                  <div
                    className={`absolute -inset-2 rounded-full bg-gradient-to-r ${biomeColors} animate-pulse opacity-20`}
                  />
                  <div className="absolute -inset-1 rounded-full border border-blue-300 animate-pulse opacity-50" />
                </>
              )}
            </div>

            {/* Enhanced module info card */}
            {isHovered && module.unlocked && (
              <Card className="absolute top-28 left-1/2 transform -translate-x-1/2 w-96 p-6 bg-white/95 backdrop-blur-md shadow-2xl border-2 border-amber-300 z-40 rounded-2xl">
                <div className="space-y-4">
                  <div className="border-b border-amber-200 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-xl flex items-center">
                        {getLandmarkIcon(position.landmark, module.completed, true)}
                        <span className="ml-2">{module.title}</span>
                      </h3>
                      <Badge
                        variant={module.completed ? "default" : "secondary"}
                        className={`text-sm ${module.completed ? "bg-green-500 text-white" : ""}`}
                      >
                        {module.completed ? "✓ Mastered" : "🎯 Ready"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{module.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{module.resources?.length || 0} resources</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{module.estimatedTime || "2-3 hours"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="capitalize">{position.biome} biome</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span>{position.landmark} landmark</span>
                    </div>
                  </div>

                  {module.learningObjectives && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                        <Target className="w-4 h-4 mr-2 text-amber-500" />
                        Quest Objectives:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {module.learningObjectives.slice(0, 3).map((objective, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-500 mt-0.5">⚡</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resource types preview with enhanced styling */}
                  <div className="flex flex-wrap gap-2">
                    {module.resources?.some((r: any) => r.type?.includes("video")) && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        <Play className="w-3 h-3 mr-1" />
                        Video Segments
                      </Badge>
                    )}
                    {module.resources?.some((r: any) => r.type?.includes("documentation")) && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        <FileText className="w-3 h-3 mr-1" />
                        Docs
                      </Badge>
                    )}
                    {module.resources?.some((r: any) => r.type?.includes("exercise")) && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <Code2 className="w-3 h-3 mr-1" />
                        Practice
                      </Badge>
                    )}
                  </div>

                  {module.unlocked && !module.completed && (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => handleModuleClick(module)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Begin Quest
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )
      })}

      {/* Enhanced legend */}
      <div className="absolute bottom-6 left-6 bg-amber-50/95 backdrop-blur-md rounded-xl p-5 border-2 border-amber-400 shadow-xl">
        <h4 className="text-sm font-bold text-amber-900 mb-4 flex items-center">
          <Compass className="w-5 h-5 mr-2 animate-spin" />
          Navigator's Guide
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full border-2 border-yellow-500 shadow-lg"></div>
            <span className="text-amber-800 font-medium">Quest Completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-blue-700 shadow-lg"></div>
            <span className="text-amber-800 font-medium">Ready to Explore</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-2 border-gray-700 opacity-70"></div>
            <span className="text-amber-800 font-medium">Locked Territory</span>
          </div>
        </div>
      </div>

      {/* Enhanced progress indicator */}
      <div className="absolute top-6 right-6 bg-amber-50/95 backdrop-blur-md rounded-xl p-5 border-2 border-amber-400 shadow-xl">
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-900 flex items-center justify-center">
            <Trophy className="w-8 h-8 mr-2 text-yellow-600" />
            {modules.filter((m) => m.completed).length}/{modules.length}
          </div>
          <div className="text-xs text-amber-700 font-medium">Treasures Discovered</div>
          <div className="mt-2 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating achievement notifications */}
      {modules.some((m) => m.completed) && (
        <div className="absolute top-20 right-6 animate-bounce">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Achievement Unlocked!</span>
          </div>
        </div>
      )}
    </div>
  )
}
