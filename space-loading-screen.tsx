"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Brain, Search, Cpu, Rocket, Star, Satellite } from "lucide-react"

interface SpaceLoadingScreenProps {
  isVisible: boolean
  onComplete: () => void
}

interface LoadingPhase {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  duration: number
  effects: string[]
}

export function SpaceLoadingScreen({ isVisible, onComplete }: SpaceLoadingScreenProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 90 })
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; opacity: number; size: number }>>([])
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])
  const [showExplosion, setShowExplosion] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const phases: LoadingPhase[] = [
    {
      id: "initialization",
      title: "Initializing AI System",
      description: "Preparing your personalized learning universe...",
      icon: <Satellite className="w-8 h-8" />,
      color: "from-blue-500 to-purple-600",
      duration: 1500,
      effects: ["🤖 AI systems online", "🌟 Neural networks activated", "🎮 Learning parameters set"],
    },
    {
      id: "analysis",
      title: "Analyzing Your Profile",
      description: "Advanced AI analyzing your coding background...",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      duration: 2000,
      effects: ["🧠 Processing experience level", "⚡ Mapping skill gaps", "🎯 Identifying learning style"],
    },
    {
      id: "discovery",
      title: "Scanning Resources",
      description: "Searching the web for perfect learning materials...",
      icon: <Search className="w-8 h-8" />,
      color: "from-green-500 to-blue-600",
      duration: 2000,
      effects: ["🔍 Web scrapers deployed", "📚 Quality content detected", "⭐ Expert resources found"],
    },
    {
      id: "curation",
      title: "AI Curation Engine",
      description: "Intelligent sequencing of your learning path...",
      icon: <Cpu className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      duration: 1500,
      effects: ["🎨 Personalizing content", "🏗️ Building modules", "🎪 Adding gamification"],
    },
    {
      id: "launch",
      title: "Launch Sequence!",
      description: "Your learning journey is ready for takeoff...",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-600",
      duration: 1000,
      effects: ["🚀 Engines ignited", "🎉 Launch initiated", "🌌 Ready for learning"],
    },
  ]

  // Initialize stars
  useEffect(() => {
    if (!isVisible) return

    const newStars = []
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2 + 1,
      })
    }
    setStars(newStars)
  }, [isVisible])

  // Rocket animation and phase management
  useEffect(() => {
    if (!isVisible) return

    let phaseTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout
    let rocketTimer: NodeJS.Timeout
    let messageTimer: NodeJS.Timeout

    const startPhase = (phaseIndex: number) => {
      if (phaseIndex >= phases.length) {
        setShowExplosion(true)
        setTimeout(onComplete, 1000)
        return
      }

      const phase = phases[phaseIndex]
      setCurrentPhase(phaseIndex)
      setProgress(0)
      setLoadingMessages([])

      // Progress animation
      const progressIncrement = 100 / (phase.duration / 50)
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + progressIncrement + Math.random() * 2
          return Math.min(newProgress, 100)
        })
      }, 50)

      // Rocket movement animation
      if (phaseIndex === phases.length - 1) {
        // Launch phase - rocket flies up
        let rocketY = 90
        rocketTimer = setInterval(() => {
          rocketY -= 2
          setRocketPosition({ x: 50, y: Math.max(rocketY, -10) })
        }, 50)
      } else {
        // Other phases - gentle floating
        rocketTimer = setInterval(() => {
          setRocketPosition((prev) => ({
            x: 50 + Math.sin(Date.now() * 0.001) * 2,
            y: 90 + Math.cos(Date.now() * 0.001) * 1,
          }))
        }, 50)
      }

      // Loading messages
      let messageIndex = 0
      messageTimer = setInterval(() => {
        if (messageIndex < phase.effects.length) {
          setLoadingMessages((prev) => [...prev, phase.effects[messageIndex]])
          messageIndex++
        }
      }, phase.duration / phase.effects.length)

      // Phase completion
      phaseTimer = setTimeout(() => {
        clearInterval(progressTimer)
        clearInterval(rocketTimer)
        clearInterval(messageTimer)
        startPhase(phaseIndex + 1)
      }, phase.duration)
    }

    startPhase(0)

    return () => {
      clearTimeout(phaseTimer)
      clearInterval(progressTimer)
      clearInterval(rocketTimer)
      clearInterval(messageTimer)
    }
  }, [isVisible, onComplete])

  // Canvas animation for space effects
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isVisible) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw twinkling stars
      stars.forEach((star) => {
        const x = (star.x / 100) * canvas.width
        const y = (star.y / 100) * canvas.height

        ctx.save()
        ctx.globalAlpha = star.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.003 + star.id))
        ctx.fillStyle = `hsl(${200 + star.id * 2}, 70%, 80%)`
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw rocket trail
      if (currentPhase === phases.length - 1) {
        const rocketX = (rocketPosition.x / 100) * canvas.width
        const rocketY = (rocketPosition.y / 100) * canvas.height

        ctx.save()
        ctx.globalAlpha = 0.7
        const gradient = ctx.createLinearGradient(rocketX, rocketY, rocketX, rocketY + 100)
        gradient.addColorStop(0, "rgba(255, 165, 0, 0.8)")
        gradient.addColorStop(0.5, "rgba(255, 69, 0, 0.6)")
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(rocketX - 5, rocketY, 10, 100)
        ctx.restore()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isVisible, stars, rocketPosition, currentPhase])

  if (!isVisible) return null

  const currentPhaseData = phases[currentPhase]
  const overallProgress = ((currentPhase + progress / 100) / phases.length) * 100

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Animated space background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Explosion effect */}
      {showExplosion && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🚀</div>
          </div>
        </div>
      )}

      {/* 3D Rocket */}
      <div
        className="absolute w-16 h-20 transition-all duration-300 transform"
        style={{
          left: `${rocketPosition.x}%`,
          top: `${rocketPosition.y}%`,
          transform: `translate(-50%, -50%) ${currentPhase === phases.length - 1 ? "scale(1.2)" : "scale(1)"}`,
        }}
      >
        <div className="relative w-full h-full">
          {/* Rocket body */}
          <div className="absolute bottom-0 left-1/2 w-8 h-16 bg-gradient-to-t from-gray-300 to-white rounded-t-full transform -translate-x-1/2 shadow-2xl border border-gray-400"></div>
          {/* Rocket fins */}
          <div
            className="absolute bottom-0 left-1/2 w-12 h-6 bg-gradient-to-t from-red-500 to-red-400 transform -translate-x-1/2"
            style={{ clipPath: "polygon(20% 100%, 50% 0%, 80% 100%)" }}
          ></div>
          {/* Rocket window */}
          <div className="absolute bottom-10 left-1/2 w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 border-2 border-blue-600"></div>
          {/* Rocket flame */}
          {currentPhase === phases.length - 1 && (
            <div className="absolute -bottom-6 left-1/2 w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-red-500 rounded-b-full transform -translate-x-1/2 animate-pulse"></div>
          )}
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-4 bg-gray-900/95 backdrop-blur-sm shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className={`p-8 bg-gradient-to-r ${currentPhaseData.color} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                {currentPhaseData.icon}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-3">{currentPhaseData.title}</h1>
            <p className="text-xl text-center text-white/90">{currentPhaseData.description}</p>
          </div>
        </div>

        {/* Progress section */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Phase {currentPhase + 1} of {phases.length}
              </Badge>
              <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
            </div>

            {/* Overall progress */}
            <div className="mb-4">
              <Progress value={overallProgress} className="h-4 mb-2" />
              <p className="text-sm text-gray-400 text-center">Overall Progress</p>
            </div>

            {/* Current phase progress */}
            <div className="mb-6">
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-sm text-gray-400 text-center">Current Phase</p>
            </div>
          </div>

          {/* Phase indicators */}
          <div className="flex justify-center space-x-4 mb-8">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index < currentPhase
                    ? "bg-green-500 text-white scale-110"
                    : index === currentPhase
                      ? `bg-gradient-to-r ${phase.color} text-white scale-125 animate-pulse`
                      : "bg-gray-700 text-gray-400"
                }`}
              >
                {index < currentPhase ? (
                  <Star className="w-6 h-6" />
                ) : (
                  <div className="text-sm font-bold">{index + 1}</div>
                )}
              </div>
            ))}
          </div>

          {/* Live feed */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-400" />
              AI Processing Feed
            </h3>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {loadingMessages.map((message, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 bg-gray-700/80 rounded-lg p-3 animate-slideIn"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {message}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">AI</div>
              <div className="text-sm text-blue-300">Powered</div>
            </div>
            <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">FREE</div>
              <div className="text-sm text-green-300">Always</div>
            </div>
            <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">SMART</div>
              <div className="text-sm text-purple-300">Learning</div>
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
