"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, Star, Zap, Trophy, Crown, Target, Sparkles } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: any[]
  game_theme: {
    world: string
    icon: string
    color_primary: string
    color_secondary: string
    completion_effect: string
    unlock_animation: string
  }
  auto_generated_exercise: any
  estimated_hours: number
  xp_reward: number
  level_requirement: number
}

interface BrilliantGameMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
  onComplete: (moduleId: number) => void
  userLevel: number
  totalXP: number
}

export function BrilliantGameMap({
  modules,
  onModuleClick,
  onComplete,
  userLevel = 1,
  totalXP = 0,
}: BrilliantGameMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [completionEffect, setCompletionEffect] = useState<{ moduleId: number; timestamp: number } | null>(null)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; opacity: number; color: string }>
  >([])
  const mapRef = useRef<HTMLDivElement>(null)

  // Particle system for ambient effects
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({
            ...p,
            y: p.y - 0.3,
            opacity: p.opacity - 0.008,
            x: p.x + (Math.random() - 0.5) * 0.1,
          }))
          .filter((p) => p.opacity > 0)

        // Add new particles
        if (Math.random() < 0.2) {
          const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: 100,
            opacity: 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
          })
        }

        return newParticles
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Completion effect cleanup
  useEffect(() => {
    if (completionEffect) {
      const timer = setTimeout(() => {
        setCompletionEffect(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [completionEffect])

  const getModulePosition = (index: number) => {
    // Brilliant.org style positioning - curved path with strategic spacing
    const positions = [
      { x: 10, y: 85, path: "start" },
      { x: 20, y: 75, path: "curve" },
      { x: 35, y: 70, path: "straight" },
      { x: 50, y: 65, path: "curve" },
      { x: 65, y: 55, path: "straight" },
      { x: 75, y: 40, path: "curve" },
      { x: 80, y: 25, path: "straight" },
      { x: 85, y: 15, path: "curve" },
      { x: 90, y: 10, path: "final" },
      { x: 92, y: 8, path: "mastery" },
      { x: 94, y: 6, path: "legend" },
      { x: 96, y: 4, path: "transcendence" },
    ]

    return positions[index] || { x: 50, y: 50, path: "default" }
  }

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return

    setAnimatingModule(module.id)

    // Play click sound effect
    playSound("click")

    setTimeout(() => {
      setAnimatingModule(null)
      onModuleClick(module)
    }, 600)
  }

  const handleModuleComplete = (moduleId: number) => {
    setCompletionEffect({ moduleId, timestamp: Date.now() })
    playSound("complete")

    setTimeout(() => {
      onComplete(moduleId)
    }, 1000)
  }

  const playSound = (type: "click" | "complete" | "unlock") => {
    // Web Audio API for game-like sound effects
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      const soundMap = {
        click: () => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.type = "sine"
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.2)
        },
        complete: () => {
          // Success chord
          const frequencies = [523.25, 659.25, 783.99, 1046.5] // C, E, G, C
          frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
            oscillator.type = "sine"
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + index * 0.1)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
            oscillator.start(audioContext.currentTime + index * 0.1)
            oscillator.stop(audioContext.currentTime + 1.5)
          })
        },
        unlock: () => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3)
          oscillator.type = "triangle"
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
        },
      }

      soundMap[type]?.()
    }
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 3
    const midY = (start.y + end.y) / 2 - 3
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div
      ref={mapRef}
      className="relative w-full h-[800px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}

      {/* Learning path with smooth curves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index)
          const nextPos = getModulePosition(index + 1)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Main path */}
              <path
                d={getPathBetweenPoints(currentPos, nextPos)}
                stroke={isPathVisible ? module.game_theme?.color_primary || "#3B82F6" : "#e2e8f0"}
                strokeWidth="1.2"
                fill="none"
                opacity={isPathVisible ? 0.8 : 0.4}
                strokeDasharray={isPathVisible ? "none" : "3,3"}
                className="transition-all duration-500"
              />

              {/* Animated energy flow */}
              {isPathVisible && (
                <path
                  d={getPathBetweenPoints(currentPos, nextPos)}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeDasharray="2,6"
                  opacity="0.6"
                >
                  <animate attributeName="stroke-dashoffset" values="0;8" dur="2s" repeatCount="indefinite" />
                </path>
              )}

              {/* Path nodes */}
              {isPathVisible && (
                <circle
                  cx={(currentPos.x + nextPos.x) / 2}
                  cy={(currentPos.y + nextPos.y) / 2}
                  r="0.3"
                  fill={module.game_theme?.color_primary || "#3B82F6"}
                  opacity="0.6"
                >
                  <animate attributeName="r" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      {/* Module nodes with Brilliant.org styling */}
      {modules.map((module, index) => {
        const position = getModulePosition(index)
        const isHovered = hoveredModule === module.id
        const isAnimating = animatingModule === module.id
        const isCompleting = completionEffect?.moduleId === module.id

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 50 : 30,
            }}
            onMouseEnter={() => {
              setHoveredModule(module.id)
              if (module.unlocked) playSound("click")
            }}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Module shadow */}
            <div
              className={`absolute inset-0 w-20 h-20 rounded-full blur-xl transition-all duration-500 ${
                module.completed
                  ? "bg-yellow-400/40 animate-pulse"
                  : module.unlocked
                    ? `bg-opacity-30 animate-pulse`
                    : "bg-gray-400/20"
              }`}
              style={{
                backgroundColor: module.unlocked ? `${module.game_theme?.color_primary}40` : undefined,
              }}
            />

            {/* Main module circle - Brilliant.org style */}
            <div
              className={`relative w-16 h-16 rounded-full border-4 transition-all duration-500 cursor-pointer ${
                module.completed
                  ? "bg-gradient-to-br from-yellow-300 to-amber-400 border-yellow-500 shadow-2xl"
                  : module.unlocked
                    ? "bg-white border-4 shadow-2xl hover:scale-110"
                    : "bg-gray-200 border-gray-400 opacity-60"
              } ${isHovered && module.unlocked ? "scale-110 shadow-3xl" : ""} ${
                isAnimating ? "scale-125 animate-bounce" : ""
              } ${isCompleting ? "animate-ping scale-125" : ""}`}
              onClick={() => handleModuleClick(module)}
              style={{
                borderColor: module.unlocked ? module.game_theme?.color_primary : undefined,
                boxShadow: module.unlocked
                  ? `0 10px 30px ${module.game_theme?.color_primary}40, 0 0 0 1px ${module.game_theme?.color_primary}20`
                  : undefined,
              }}
            >
              {/* Inner colored circle */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute inset-2 rounded-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                  }}
                />
              )}

              {/* Module icon */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl z-10">
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-8 h-8 text-yellow-200 opacity-40" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <span className="text-white drop-shadow-lg font-bold text-xl">{module.game_theme?.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-gray-500" />
                )}
              </div>

              {/* Level number badge */}
              <div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-xs font-bold text-white"
                style={{
                  backgroundColor: module.game_theme?.color_primary || "#3B82F6",
                }}
              >
                {module.id}
              </div>

              {/* XP reward indicator */}
              {module.unlocked && !module.completed && (
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                  +{module.xp_reward}
                </div>
              )}

              {/* Completion celebration effects */}
              {module.completed && (
                <>
                  <div className="absolute -inset-3 rounded-full border-2 border-yellow-400 animate-pulse opacity-60" />
                  <div className="absolute -inset-5">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 35}%`,
                          left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 35}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Unlock pulse effect */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute -inset-2 rounded-full animate-pulse opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                  }}
                />
              )}
            </div>

            {/* Module info card - Brilliant.org style */}
            {isHovered && module.unlocked && (
              <div
                className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 p-6 bg-white rounded-2xl shadow-2xl border z-50 transition-all duration-300"
                style={{
                  borderColor: module.game_theme?.color_primary,
                  borderWidth: "2px",
                }}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-3xl mb-2">{module.game_theme?.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{module.game_theme?.world}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-xs text-gray-600">Resources</div>
                      <div className="font-bold text-gray-900">{module.resources?.length || 0}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-xs text-gray-600">Time</div>
                      <div className="font-bold text-gray-900">{module.estimated_hours}h</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Trophy className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-xs text-gray-600">XP</div>
                      <div className="font-bold text-gray-900">{module.xp_reward}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: `${module.game_theme?.color_primary}20`,
                        color: module.game_theme?.color_primary,
                        borderColor: `${module.game_theme?.color_primary}40`,
                      }}
                    >
                      Level {module.id}
                    </Badge>
                    {module.completed && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>

                  {/* Action button */}
                  {module.unlocked && !module.completed && (
                    <Button
                      className="w-full text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                      }}
                      onClick={() => handleModuleClick(module)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  )}

                  {module.completed && (
                    <Button
                      variant="outline"
                      className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                      onClick={() => handleModuleComplete(module.id)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Review & Continue
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Progress indicator - Brilliant.org style */}
      <div className="absolute top-6 right-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 flex items-center justify-center mb-2">
            <Crown className="w-8 h-8 mr-2 text-amber-500" />
            Level {userLevel}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {modules.filter((m) => m.completed).length}/{modules.length} Worlds Conquered
          </div>

          {/* XP Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalXP % 1000) / 10, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">{totalXP} XP</div>

          {/* Achievement stars */}
          <div className="mt-3 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend - Brilliant.org style */}
      <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" />
          Learning Path
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full border-2 border-yellow-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-white rounded-full border-2 border-blue-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full border-2 border-gray-400 opacity-60"></div>
            <span className="text-gray-700 font-medium">Locked</span>
          </div>
        </div>
      </div>

      {/* Completion celebration overlay */}
      {completionEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-orange-400/20 animate-pulse pointer-events-none flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  )
}
