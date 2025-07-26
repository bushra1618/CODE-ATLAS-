"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageCircle, Lightbulb, Trophy, X } from "lucide-react"

interface CompanionProps {
  currentModule?: string
  progress?: number
  onHint?: () => void
  onEncouragement?: () => void
}

export function LearningCompanion({ currentModule, progress = 0, onHint, onEncouragement }: CompanionProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [message, setMessage] = useState("")
  const [animation, setAnimation] = useState("idle")
  const [showMessage, setShowMessage] = useState(false)

  const companionMessages = {
    welcome: "Welcome, explorer! I'm Sage, your learning companion. Ready to embark on this coding adventure?",
    progress: `Great progress! You're ${progress}% through your journey. Keep up the excellent work!`,
    hint: "Need a hint? I'm here to help guide you through any challenging concepts.",
    encouragement: "You're doing amazing! Every expert was once a beginner. Keep pushing forward!",
    milestone: "Congratulations! You've reached another milestone. Your dedication is paying off!",
    stuck: "Feeling stuck? That's completely normal! Let's break this down into smaller steps.",
  }

  useEffect(() => {
    // Show welcome message on mount
    setTimeout(() => {
      showCompanionMessage("welcome")
    }, 1000)

    // Periodic encouragement
    const encouragementInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        showCompanionMessage("encouragement")
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(encouragementInterval)
  }, [])

  useEffect(() => {
    // Progress milestone messages
    if (progress > 0 && progress % 25 === 0) {
      showCompanionMessage("milestone")
    }
  }, [progress])

  const showCompanionMessage = (type: keyof typeof companionMessages) => {
    setMessage(companionMessages[type])
    setShowMessage(true)
    setAnimation("talking")

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false)
      setAnimation("idle")
    }, 5000)
  }

  const handleHint = () => {
    showCompanionMessage("hint")
    onHint?.()
    playSound("hint")
  }

  const handleEncouragement = () => {
    showCompanionMessage("encouragement")
    onEncouragement?.()
    playSound("encouragement")
  }

  const playSound = (type: string) => {
    // Sound effects would be implemented here
    console.log(`🔊 Playing ${type} sound`)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Companion Character */}
      <div className="relative">
        {/* Message Bubble */}
        {showMessage && (
          <Card className="absolute bottom-20 right-0 w-80 p-4 bg-white border-2 border-purple-200 shadow-xl animate-in slide-in-from-bottom-2">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessage(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-200"></div>
              <div className="w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-white absolute -top-1 left-0.5"></div>
            </div>
          </Card>
        )}

        {/* Companion Orb */}
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 shadow-lg cursor-pointer transition-all duration-300 ${
            animation === "talking" ? "animate-pulse scale-110" : "hover:scale-105"
          }`}
          onClick={() => showCompanionMessage("encouragement")}
        >
          {/* Animated core */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent flex items-center justify-center relative overflow-hidden">
            {/* Sparkle effects */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-60"
                  style={{
                    top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 20}%`,
                    left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 20}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>

            {/* Central icon */}
            <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "4s" }} />
          </div>

          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-20"></div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -left-20 top-0 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 shadow-lg"
            onClick={handleHint}
            title="Get a hint"
          >
            <Lightbulb className="w-4 h-4 text-purple-600" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 shadow-lg"
            onClick={handleEncouragement}
            title="Get encouragement"
          >
            <Trophy className="w-4 h-4 text-green-600" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-blue-50 shadow-lg"
            onClick={() => showCompanionMessage("progress")}
            title="Check progress"
          >
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Minimize button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  )
}
