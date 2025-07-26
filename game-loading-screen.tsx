"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Brain, Search, Cpu, Gamepad2, Trophy, Star } from "lucide-react"

interface GameLoadingScreenProps {
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

export function GameLoadingScreen({ isVisible, onComplete }: GameLoadingScreenProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])

  const phases: LoadingPhase[] = [
    {
      id: "initialization",
      title: "Initializing Game World",
      description: "Setting up your personalized learning universe...",
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "from-blue-500 to-purple-600",
      duration: 2000,
      effects: [
        "✨ Creating magical learning realms",
        "🌟 Calibrating difficulty settings",
        "🎮 Loading game mechanics",
      ],
    },
    {
      id: "analysis",
      title: "AI Brain Activation",
      description: "Advanced AI analyzing your learning profile...",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      duration: 3000,
      effects: ["🧠 Neural networks processing", "⚡ Pattern recognition active", "🎯 Skill gap analysis complete"],
    },
    {
      id: "discovery",
      title: "Resource Discovery Engine",
      description: "Scanning the web for perfect learning materials...",
      icon: <Search className="w-8 h-8" />,
      color: "from-green-500 to-blue-600",
      duration: 2500,
      effects: ["🔍 Web crawlers deployed", "📚 Quality resources found", "⭐ Community favorites identified"],
    },
    {
      id: "curation",
      title: "Expert Curation System",
      description: "AI curating your perfect learning journey...",
      icon: <Cpu className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      duration: 2000,
      effects: ["🎨 Personalizing content flow", "🏗️ Building learning modules", "🎪 Adding gamification elements"],
    },
    {
      id: "finalization",
      title: "Adventure Ready!",
      description: "Your epic learning quest awaits...",
      icon: <Trophy className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-600",
      duration: 1500,
      effects: ["🏆 Achievement system loaded", "🎉 Ready to begin adventure", "🚀 Launch sequence initiated"],
    },
  ]

  useEffect(() => {
    if (!isVisible) return

    let phaseTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout
    let particleTimer: NodeJS.Timeout
    let messageTimer: NodeJS.Timeout

    const startPhase = (phaseIndex: number) => {
      if (phaseIndex >= phases.length) {
        setTimeout(onComplete, 500)
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

      // Particle effects
      particleTimer = setInterval(() => {
        setParticles((prev) => [
          ...prev.slice(-20), // Keep only last 20 particles
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 5)],
          },
        ])
      }, 200)

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
        clearInterval(particleTimer)
        clearInterval(messageTimer)
        startPhase(phaseIndex + 1)
      }, phase.duration)
    }

    startPhase(0)

    return () => {
      clearTimeout(phaseTimer)
      clearInterval(progressTimer)
      clearInterval(particleTimer)
      clearInterval(messageTimer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const currentPhaseData = phases[currentPhase]
  const overallProgress = ((currentPhase + progress / 100) / phases.length) * 100

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animation: `float 3s ease-in-out infinite, fadeOut 3s ease-in-out forwards`,
            }}
          />
        ))}
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-white/20 animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-4 bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        {/* Header with game-like styling */}
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
              <div className="text-2xl font-bold text-gray-800">{Math.round(overallProgress)}%</div>
            </div>

            {/* Overall progress */}
            <div className="mb-4">
              <Progress value={overallProgress} className="h-4 mb-2" />
              <p className="text-sm text-gray-600 text-center">Overall Progress</p>
            </div>

            {/* Current phase progress */}
            <div className="mb-6">
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-sm text-gray-600 text-center">Current Phase</p>
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
                      : "bg-gray-200 text-gray-400"
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

          {/* Live activity feed */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Live Activity Feed
            </h3>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {loadingMessages.map((message, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 bg-white/80 rounded-lg p-3 animate-slideIn"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {message}
                </div>
              ))}
            </div>
          </div>

          {/* Game-like stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">AI</div>
              <div className="text-sm text-blue-800">Powered</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">FREE</div>
              <div className="text-sm text-green-800">Always</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">FAST</div>
              <div className="text-sm text-purple-800">Generation</div>
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
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
      `}</style>
    </div>
  )
}
