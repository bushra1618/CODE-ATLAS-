"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Code, Target, Clock, Brain, Sparkles, Loader2, Wand2 } from "lucide-react"

interface PathwayCreatorProps {
  onBack: () => void
  onPathwayCreated: (pathway: any) => void
}

export function PathwayCreator({ onBack, onPathwayCreated }: PathwayCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("")

  // Form data
  const [formData, setFormData] = useState({
    currentLanguage: "",
    targetLanguage: "",
    skillLevel: "",
    goals: [] as string[],
    timeCommitment: "",
    learningStyle: "",
    projectType: "",
    customGoals: "",
  })

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "TypeScript",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "PHP",
    "Ruby",
    "Scala",
    "R",
    "MATLAB",
    "Dart",
    "Lua",
  ]

  const skillLevels = [
    { value: "beginner", label: "Beginner", description: "New to programming" },
    { value: "intermediate", label: "Intermediate", description: "Some programming experience" },
    { value: "advanced", label: "Advanced", description: "Experienced developer" },
  ]

  const goalOptions = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Game Development",
    "Desktop Applications",
    "API Development",
    "DevOps",
    "System Programming",
    "Embedded Systems",
    "Blockchain",
    "AI/ML",
  ]

  const timeCommitments = [
    { value: "1-2 hours/week", label: "Casual (1-2 hours/week)" },
    { value: "3-5 hours/week", label: "Regular (3-5 hours/week)" },
    { value: "6-10 hours/week", label: "Intensive (6-10 hours/week)" },
    { value: "10+ hours/week", label: "Full-time (10+ hours/week)" },
  ]

  const learningStyles = [
    { value: "visual", label: "Visual", description: "Learn through diagrams and examples" },
    { value: "hands-on", label: "Hands-on", description: "Learn by building projects" },
    { value: "theoretical", label: "Theoretical", description: "Learn concepts first, then apply" },
    { value: "mixed", label: "Mixed", description: "Combination of all approaches" },
  ]

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const generatePathway = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStatus("Initializing AI pathway generation...")

    try {
      // Step 1: Generate pathway structure
      setGenerationProgress(25)
      setGenerationStatus("🧠 AI is analyzing your learning profile...")

      const response = await fetch("/api/ai-pathway-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentLanguage: formData.currentLanguage,
          targetLanguage: formData.targetLanguage,
          skillLevel: formData.skillLevel,
          goals: formData.goals.length > 0 ? formData.goals : [formData.customGoals],
          timeCommitment: formData.timeCommitment,
          learningStyle: formData.learningStyle,
          projectType: formData.projectType,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error("Failed to generate pathway")
      }

      setGenerationProgress(75)
      setGenerationStatus("🎯 Personalizing your learning journey...")

      // Simulate additional processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setGenerationProgress(100)
      setGenerationStatus("✅ Your personalized pathway is ready!")

      // Save to localStorage
      const existingPathways = JSON.parse(localStorage.getItem("pathways") || "[]")
      const updatedPathways = [...existingPathways, data.pathway]
      localStorage.setItem("pathways", JSON.stringify(updatedPathways))

      // Wait a moment to show completion
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onPathwayCreated(data.pathway)
    } catch (error) {
      console.error("❌ Error generating pathway:", error)
      setGenerationStatus("❌ Error generating pathway. Please try again.")

      // Create fallback pathway
      const fallbackPathway = {
        id: "pathway_" + Date.now(),
        title: `Master ${formData.targetLanguage}: From ${formData.currentLanguage} to ${formData.targetLanguage}`,
        description: `A comprehensive pathway to transition from ${formData.currentLanguage} to ${formData.targetLanguage}`,
        currentLanguage: formData.currentLanguage,
        targetLanguage: formData.targetLanguage,
        skillLevel: formData.skillLevel,
        goals: formData.goals,
        progress: 0,
        totalModules: 8,
        completedModules: 0,
        estimatedHours: 40,
        createdAt: new Date().toISOString(),
        modules: [],
      }

      const existingPathways = JSON.parse(localStorage.getItem("pathways") || "[]")
      const updatedPathways = [...existingPathways, fallbackPathway]
      localStorage.setItem("pathways", JSON.stringify(updatedPathways))

      setTimeout(() => {
        onPathwayCreated(fallbackPathway)
      }, 2000)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      generatePathway()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.currentLanguage && formData.targetLanguage && formData.skillLevel
      case 2:
        return formData.goals.length > 0 || formData.customGoals.trim()
      case 3:
        return formData.timeCommitment && formData.learningStyle
      case 4:
        return true
      default:
        return false
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your AI-Powered Pathway</h2>
              <p className="text-gray-600">{generationStatus}</p>
            </div>

            <div className="space-y-4">
              <Progress value={generationProgress} className="h-3" />
              <div className="text-sm text-gray-500">{generationProgress}% Complete</div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>This may take a few moments...</span>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <span className="text-lg font-semibold text-gray-900">AI Pathway Creator</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && <div className={`w-24 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && "Language & Skill Level"}
              {currentStep === 2 && "Learning Goals"}
              {currentStep === 3 && "Learning Preferences"}
              {currentStep === 4 && "Review & Generate"}
            </h1>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of 4 - Let's create your personalized learning pathway
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Languages & Skill Level */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Code className="w-12 h-12 text-blue-600 mx-auto" />
                  <h2 className="text-xl font-semibold text-gray-900">Choose Your Languages</h2>
                  <p className="text-gray-600">Tell us about your current and target programming languages</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentLanguage">Current Language</Label>
                    <Select
                      value={formData.currentLanguage}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, currentLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Select
                      value={formData.targetLanguage}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, targetLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your target language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Skill Level</Label>
                  <div className="grid gap-3">
                    {skillLevels.map((level) => (
                      <Card
                        key={level.value}
                        className={`p-4 cursor-pointer transition-all ${
                          formData.skillLevel === level.value ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, skillLevel: level.value }))}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              formData.skillLevel === level.value ? "bg-blue-500 border-blue-500" : "border-gray-300"
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{level.label}</div>
                            <div className="text-sm text-gray-600">{level.description}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Learning Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Target className="w-12 h-12 text-blue-600 mx-auto" />
                  <h2 className="text-xl font-semibold text-gray-900">What's Your Goal?</h2>
                  <p className="text-gray-600">Select the areas you want to focus on</p>
                </div>

                <div className="space-y-4">
                  <Label>Select your learning goals (choose multiple)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalOptions.map((goal) => (
                      <Card
                        key={goal}
                        className={`p-3 cursor-pointer transition-all ${
                          formData.goals.includes(goal) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleGoalToggle(goal)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={formData.goals.includes(goal)} onChange={() => handleGoalToggle(goal)} />
                          <span className="text-sm font-medium">{goal}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customGoals">Or describe your custom goals</Label>
                  <Textarea
                    id="customGoals"
                    placeholder="Describe any specific goals or projects you have in mind..."
                    value={formData.customGoals}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customGoals: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Learning Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto" />
                  <h2 className="text-xl font-semibold text-gray-900">Learning Preferences</h2>
                  <p className="text-gray-600">Help us personalize your learning experience</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Time Commitment</Label>
                    <div className="grid gap-3">
                      {timeCommitments.map((time) => (
                        <Card
                          key={time.value}
                          className={`p-3 cursor-pointer transition-all ${
                            formData.timeCommitment === time.value
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, timeCommitment: time.value }))}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.timeCommitment === time.value
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <span className="font-medium">{time.label}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Learning Style</Label>
                    <div className="grid gap-3">
                      {learningStyles.map((style) => (
                        <Card
                          key={style.value}
                          className={`p-4 cursor-pointer transition-all ${
                            formData.learningStyle === style.value
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, learningStyle: style.value }))}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.learningStyle === style.value
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{style.label}</div>
                              <div className="text-sm text-gray-600">{style.description}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectType">Preferred Project Type (Optional)</Label>
                    <Input
                      id="projectType"
                      placeholder="e.g., Web apps, CLI tools, games, data analysis..."
                      value={formData.projectType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, projectType: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Sparkles className="w-12 h-12 text-blue-600 mx-auto" />
                  <h2 className="text-xl font-semibold text-gray-900">Ready to Generate!</h2>
                  <p className="text-gray-600">Review your preferences and let AI create your pathway</p>
                </div>

                <div className="space-y-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">Your Learning Profile</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Transition:</span>
                        <div className="text-blue-900">
                          {formData.currentLanguage} → {formData.targetLanguage}
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Skill Level:</span>
                        <div className="text-blue-900 capitalize">{formData.skillLevel}</div>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Time Commitment:</span>
                        <div className="text-blue-900">{formData.timeCommitment}</div>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Learning Style:</span>
                        <div className="text-blue-900 capitalize">{formData.learningStyle}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-blue-700 font-medium">Goals:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.goals.map((goal) => (
                          <Badge key={goal} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                        {formData.customGoals && (
                          <Badge variant="secondary" className="text-xs">
                            Custom: {formData.customGoals.slice(0, 30)}...
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">AI-Powered Personalization</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Our AI will analyze your profile and create a customized learning pathway with:
                        </p>
                        <ul className="text-sm text-green-700 mt-2 space-y-1">
                          <li>• Personalized module progression</li>
                          <li>• Curated resources for your skill level</li>
                          <li>• Real-world projects aligned with your goals</li>
                          <li>• Interactive treasure map interface</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentStep === 4 ? (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate AI Pathway
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
