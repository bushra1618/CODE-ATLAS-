"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lock, Star, Zap, Trophy, Crown, Target, Play, Pause, RotateCcw } from "lucide-react"

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
  estimated_hours: number
  xp_reward: number
  level_requirement: number
}

interface BrilliantGameInterfaceProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
  onComplete: (moduleId: number) => void
  userLevel: number
  totalXP: number
  currentProgress: number
}

export function BrilliantGameInterface({
  modules,
  onModuleClick,
  onComplete,
  userLevel = 1,
  totalXP = 0,
  currentProgress = 0,
}: BrilliantGameInterfaceProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      opacity: number
      color: string
      size: number
      velocity: { x: number; y: number }
    }>
  >([])
  const [isPlaying, setIsPlaying] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Brilliant.org style particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      setParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            opacity: particle.opacity - 0.005,
          }))
          .filter((p) => p.opacity > 0)

        // Add new particles occasionally
        if (Math.random() < 0.1 && updated.length < 50) {
          updated.push({
            id: Date.now() + Math.random(),
            x: Math.random() * canvas.offsetWidth,
            y: canvas.offsetHeight + 10,
            opacity: 0.8,
            color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
            size: Math.random() * 3 + 1,
            velocity: {
              x: (Math.random() - 0.5) * 0.5,
              y: -Math.random() * 2 - 0.5,
            },
          })
        }

        // Draw particles
        updated.forEach((particle) => {
          ctx.save()
          ctx.globalAlpha = particle.opacity
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        return updated
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const getModulePosition = (index: number) => {
    // Brilliant.org style spiral path
    const centerX = 50
    const centerY = 50
    const radius = 30
    const angle = index * 45 * (Math.PI / 180)
    const spiralRadius = radius - index * 2

    return {
      x: centerX + Math.cos(angle) * spiralRadius,
      y: centerY + Math.sin(angle) * spiralRadius,
    }
  }

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return

    setAnimatingModule(module.id)

    // Play click sound effect (Web Audio API)
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
    }

    setTimeout(() => {
      setAnimatingModule(null)
      onModuleClick(module)
    }, 300)
  }

  return (
    <div className="relative w-full h-[900px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="brilliantGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="0.5" fill="#3B82F6" opacity="0.3">
                <animate attributeName="r" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#brilliantGrid)" />
        </svg>
      </div>

      {/* Learning path with smooth curves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index)
          const nextPos = getModulePosition(index + 1)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Main path with gradient */}
              <defs>
                <linearGradient id={`pathGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={module.game_theme?.color_primary || "#3B82F6"} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={module.game_theme?.color_secondary || "#93C5FD"} stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <path
                d={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 5} ${nextPos.x} ${nextPos.y}`}
                stroke={isPathVisible ? `url(#pathGradient-${index})` : "#e2e8f0"}
                strokeWidth="2"
                fill="none"
                opacity={isPathVisible ? 1 : 0.3}
                className="transition-all duration-700"
              />

              {/* Animated energy flow */}
              {isPathVisible && (
                <circle r="1" fill={module.game_theme?.color_primary || "#3B82F6"} opacity="0.8">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 5} ${nextPos.x} ${nextPos.y}`}
                  />
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

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 50 : 30,
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Brilliant.org style glow effect */}
            <div
              className={`absolute inset-0 w-24 h-24 rounded-full blur-xl transition-all duration-500 ${
                module.completed
                  ? "bg-yellow-400/60 animate-pulse"
                  : module.unlocked
                    ? "bg-opacity-40 animate-pulse"
                    : "bg-gray-400/20"
              }`}
              style={{
                backgroundColor: module.unlocked ? `${module.game_theme?.color_primary}60` : undefined,
                transform: isHovered ? "scale(1.2)" : "scale(1)",
              }}
            />

            {/* Main module circle */}
            <div
              className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 cursor-pointer ${
                module.completed
                  ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 border-yellow-500 shadow-2xl"
                  : module.unlocked
                    ? "bg-white border-4 shadow-2xl hover:scale-110"
                    : "bg-gray-200 border-gray-400 opacity-60"
              } ${isHovered && module.unlocked ? "scale-110 shadow-3xl" : ""} ${
                isAnimating ? "scale-125 animate-bounce" : ""
              }`}
              onClick={() => handleModuleClick(module)}
              style={{
                borderColor: module.unlocked ? module.game_theme?.color_primary : undefined,
                boxShadow: module.unlocked
                  ? `0 20px 40px ${module.game_theme?.color_primary}40, 0 0 0 2px ${module.game_theme?.color_primary}20`
                  : undefined,
              }}
            >
              {/* Inner gradient circle */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute inset-3 rounded-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                  }}
                />
              )}

              {/* Module icon with animations */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl z-10">
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-10 h-10 text-yellow-200 opacity-40" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <span className="text-white drop-shadow-lg font-bold text-2xl animate-pulse">
                    {module.game_theme?.icon}
                  </span>
                ) : (
                  <Lock className="w-8 h-8 text-gray-500" />
                )}
              </div>

              {/* Level badge */}
              <div
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full border-3 border-white flex items-center justify-center shadow-lg text-sm font-bold text-white"
                style={{
                  backgroundColor: module.game_theme?.color_primary || "#3B82F6",
                }}
              >
                {module.id}
              </div>

              {/* XP reward indicator */}
              {module.unlocked && !module.completed && (
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
                  +{module.xp_reward}
                </div>
              )}

              {/* Completion celebration effects */}
              {module.completed && (
                <>
                  <div className="absolute -inset-4 rounded-full border-3 border-yellow-400 animate-pulse opacity-60" />
                  <div className="absolute -inset-6">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          top: `${50 + Math.sin((i * 30 * Math.PI) / 180) * 40}%`,
                          left: `${50 + Math.cos((i * 30 * Math.PI) / 180) * 40}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Unlock pulse effect */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute -inset-3 rounded-full animate-pulse opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${module.game_theme?.color_primary}40, transparent 70%)`,
                  }}
                />
              )}
            </div>

            {/* Brilliant.org style info card */}
            {isHovered && module.unlocked && (
              <div
                className="absolute top-24 left-1/2 transform -translate-x-1/2 w-96 p-8 bg-white rounded-3xl shadow-2xl border-2 z-50 transition-all duration-300 animate-slideUp"
                style={{
                  borderColor: module.game_theme?.color_primary,
                }}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-4xl mb-3">{module.game_theme?.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{module.game_theme?.world}</h3>
                    <p className="text-gray-600 leading-relaxed">{module.description}</p>
                  </div>

                  {/* Stats with brilliant.org style */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
                      <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs text-blue-600 font-medium">Resources</div>
                      <div className="text-xl font-bold text-blue-900">{module.resources?.length || 0}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
                      <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xs text-green-600 font-medium">Time</div>
                      <div className="text-xl font-bold text-green-900">{module.estimated_hours}h</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
                      <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xs text-purple-600 font-medium">XP</div>
                      <div className="text-xl font-bold text-purple-900">{module.xp_reward}</div>
                    </div>
                  </div>

                  {/* Progress bar for current module */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{module.completed ? "100%" : "0%"}</span>
                    </div>
                    <Progress
                      value={module.completed ? 100 : 0}
                      className="h-2"
                      style={{
                        backgroundColor: `${module.game_theme?.color_primary}20`,
                      }}
                    />
                  </div>

                  {/* Action button */}
                  <Button
                    className="w-full text-white shadow-lg transform hover:scale-105 transition-all duration-200 text-lg py-6"
                    style={{
                      background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                    }}
                    onClick={() => handleModuleClick(module)}
                  >
                    <Target className="w-5 h-5 mr-3" />
                    {module.completed ? "Review Module" : "Start Learning"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Brilliant.org style control panel */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200">
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <Crown className="w-8 h-8 mr-3 text-amber-500" />
            Level {userLevel}
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              {modules.filter((m) => m.completed).length}/{modules.length} Worlds Conquered
            </div>

            {/* XP Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((totalXP % 1000) / 10, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{totalXP} XP</div>
          </div>

          {/* Achievement stars */}
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-amber-400 fill-amber-400 animate-pulse"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Animation controls */}
          <div className="flex justify-center space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 p-0">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setParticles([])} className="w-10 h-10 p-0">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Brilliant.org style legend */}
      <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-500" />
          Learning Universe
        </h4>
        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full border-2 border-yellow-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Mastered</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-white rounded-full border-2 border-blue-500 shadow-lg"></div>
            <span className="text-gray-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-gray-400 opacity-60"></div>
            <span className="text-gray-700 font-medium">Locked</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
