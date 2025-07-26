"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Lock,
  Star,
  Zap,
  Trophy,
  Crown,
  Target,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react"

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

interface Interactive3DMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
  onComplete: (moduleId: number) => void
  userLevel: number
  totalXP: number
  currentProgress: number
}

export function Interactive3DMap({
  modules,
  onModuleClick,
  onComplete,
  userLevel = 1,
  totalXP = 0,
  currentProgress = 0,
}: Interactive3DMapProps) {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, zoom: 1 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      z: number
      opacity: number
      color: string
      size: number
      velocity: { x: number; y: number; z: number }
      type: "spark" | "energy" | "magic"
    }>
  >([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize Web Audio Context
  useEffect(() => {
    if (typeof window !== "undefined" && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // 3D mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mapRef.current) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      setMousePosition({ x, y })
      setCameraPosition((prev) => ({
        ...prev,
        x: x * 10,
        y: y * 10,
      }))
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setCameraPosition((prev) => ({
        ...prev,
        zoom: Math.max(0.5, Math.min(2, prev.zoom + e.deltaY * -0.001)),
      }))
    }

    const mapElement = mapRef.current
    if (mapElement) {
      mapElement.addEventListener("mousemove", handleMouseMove)
      mapElement.addEventListener("wheel", handleWheel)
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener("mousemove", handleMouseMove)
        mapElement.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  // Advanced 3D particle system
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

      // Update particles
      setParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            z: particle.z + particle.velocity.z,
            opacity: particle.opacity - 0.003,
          }))
          .filter((p) => p.opacity > 0)

        // Add new particles
        if (Math.random() < 0.3 && updated.length < 100) {
          const types: Array<"spark" | "energy" | "magic"> = ["spark", "energy", "magic"]
          const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"]

          updated.push({
            id: Date.now() + Math.random(),
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            z: Math.random() * 100,
            opacity: 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 1,
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
              z: (Math.random() - 0.5) * 0.5,
            },
            type: types[Math.floor(Math.random() * types.length)],
          })
        }

        // Render particles with 3D effect
        updated.forEach((particle) => {
          const scale = 1 + particle.z * 0.01
          const x = particle.x + mousePosition.x * particle.z * 0.1
          const y = particle.y + mousePosition.y * particle.z * 0.1

          ctx.save()
          ctx.globalAlpha = particle.opacity
          ctx.fillStyle = particle.color

          if (particle.type === "spark") {
            ctx.beginPath()
            ctx.arc(x, y, particle.size * scale, 0, Math.PI * 2)
            ctx.fill()
          } else if (particle.type === "energy") {
            ctx.fillRect(
              x - (particle.size * scale) / 2,
              y - (particle.size * scale) / 2,
              particle.size * scale,
              particle.size * scale,
            )
          } else {
            // Magic particle - star shape
            ctx.translate(x, y)
            ctx.rotate(Date.now() * 0.001)
            ctx.beginPath()
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(
                Math.cos((i * 2 * Math.PI) / 5) * particle.size * scale,
                Math.sin((i * 2 * Math.PI) / 5) * particle.size * scale,
              )
            }
            ctx.closePath()
            ctx.fill()
          }

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
  }, [isPlaying, mousePosition])

  // 3D module positioning with depth
  const getModulePosition = useCallback((index: number) => {
    const centerX = 50
    const centerY = 50
    const radius = 35
    const angle = index * 30 * (Math.PI / 180)
    const spiralRadius = radius - index * 1.5
    const depth = index * 5 // Z-depth for 3D effect

    return {
      x: centerX + Math.cos(angle) * spiralRadius,
      y: centerY + Math.sin(angle) * spiralRadius,
      z: depth,
    }
  }, [])

  // Enhanced sound effects
  const playSound = useCallback(
    (type: "click" | "complete" | "unlock" | "hover") => {
      if (!soundEnabled || !audioContextRef.current) return

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      const soundMap = {
        click: { freq: 800, duration: 0.2, type: "sine" as OscillatorType },
        complete: { freq: 1200, duration: 0.5, type: "triangle" as OscillatorType },
        unlock: { freq: 600, duration: 0.3, type: "square" as OscillatorType },
        hover: { freq: 400, duration: 0.1, type: "sine" as OscillatorType },
      }

      const sound = soundMap[type]
      oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime)
      oscillator.type = sound.type
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + sound.duration)
    },
    [soundEnabled],
  )

  const handleModuleClick = useCallback(
    (module: Module) => {
      if (!module.unlocked) return

      setAnimatingModule(module.id)
      setSelectedModule(module.id)
      playSound("click")

      setTimeout(() => {
        setAnimatingModule(null)
        onModuleClick(module)
      }, 600)
    },
    [onModuleClick, playSound],
  )

  const handleModuleHover = useCallback(
    (moduleId: number | null) => {
      setHoveredModule(moduleId)
      if (moduleId) {
        playSound("hover")
      }
    },
    [playSound],
  )

  return (
    <div
      ref={mapRef}
      className="relative w-full h-[1000px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl"
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) scale(${cameraPosition.zoom})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* 3D Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="3dGrid" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="0.3" fill="#3B82F6" opacity="0.5">
                <animate attributeName="r" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100" height="100" fill="url(#3dGrid)" />
        </svg>
      </div>

      {/* 3D Learning Paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index)
          const nextPos = getModulePosition(index + 1)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              <defs>
                <linearGradient id={`3dPathGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={module.game_theme?.color_primary || "#3B82F6"} stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor={module.game_theme?.color_secondary || "#93C5FD"} stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Main 3D path */}
              <path
                d={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 8} ${nextPos.x} ${nextPos.y}`}
                stroke={isPathVisible ? `url(#3dPathGradient-${index})` : "#374151"}
                strokeWidth="3"
                fill="none"
                opacity={isPathVisible ? 1 : 0.3}
                filter="url(#glow)"
                className="transition-all duration-700"
                style={{
                  transform: `translateZ(${currentPos.z}px)`,
                }}
              />

              {/* Energy flow particles */}
              {isPathVisible && (
                <>
                  <circle r="1.5" fill={module.game_theme?.color_primary || "#3B82F6"} opacity="0.9">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      path={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 8} ${nextPos.x} ${nextPos.y}`}
                    />
                  </circle>
                  <circle r="1" fill="#FFFFFF" opacity="0.7">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      begin="1s"
                      path={`M ${currentPos.x} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 8} ${nextPos.x} ${nextPos.y}`}
                    />
                  </circle>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* 3D Module Nodes */}
      {modules.map((module, index) => {
        const position = getModulePosition(index)
        const isHovered = hoveredModule === module.id
        const isSelected = selectedModule === module.id
        const isAnimating = animatingModule === module.id

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 100 - index : 50 - index,
              transform: `
                translate(-50%, -50%) 
                translateZ(${position.z + (isHovered ? 20 : 0)}px) 
                scale(${isHovered ? 1.2 : isSelected ? 1.1 : 1})
                rotateX(${mousePosition.y * 5}deg) 
                rotateY(${mousePosition.x * 5}deg)
              `,
              transformStyle: "preserve-3d",
            }}
            onMouseEnter={() => handleModuleHover(module.id)}
            onMouseLeave={() => handleModuleHover(null)}
          >
            {/* 3D Glow Effect */}
            <div
              className={`absolute inset-0 w-28 h-28 rounded-full blur-2xl transition-all duration-500 ${
                module.completed
                  ? "bg-yellow-400/80 animate-pulse"
                  : module.unlocked
                    ? "bg-opacity-60 animate-pulse"
                    : "bg-gray-500/30"
              }`}
              style={{
                backgroundColor: module.unlocked ? `${module.game_theme?.color_primary}80` : undefined,
                transform: `translateZ(-10px) scale(${isHovered ? 1.5 : 1})`,
              }}
            />

            {/* Main 3D Module Sphere */}
            <div
              className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 cursor-pointer ${
                module.completed
                  ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 border-yellow-500 shadow-2xl"
                  : module.unlocked
                    ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-4 shadow-2xl hover:shadow-3xl"
                    : "bg-gradient-to-br from-gray-600 to-gray-800 border-gray-700 opacity-60"
              } ${isAnimating ? "animate-bounce" : ""}`}
              onClick={() => handleModuleClick(module)}
              style={{
                borderColor: module.unlocked ? module.game_theme?.color_primary : undefined,
                boxShadow: module.unlocked
                  ? `
                    0 25px 50px ${module.game_theme?.color_primary}60, 
                    0 0 0 3px ${module.game_theme?.color_primary}30,
                    inset 0 0 20px rgba(255,255,255,0.2)
                  `
                  : undefined,
                transform: `translateZ(${isHovered ? 10 : 0}px)`,
              }}
            >
              {/* Inner 3D Core */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute inset-4 rounded-full transition-all duration-300"
                  style={{
                    background: `
                      radial-gradient(circle at 30% 30%, ${module.game_theme?.color_primary}FF, ${module.game_theme?.color_secondary}AA),
                      linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})
                    `,
                    transform: `translateZ(5px)`,
                  }}
                />
              )}

              {/* 3D Icon */}
              <div
                className="absolute inset-0 flex items-center justify-center text-4xl z-10"
                style={{ transform: `translateZ(10px)` }}
              >
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-2xl" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-12 h-12 text-yellow-200 opacity-40" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <span className="text-white drop-shadow-2xl font-bold text-3xl animate-pulse filter drop-shadow-lg">
                    {module.game_theme?.icon}
                  </span>
                ) : (
                  <Lock className="w-10 h-10 text-gray-400" />
                )}
              </div>

              {/* 3D Level Badge */}
              <div
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full border-3 border-white flex items-center justify-center shadow-2xl text-sm font-bold text-white"
                style={{
                  backgroundColor: module.game_theme?.color_primary || "#3B82F6",
                  transform: `translateZ(15px)`,
                }}
              >
                {module.id}
              </div>

              {/* 3D XP Indicator */}
              {module.unlocked && !module.completed && (
                <div
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-2 rounded-full font-bold shadow-2xl animate-bounce"
                  style={{ transform: `translateZ(15px)` }}
                >
                  +{module.xp_reward}
                </div>
              )}

              {/* Completion Effects */}
              {module.completed && (
                <>
                  <div className="absolute -inset-6 rounded-full border-4 border-yellow-400 animate-pulse opacity-60" />
                  <div className="absolute -inset-8">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          top: `${50 + Math.sin((i * 22.5 * Math.PI) / 180) * 45}%`,
                          left: `${50 + Math.cos((i * 22.5 * Math.PI) / 180) * 45}%`,
                          animationDelay: `${i * 0.1}s`,
                          transform: `translateZ(${5 + i}px)`,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 3D Info Panel */}
            {isHovered && module.unlocked && (
              <div
                className="absolute top-32 left-1/2 transform -translate-x-1/2 w-96 p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 z-50 transition-all duration-300"
                style={{
                  borderColor: module.game_theme?.color_primary,
                  transform: `translateX(-50%) translateZ(50px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl mb-4" style={{ transform: `translateZ(10px)` }}>
                      {module.game_theme?.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{module.game_theme?.world}</h3>
                    <p className="text-gray-600 leading-relaxed">{module.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Star, label: "Resources", value: module.resources?.length || 0, color: "blue" },
                      { icon: Zap, label: "Time", value: `${module.estimated_hours}h`, color: "green" },
                      { icon: Trophy, label: "XP", value: module.xp_reward, color: "purple" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-2xl p-4 text-center border border-${stat.color}-200`}
                        style={{ transform: `translateZ(${5 + i * 2}px)` }}
                      >
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 mx-auto mb-2`} />
                        <div className={`text-xs text-${stat.color}-600 font-medium`}>{stat.label}</div>
                        <div className={`text-xl font-bold text-${stat.color}-900`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full text-white shadow-lg transform hover:scale-105 transition-all duration-200 text-lg py-6"
                    style={{
                      background: `linear-gradient(135deg, ${module.game_theme?.color_primary}, ${module.game_theme?.color_secondary})`,
                      transform: `translateZ(10px)`,
                    }}
                    onClick={() => handleModuleClick(module)}
                  >
                    <Target className="w-5 h-5 mr-3" />
                    {module.completed ? "Review Quest" : "Begin Adventure"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* 3D Control Panel */}
      <div
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
        style={{ transform: `translateZ(100px)`, transformStyle: "preserve-3d" }}
      >
        <div className="text-center space-y-6">
          <div className="text-4xl font-bold text-white flex items-center justify-center">
            <Crown className="w-10 h-10 mr-3 text-amber-400" />
            Level {userLevel}
          </div>

          <div className="space-y-3">
            <div className="text-sm text-blue-200">
              {modules.filter((m) => m.completed).length}/{modules.length} Realms Conquered
            </div>

            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                style={{
                  width: `${Math.min((totalXP % 1000) / 10, 100)}%`,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
            <div className="text-xs text-blue-300 font-bold">{totalXP} XP</div>
          </div>

          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-amber-400 fill-amber-400 animate-pulse filter drop-shadow-lg"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center space-x-3 pt-4 border-t border-white/20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-12 h-12 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParticles([])}
              className="w-12 h-12 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Legend */}
      <div
        className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
        style={{ transform: `translateZ(100px)`, transformStyle: "preserve-3d" }}
      >
        <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-7 h-7 mr-3 text-blue-400" />
          Adventure Map
        </h4>
        <div className="space-y-4 text-sm">
          {[
            {
              bg: "bg-gradient-to-br from-yellow-300 to-amber-400",
              border: "border-yellow-500",
              label: "Conquered",
              icon: "👑",
            },
            {
              bg: "bg-gradient-to-br from-white to-gray-200",
              border: "border-blue-500",
              label: "Available",
              icon: "⚡",
            },
            {
              bg: "bg-gradient-to-br from-gray-600 to-gray-800",
              border: "border-gray-700",
              label: "Locked",
              icon: "🔒",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 ${item.bg} rounded-full border-2 ${item.border} shadow-lg flex items-center justify-center text-sm`}
              >
                {item.icon}
              </div>
              <span className="text-white font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
