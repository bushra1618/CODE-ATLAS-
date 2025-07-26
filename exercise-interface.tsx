"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Code2, CheckCircle, XCircle, Lightbulb, Play, RotateCcw } from "lucide-react"

interface Resource {
  type: string
  title: string
  difficulty?: string
}

interface Module {
  id: number
  title: string
}

interface ExerciseInterfaceProps {
  resource: Resource
  module: Module
  onBack: () => void
  onComplete: () => void
}

interface Exercise {
  question: string
  description: string
  starterCode: string
  solution: string
  hints: string[]
  testCases: { input: string; expected: string }[]
}

export function ExerciseInterface({ resource, module, onBack, onComplete }: ExerciseInterfaceProps) {
  const [userCode, setUserCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [attempts, setAttempts] = useState(0)

  // Add state for loading AI exercise
  const [isLoadingExercise, setIsLoadingExercise] = useState(true)
  const [aiExercise, setAiExercise] = useState<Exercise | null>(null)

  // Generate exercise based on module and resource
  const exercise: Exercise = {
    question: `${resource.title} - ${module.title}`,
    description: `Write a function that demonstrates the core concepts from ${module.title}. This exercise will test your understanding of the material you just learned.`,
    starterCode: `// ${resource.title}
// Complete the function below

function solution() {
    // Your code here
    
}

// Test your solution
console.log(solution());`,
    solution: `function solution() {
    return "Hello, World!";
}`,
    hints: [
      "Start by understanding what the function should return",
      "Remember the syntax rules we covered in the module",
      "Check your variable declarations and function structure",
      "Make sure your return statement is correct",
    ],
    testCases: [{ input: "", expected: "Hello, World!" }],
  }

  // Add useEffect to load AI exercise
  useEffect(() => {
    const loadAIExercise = async () => {
      try {
        console.log("🎯 Loading AI exercise...")

        const response = await fetch("/api/generate-exercise", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleTitle: module.title,
            targetLanguage: "Rust", // This should come from pathway context
            currentLanguage: "Python", // This should come from pathway context
            skillLevel: "Intermediate", // This should come from user profile
            moduleContent: resource.title,
          }),
        })

        console.log("📡 Exercise API Response status:", response.status)

        if (response.ok) {
          const result = await response.json()
          console.log("✅ Exercise API Response:", result)

          if (result.success && result.exercise) {
            setAiExercise(result.exercise)
            setUserCode(result.exercise.starterCode)
          } else {
            throw new Error("Invalid exercise response format")
          }
        } else {
          throw new Error(`Exercise API request failed with status ${response.status}`)
        }
      } catch (error) {
        console.error("❌ Error loading AI exercise:", error)
        // Fallback to default exercise
        setAiExercise(exercise)
        setUserCode(exercise.starterCode)
      } finally {
        setIsLoadingExercise(false)
      }
    }

    loadAIExercise()
  }, [module.title, resource.title])

  // Use aiExercise instead of the hardcoded exercise
  const currentExercise = aiExercise || exercise

  useEffect(() => {
    setUserCode(exercise.starterCode)
  }, [])

  const runCode = async () => {
    setIsRunning(true)
    setAttempts(attempts + 1)

    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple check - in a real app, this would be more sophisticated
    const isCorrect = userCode.includes("Hello, World!") && userCode.includes("return")

    setResult(isCorrect ? "correct" : "incorrect")
    setIsRunning(false)

    // Play sound feedback
    if (isCorrect) {
      // Success sound would play here
      setTimeout(() => {
        onComplete()
      }, 2000)
    } else {
      // Error sound would play here
    }
  }

  const resetCode = () => {
    setUserCode(exercise.starterCode)
    setResult(null)
    setShowHint(false)
    setCurrentHint(0)
  }

  const showNextHint = () => {
    if (currentHint < exercise.hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
    setShowHint(true)
  }

  // Add loading state
  if (isLoadingExercise) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating personalized exercise...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>
        <div className="flex items-center space-x-3">
          <Badge variant="outline">Module {module.id}</Badge>
          <Badge variant="secondary" className="capitalize">
            {resource.difficulty || "Medium"}
          </Badge>
        </div>
      </div>

      {/* Exercise Header */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Code2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentExercise.question}</h1>
            <p className="text-gray-600">Interactive Coding Exercise</p>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{currentExercise.description}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Attempts: {attempts}</span>
            <span>•</span>
            <span>Difficulty: {resource.difficulty || "Medium"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={showNextHint}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Hint
            </Button>
            <Button variant="outline" size="sm" onClick={resetCode}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Code Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
            <div className="flex items-center space-x-2">
              <Button onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </div>

          <Textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="font-mono text-sm min-h-[400px] bg-gray-900 text-green-400 border-gray-700"
            placeholder="Write your code here..."
          />
        </Card>

        {/* Output and Feedback */}
        <div className="space-y-4">
          {/* Test Results */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Output</h3>

            {result === null && !isRunning && (
              <div className="text-center py-8 text-gray-500">
                <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click "Run Code" to test your solution</p>
              </div>
            )}

            {isRunning && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Running your code...</p>
              </div>
            )}

            {result === "correct" && (
              <div className="text-center py-8 text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Excellent! 🎉</h4>
                <p className="text-gray-600 mb-4">Your solution is correct!</p>
                <Badge className="bg-green-100 text-green-800">Exercise Completed</Badge>
              </div>
            )}

            {result === "incorrect" && (
              <div className="text-center py-8 text-red-600">
                <XCircle className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Not quite right</h4>
                <p className="text-gray-600 mb-4">Keep trying! Check your code and try again.</p>
                <Badge variant="destructive">Try Again</Badge>
              </div>
            )}
          </Card>

          {/* Hints */}
          {showHint && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Hint {currentHint + 1} of {currentExercise.hints.length}
                  </h4>
                  <p className="text-blue-800">{currentExercise.hints[currentHint]}</p>

                  {currentHint < currentExercise.hints.length - 1 && (
                    <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={showNextHint}>
                      Next Hint
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Test Cases */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Test Cases</h4>
            <div className="space-y-2">
              {currentExercise.testCases.map((testCase, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Expected output:</span>
                    <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">{testCase.expected}</code>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
