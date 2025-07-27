"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Loader2, MessageCircle, Sparkles } from "lucide-react"

interface AiQuestionAnswerProps {
  context?: string
  placeholder?: string
  className?: string
}

export function AiQuestionAnswer({ 
  context, 
  placeholder = "Ask any programming or learning question...",
  className = ""
}: AiQuestionAnswerProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) return

    setIsLoading(true)
    setError("")
    setAnswer("")

    try {
      const response = await fetch("/api/ai-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          context,
          sessionId: Date.now().toString()
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAnswer(data.answer)
      } else {
        setError(data.message || "Failed to get answer")
        setAnswer(data.answer || "")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("Error asking question:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setQuestion("")
    setAnswer("")
    setError("")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Learning Assistant
        </CardTitle>
        <CardDescription>
          Powered by Grok AI - Ask questions about programming, learning pathways, or get help with coding concepts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading || !question.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Ask Grok
                </>
              )}
            </Button>
            {(answer || error) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearConversation}
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {answer && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>Grok AI Response:</span>
            </div>
            <div className="p-4 border border-green-200 bg-green-50 rounded-md">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                  {answer}
                </pre>
              </div>
            </div>
          </div>
        )}

        {context && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            <strong>Context:</strong> {context.slice(0, 100)}...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
