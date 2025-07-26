"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, Sparkles, Crown, Star, Zap } from "lucide-react"

interface Module {
  id: number
  title: string
  description: string
  unlocked: boolean
  completed: boolean
  resources: any[]
  fantasy_theme: {
    location: string
    icon: string
    ambient_sound: string
    background_image: string
    completion_animation: string
  }
  auto_generated_exercise: any
  estimated_hours: number
}

interface ImmersiveMapProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
  onComplete: (moduleId: number) => void
}

export function ImmersiveMapInterface({ modules, onModuleClick, onComplete }: ImmersiveMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [animatingModule, setAnimatingModule] = useState<number | null>(null)
  const [currentAmbientSound, setCurrentAmbientSound] = useState<string | null>(null)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; opacity: number; type: string }>
  >([])
  const [completionEffect, setCompletionEffect] = useState<{ moduleId: number; timestamp: number } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Enter fullscreen immersive mode
  useEffect(() => {
    const enterFullscreen = () => {
      if (mapRef.current) {
        if (mapRef.current.requestFullscreen) {
          mapRef.current.requestFullscreen()
        }
        setIsFullscreen(true)
      }
    }

    const exitFullscreen = () => {
      setIsFullscreen(false)
    }

    document.addEventListener("fullscreenchange", () => {
      setIsFullscreen(!!document.fullscreenElement)
    })

    // Auto-enter fullscreen when component mounts
    setTimeout(enterFullscreen, 1000)

    return () => {
      document.removeEventListener("fullscreenchange", exitFullscreen)
    }
  }, [])

  // Ambient sound management
  useEffect(() => {
    if (currentAmbientSound && isFullscreen) {
      playAmbientSound(currentAmbientSound)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [currentAmbientSound, isFullscreen])

  // Particle system for magical atmosphere
  useEffect(() => {
    if (!isFullscreen) return

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((p) => ({
            ...p,
            y: p.y - 0.5,
            opacity: p.opacity - 0.005,
            x: p.x + (Math.random() - 0.5) * 0.2,
          }))
          .filter((p) => p.opacity > 0)

        // Add new particles
        if (Math.random() < 0.3) {
          const particleTypes = ["✨", "🌟", "💫", "⭐", "🔮", "💎"]
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: 100,
            opacity: 0.8,
            type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
          })
        }

        return newParticles
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isFullscreen])

  // Completion effect animation
  useEffect(() => {
    if (completionEffect) {
      const timer = setTimeout(() => {
        setCompletionEffect(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [completionEffect])

  const getModulePosition = (index: number) => {
    const positions = [
      { x: 15, y: 85, biome: "mystical_shores" },
      { x: 25, y: 70, biome: "enchanted_forest" },
      { x: 40, y: 75, biome: "crystal_caves" },
      { x: 55, y: 60, biome: "floating_islands" },
      { x: 70, y: 65, biome: "ancient_temple" },
      { x: 80, y: 45, biome: "sky_castle" },
      { x: 85, y: 30, biome: "dragon_peak" },
      { x: 90, y: 20, biome: "celestial_tower" },
      { x: 92, y: 15, biome: "masters_sanctum" },
      { x: 88, y: 8, biome: "infinity_realm" },
      { x: 85, y: 5, biome: "transcendence" },
      { x: 90, y: 3, biome: "mastery_crown" },
    ]

    return positions[index] || { x: 50, y: 50, biome: "unknown_realm" }
  }

  const playAmbientSound = (soundType: string) => {
    // In a real implementation, you'd load actual audio files
    console.log(`🔊 Playing ambient sound: ${soundType}`)

    // Simulate audio with Web Audio API for immersive experience
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create different ambient sounds based on type
      const createAmbientTone = (frequency: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5)
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      }

      // Different ambient sounds for different biomes
      const soundMap: { [key: string]: () => void } = {
        ocean_waves: () => createAmbientTone(220, 2),
        forest_ambience: () => createAmbientTone(330, 1.5),
        mountain_wind: () => createAmbientTone(440, 1.8),
        cave_echoes: () => createAmbientTone(165, 2.2),
        magical_hum: () => createAmbientTone(528, 1.2),
        castle_ambience: () => createAmbientTone(396, 2.5),
      }

      const soundFunction = soundMap[soundType]
      if (soundFunction) {
        soundFunction()
      }
    }
  }

  const playCompletionSound = () => {
    console.log("🎵 Playing completion sound")

    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create a magical completion chord
      const frequencies = [523.25, 659.25, 783.99] // C, E, G major chord

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

        oscillator.start(audioContext.currentTime + index * 0.1)
        oscillator.stop(audioContext.currentTime + 1.5)
      })
    }
  }

  const handleModuleClick = (module: Module) => {
    if (!module.unlocked) return

    setAnimatingModule(module.id)
    setCurrentAmbientSound(module.fantasy_theme.ambient_sound)

    // Play click sound
    playAmbientSound("magical_hum")

    setTimeout(() => {
      setAnimatingModule(null)
      onModuleClick(module)
    }, 800)
  }

  const handleModuleComplete = (moduleId: number) => {
    setCompletionEffect({ moduleId, timestamp: Date.now() })
    playCompletionSound()

    setTimeout(() => {
      onComplete(moduleId)
    }, 1500)
  }

  const getPathBetweenPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 8
    const midY = (start.y + end.y) / 2 - 6
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  if (!isFullscreen) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl">
        <div className="text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold mb-2">Entering the Magical Realm...</h3>
          <p className="text-purple-200">Preparing your immersive learning adventure</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden cursor-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl pointer-events-none animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.opacity})`,
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
            }}
          >
            {particle.type}
          </div>
        ))}

        {/* Mystical aurora effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse transform rotate-12 scale-150" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse transform -rotate-12 scale-150 animation-delay-1000" />
        </div>

        {/* Constellation patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100}
              cy={Math.random() * 100}
              r="0.1"
              fill="white"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Learning path with magical trails */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.slice(0, -1).map((module, index) => {
          const currentPos = getModulePosition(index)
          const nextPos = getModulePosition(index + 1)
          const isPathVisible = module.completed || modules[index + 1]?.unlocked

          return (
            <g key={`path-${index}`}>
              {/* Main magical path */}
              <path
                d={getPathBetweenPoints(currentPos, nextPos)}
                stroke={isPathVisible ? "url(#magicalGradient)" : "rgba(255, 255, 255, 0.2)"}
                strokeWidth="0.8"
                fill="none"
                opacity={isPathVisible ? 0.9 : 0.3}
                filter="drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))"
              />

              {/* Animated energy flow */}
              {isPathVisible && (
                <path
                  d={getPathBetweenPoints(currentPos, nextPos)}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="0.3"
                  fill="none"
                  strokeDasharray="2,4"
                  opacity="0.8"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur="2s" repeatCount="indefinite" />
                </path>
              )}

              {/* Path sparkles */}
              {isPathVisible && (
                <circle
                  cx={(currentPos.x + nextPos.x) / 2}
                  cy={(currentPos.y + nextPos.y) / 2}
                  r="0.3"
                  fill="white"
                  opacity="0.8"
                >
                  <animate attributeName="r" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="magicalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Module stones with enhanced fantasy styling */}
      {modules.map((module, index) => {
        const position = getModulePosition(index)
        const isHovered = hoveredModule === module.id
        const isAnimating = animatingModule === module.id
        const isCompleting = completionEffect?.moduleId === module.id

        return (
          <div
            key={module.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: module.unlocked ? 50 : 30,
            }}
            onMouseEnter={() => {
              setHoveredModule(module.id)
              if (module.unlocked) {
                setCurrentAmbientSound(module.fantasy_theme.ambient_sound)
              }
            }}
            onMouseLeave={() => setHoveredModule(null)}
          >
            {/* Magical aura */}
            <div
              className={`absolute inset-0 w-24 h-24 rounded-full blur-xl transition-all duration-700 ${
                module.completed
                  ? "bg-yellow-400/60 animate-pulse"
                  : module.unlocked
                    ? "bg-purple-500/40 animate-pulse"
                    : "bg-gray-500/20"
              }`}
            />

            {/* Enhanced module stone */}
            <div
              className={`relative w-20 h-20 rounded-full border-4 transition-all duration-700 cursor-pointer ${
                module.completed
                  ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-yellow-600 shadow-2xl shadow-yellow-400/60"
                  : module.unlocked
                    ? "bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-500 border-purple-600 shadow-2xl shadow-purple-400/60 hover:scale-125"
                    : "bg-gradient-to-br from-gray-600 to-gray-800 border-gray-700 opacity-50"
              } ${isHovered && module.unlocked ? "scale-125 shadow-3xl" : ""} ${
                isAnimating ? "scale-150 animate-bounce" : ""
              } ${isCompleting ? "animate-ping scale-150" : ""}`}
              onClick={() => handleModuleClick(module)}
              style={{
                filter: module.unlocked ? "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))" : "none",
              }}
            >
              {/* Mystical texture overlay */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

              {/* Rotating magical ring */}
              {module.unlocked && (
                <div
                  className="absolute -inset-2 rounded-full border-2 border-white/30 animate-spin"
                  style={{ animationDuration: "8s" }}
                />
              )}

              {/* Fantasy icon */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {module.completed ? (
                  <div className="relative">
                    <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 animate-ping">
                      <CheckCircle className="w-10 h-10 text-yellow-200 opacity-40" />
                    </div>
                  </div>
                ) : module.unlocked ? (
                  <div className="relative">
                    <span className="text-white drop-shadow-lg filter text-2xl animate-pulse">
                      {module.fantasy_theme.icon}
                    </span>
                    {isHovered && (
                      <div className="absolute -inset-4">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                            style={{
                              top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 30}%`,
                              left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 30}%`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Lock className="w-8 h-8 text-gray-300 opacity-70" />
                )}
              </div>

              {/* Module number with mystical styling */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">{module.id}</span>
              </div>

              {/* Completion celebration effects */}
              {module.completed && (
                <>
                  <div className="absolute -inset-4 rounded-full border-2 border-yellow-400 animate-pulse opacity-60" />
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

              {/* Unlock energy waves */}
              {module.unlocked && !module.completed && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-400/20 to-cyan-400/20 animate-pulse" />
                  <div className="absolute -inset-2 rounded-full border border-purple-300/50 animate-pulse" />
                </>
              )}
            </div>

            {/* Immersive module info on hover */}
            {isHovered && module.unlocked && (
              <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-96 p-6 bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/50 shadow-2xl z-50">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{module.fantasy_theme.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.fantasy_theme.location}</h3>
                    <p className="text-purple-200 text-sm leading-relaxed">{module.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-cyan-300">
                      <Star className="w-4 h-4" />
                      <span>{module.resources?.length || 0} Artifacts</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Zap className="w-4 h-4" />
                      <span>{module.estimated_hours}h Quest</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-600/50 text-purple-100 border-purple-400/50">
                      {module.fantasy_theme.location}
                    </Badge>
                    {module.completed && (
                      <Badge className="bg-yellow-600/50 text-yellow-100 border-yellow-400/50">
                        <Crown className="w-3 h-3 mr-1" />
                        Mastered
                      </Badge>
                    )}
                  </div>

                  {module.unlocked && !module.completed && (
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                      onClick={() => handleModuleClick(module)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Begin Quest
                    </Button>
                  )}

                  {module.completed && (
                    <Button
                      variant="outline"
                      className="w-full border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10 bg-transparent"
                      onClick={() => handleModuleComplete(module.id)}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Quest Complete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Immersive progress indicator */}
      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center">
            <Crown className="w-8 h-8 mr-2 text-yellow-400" />
            {modules.filter((m) => m.completed).length}/{modules.length}
          </div>
          <div className="text-sm text-purple-200 font-medium">Realms Conquered</div>
          <div className="mt-3 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor((modules.filter((m) => m.completed).length / modules.length) * 5)
                    ? "text-yellow-400 fill-yellow-400 animate-pulse"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mystical legend */}
      <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
          Realm Guide
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full border-2 border-yellow-600 shadow-lg"></div>
            <span className="text-yellow-200 font-medium">Realm Mastered</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-500 rounded-full border-2 border-purple-600 shadow-lg"></div>
            <span className="text-purple-200 font-medium">Ready to Explore</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full border-2 border-gray-700 opacity-50"></div>
            <span className="text-gray-400 font-medium">Sealed Realm</span>
          </div>
        </div>
      </div>

      {/* Exit fullscreen hint */}
      <div className="absolute top-8 left-8 text-white/60 text-sm">Press ESC to exit immersive mode</div>

      {/* Completion celebration overlay */}
      {completionEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 animate-pulse pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
    </div>
  )
}
