"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Sparkles, Target, Zap, ArrowRight, Star, Brain, Rocket } from "lucide-react"
import { GoogleSignIn } from "@/google-signin"

export default function HomePage() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      window.location.href = "/dashboard"
    }
  }, [])

  if (showSignIn) {
    return <GoogleSignIn onClose={() => setShowSignIn(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Code Atlas
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Pathways</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Features
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                About
              </Button>
              <Button
                onClick={() => setShowSignIn(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border-purple-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </Badge>
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                Master Any Programming
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Language with AI
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized learning pathways curated by AI. From beginner to expert, our intelligent system adapts
                to your pace and learning style.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => setShowSignIn(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                Watch Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 pt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">25+</div>
                <div className="text-gray-600">Programming Languages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">1M+</div>
                <div className="text-gray-600">AI-Curated Resources</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Code Atlas?</h2>
            <p className="text-xl text-gray-600">Experience the future of programming education</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Curation</h3>
                <p className="text-gray-600">
                  Our AI analyzes millions of resources to create personalized learning paths tailored to your goals and
                  experience level.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Adaptive Learning</h3>
                <p className="text-gray-600">
                  Dynamic pathways that adjust based on your progress, ensuring you're always challenged but never
                  overwhelmed.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-World Projects</h3>
                <p className="text-gray-600">
                  Build actual applications and projects that matter, with step-by-step guidance from industry experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-2xl">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Coding Journey?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of developers who've accelerated their learning with AI-powered pathways.
              </p>
              <Button
                onClick={() => setShowSignIn(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Start Your Free Journey
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
