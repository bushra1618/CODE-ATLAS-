"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Compass, Map, Trophy, Star, Anchor, Crown, Gem, Scroll, ChevronRight, Lock, CheckCircle } from "lucide-react"

interface Module {
  id: string
  name: string
  description: string
  duration: string
  difficulty: string
  topics: string[]
  resources: Array<{
    title: string
    type: string
    url: string
  }>
  exercises: Array<{
    title: string
    description: string
    difficulty: string
  }>
  xp: number
  completed: boolean
  position: { x: number; y: number }
  island: string
}

interface TreasureMapProps {
  pathway: {
    id: string
    title: string
    description: string
    modules: Module[]
    currentXP: number
    totalXP: number
    progress: number
  }
  onModuleSelect: (module: Module) => void
}

export function TreasureMapInterface({ pathway, onModuleSelect }: TreasureMapProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animatedElements, setAnimatedElements] = useState<
    Array<{
      id: number
      x: number
      y: number
      rotation: number
      scale: number
      type: string
    }>
  >([])
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Enhanced mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mapRef.current) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      setMousePosition({ x: x * 20, y: y * 20 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Initialize floating elements
  useEffect(() => {
    const elements = []
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        type: ["fish", "seaweed", "bubble", "treasure"][Math.floor(Math.random() * 4)],
      })
    }
    setAnimatedElements(elements)
  }, [])

  // Animate floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedElements((prev) =>
        prev.map((el) => ({
          ...el,
          rotation: el.rotation + 0.5,
          y: el.y + Math.sin(Date.now() * 0.001 + el.id) * 0.02,
          x: el.x + Math.cos(Date.now() * 0.001 + el.id) * 0.01,
        })),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  // Ocean wave animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const waves = []
    for (let i = 0; i < 5; i++) {
      waves.push({
        amplitude: Math.random() * 20 + 10,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        y: canvas.height * (0.2 + i * 0.15),
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ocean gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)")
      gradient.addColorStop(0.5, "rgba(147, 197, 253, 0.2)")
      gradient.addColorStop(1, "rgba(191, 219, 254, 0.3)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated waves
      waves.forEach((wave, index) => {
        ctx.beginPath()
        ctx.moveTo(0, wave.y)

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.phase + Date.now() * wave.speed) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude)
        waveGradient.addColorStop(0, `rgba(59, 130, 246, ${0.1 - index * 0.02})`)
        waveGradient.addColorStop(1, `rgba(147, 197, 253, ${0.05 - index * 0.01})`)

        ctx.fillStyle = waveGradient
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Position modules as islands on the map
  const modulesWithPositions = pathway.modules.map((module, index) => ({
    ...module,
    position: {
      x: 20 + (index % 3) * 30 + Math.sin(index) * 10,
      y: 25 + Math.floor(index / 3) * 25 + Math.cos(index) * 8,
    },
    island: ["volcanic", "tropical", "crystal", "ancient", "mystical"][index % 5],
  }))

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module)
    onModuleSelect(module)
  }

  const getModuleIcon = (difficulty: string, completed: boolean) => {
    if (completed) return CheckCircle

    switch (difficulty) {
      case "beginner":
        return Anchor
      case "intermediate":
        return Compass
      case "advanced":
        return Crown
      default:
        return Map
    }
  }

  const getIslandStyle = (island: string, completed: boolean) => {
    const baseStyles = {
      volcanic: "from-red-400 via-orange-500 to-yellow-400",
      tropical: "from-green-400 via-emerald-500 to-teal-400",
      crystal: "from-blue-400 via-cyan-500 to-indigo-400",
      ancient: "from-amber-400 via-yellow-500 to-orange-400",
      mystical: "from-purple-400 via-violet-500 to-pink-400",
    }

    return completed
      ? `${baseStyles[island as keyof typeof baseStyles]} opacity-80 saturate-150`
      : `${baseStyles[island as keyof typeof baseStyles]} opacity-60`
  }

  return (
    <div
      ref={mapRef}
      className="relative w-full h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d4a574' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Ocean animation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating ocean elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {animatedElements.map((element) => (
          <div
            key={element.id}
            className="absolute transition-all duration-1000 ease-out opacity-30"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `
                perspective(1000px) 
                rotateZ(${element.rotation}deg)
                scale(${element.scale})
                translateZ(${Math.sin(element.rotation * 0.01) * 20}px)
              `,
              transformStyle: "preserve-3d",
            }}
          >
            {element.type === "fish" && (
              <div className="w-4 h-2 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-60" />
            )}
            {element.type === "seaweed" && (
              <div className="w-1 h-8 bg-gradient-to-t from-green-400 to-emerald-300 rounded-full opacity-40" />
            )}
            {element.type === "bubble" && (
              <div className="w-2 h-2 bg-white/40 rounded-full border border-blue-200/30" />
            )}
            {element.type === "treasure" && <Gem className="w-3 h-3 text-yellow-400 opacity-50" />}
          </div>
        ))}
      </div>

      {/* Vintage map border */}
      <div className="absolute inset-4 border-8 border-amber-800 rounded-lg shadow-2xl bg-gradient-to-br from-amber-100/50 to-yellow-100/50 backdrop-blur-sm">
        {/* Compass Rose */}
        <div
          className="absolute top-8 right-8 w-24 h-24 transform transition-transform duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full shadow-xl border-4 border-amber-700">
              <Compass className="w-full h-full p-4 text-amber-800" />
            </div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
        </div>

        {/* Map Title */}
        <div className="absolute top-8 left-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-serif">{pathway.title}</h1>
          <p className="text-amber-700 text-lg max-w-md">{pathway.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-32 left-8 right-32">
          <div className="bg-amber-200/50 rounded-full p-2 backdrop-blur-sm border border-amber-300">
            <Progress value={pathway.progress} className="h-3 bg-amber-100" />
            <div className="flex justify-between mt-2 text-sm text-amber-800">
              <span>Progress: {Math.round(pathway.progress)}%</span>
              <span>
                XP: {pathway.currentXP} / {pathway.totalXP}
              </span>
            </div>
          </div>
        </div>

        {/* Module Islands */}
        <div className="relative w-full h-full">
          {modulesWithPositions.map((module, index) => {
            const Icon = getModuleIcon(module.difficulty, module.completed)
            const isUnlocked = index === 0 || modulesWithPositions[index - 1]?.completed

            return (
              <div
                key={module.id}
                className="absolute transform transition-all duration-500 hover:scale-110 cursor-pointer group"
                style={{
                  left: `${module.position.x}%`,
                  top: `${module.position.y}%`,
                  transform: `
                    perspective(1000px) 
                    rotateY(${mousePosition.x * 0.02}deg) 
                    rotateX(${-mousePosition.y * 0.02}deg)
                    translateZ(${index * 5}px)
                  `,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => isUnlocked && handleModuleClick(module)}
              >
                {/* Island Base */}
                <div
                  className={`w-32 h-32 rounded-full shadow-2xl border-4 border-amber-600 relative overflow-hidden ${
                    isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getIslandStyle(module.island, module.completed)}`}
                  />

                  {/* Island details */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

                  {/* Module Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${
                        module.completed
                          ? "bg-gradient-to-br from-green-400 to-emerald-500"
                          : isUnlocked
                            ? "bg-gradient-to-br from-amber-300 to-yellow-400"
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}
                    >
                      {isUnlocked ? (
                        <Icon className={`w-8 h-8 ${module.completed ? "text-white" : "text-amber-800"}`} />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Floating elements around island */}
                  {isUnlocked && (
                    <>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80">
                        <Star className="w-4 h-4 text-yellow-800 m-1" />
                      </div>

                      {module.completed && (
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400 rounded-full animate-pulse">
                          <Trophy className="w-6 h-6 text-green-800 m-1" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Module Info Card */}
                <div className="absolute top-36 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Card className="w-64 bg-amber-50/95 backdrop-blur-sm border-2 border-amber-300 shadow-xl">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-amber-900 mb-2">{module.name}</h3>
                      <p className="text-sm text-amber-700 mb-3">{module.description}</p>

                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-xs border-amber-400 text-amber-800">
                          {module.difficulty}
                        </Badge>
                        <span className="text-xs text-amber-600">{module.duration}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-600">XP: {module.xp}</span>
                        {isUnlocked && (
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Connection paths between islands */}
                {index < modulesWithPositions.length - 1 && (
                  <div
                    className="absolute top-16 left-16 w-24 h-1 bg-amber-600 opacity-60 transform origin-left"
                    style={{
                      transform: `rotate(${
                        (Math.atan2(
                          modulesWithPositions[index + 1].position.y - module.position.y,
                          modulesWithPositions[index + 1].position.x - module.position.x,
                        ) *
                          180) /
                        Math.PI
                      }deg)`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 bg-amber-100/80 backdrop-blur-sm rounded-lg p-4 border-2 border-amber-300">
          <h3 className="font-bold text-amber-900 mb-2">Legend</h3>
          <div className="space-y-1 text-sm text-amber-800">
            <div className="flex items-center space-x-2">
              <Anchor className="w-4 h-4" />
              <span>Beginner</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Intermediate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Advanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-8 right-8 opacity-60">
          <Scroll className="w-12 h-12 text-amber-700" />
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-amber-50 border-4 border-amber-600 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-amber-900 mb-2">{selectedModule.name}</h2>
                  <p className="text-amber-700 text-lg">{selectedModule.description}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedModule(null)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Duration</h3>
                  <p className="text-amber-700">{selectedModule.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Difficulty</h3>
                  <Badge className="bg-amber-200 text-amber-800">{selectedModule.difficulty}</Badge>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="border-amber-400 text-amber-800">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">Resources</h3>
                <div className="space-y-2">
                  {selectedModule.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-amber-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-amber-900">{resource.title}</h4>
                        <p className="text-sm text-amber-600 capitalize">{resource.type}</p>
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">Exercises</h3>
                <div className="space-y-3">
                  {selectedModule.exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-amber-100 rounded-lg border border-amber-300">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-amber-900">{exercise.title}</h4>
                        <Badge variant="outline" className="border-amber-400 text-amber-800 text-xs">
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <p className="text-amber-700 text-sm">{exercise.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-amber-900 font-medium">{selectedModule.xp} XP</span>
                </div>
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedModule(null)}
                    className="border-amber-400 text-amber-800 hover:bg-amber-100"
                  >
                    Close
                  </Button>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">Start Module</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
