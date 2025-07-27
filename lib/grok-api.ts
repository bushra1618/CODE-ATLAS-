// lib/grok-api.ts
export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GrokAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.x.ai/v1';

  constructor() {
    this.apiKey = process.env.GROK_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY environment variable is required');
    }
  }

  async createChatCompletion(
    messages: GrokMessage[],
    model: string = 'grok-beta',
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<GrokResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
        stream: options.stream || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  async generateLearningPathway(params: {
    currentLanguage: string;
    targetLanguage: string;
    skillLevel: string;
    goals: string;
    githubProfile?: string;
    sampleCode?: string;
  }): Promise<any> {
    const { currentLanguage, targetLanguage, skillLevel, goals, githubProfile, sampleCode } = params;

    const systemPrompt = `You are an expert programming instructor and curriculum designer. Your task is to create comprehensive, personalized learning pathways that help developers transition between programming languages effectively.

You have deep expertise in:
- Programming language fundamentals and advanced concepts
- Learning psychology and effective skill transfer
- Industry best practices and real-world applications
- Curating high-quality educational resources

Create responses that are practical, engaging, and tailored to the learner's specific background and goals.`;

    const userPrompt = `Create a comprehensive, personalized learning pathway for a developer transitioning from ${currentLanguage} to ${targetLanguage}.

CRITICAL: ALL resources, examples, tutorials, and content MUST be specifically for ${targetLanguage}. Do NOT use TypeScript or any other language examples.

CONTEXT:
- Current Language: ${currentLanguage}
- Target Language: ${targetLanguage} (FOCUS EXCLUSIVELY ON THIS LANGUAGE)
- Skill Level: ${skillLevel}
- Goals: ${goals}
${githubProfile ? `- GitHub Profile: ${githubProfile}` : ''}
${sampleCode ? `- Sample Code Style: ${sampleCode}` : ''}

LANGUAGE-SPECIFIC REQUIREMENTS:
1. ALL code examples must be in ${targetLanguage}
2. ALL tutorials must be ${targetLanguage}-specific
3. ALL documentation links must be for ${targetLanguage}
4. ALL frameworks/libraries must be ${targetLanguage} ecosystem
5. Compare ${targetLanguage} concepts to ${currentLanguage} where helpful
6. Use ${targetLanguage}-specific terminology and best practices

PATHWAY REQUIREMENTS:
1. Create 5-7 progressive learning modules focused on ${targetLanguage}
2. Each module should build upon the previous one
3. Include specific ${targetLanguage} learning objectives and outcomes
4. Provide estimated time commitments
5. Include practical ${targetLanguage} exercises and projects
6. Focus on real-world ${targetLanguage} applications

RESPONSE FORMAT (JSON):
{
  "id": "unique_pathway_id",
  "title": "Engaging pathway title for ${targetLanguage}",
  "description": "Comprehensive overview focusing on ${targetLanguage} mastery",
  "estimatedDuration": "X weeks",
  "currentLanguage": "${currentLanguage}",
  "targetLanguage": "${targetLanguage}",
  "skillLevel": "${skillLevel}",
  "goals": "${goals}",
  "personalizedFor": "Specific explanation of why this ${targetLanguage} pathway is perfect for this ${currentLanguage} developer's transition",
  "modules": [
    {
      "id": "module_1",
      "name": "${targetLanguage} Module name",
      "description": "What the learner will accomplish in ${targetLanguage}",
      "duration": "X days",
      "difficulty": "beginner/intermediate/advanced",
      "learningObjectives": [
        "Specific ${targetLanguage} learning objective",
        "Another concrete ${targetLanguage} objective"
      ],
      "keyTopics": [
        "${targetLanguage} core topic 1",
        "${targetLanguage} core topic 2"
      ],
      "practicalProjects": [
        {
          "title": "${targetLanguage} project name",
          "description": "What the learner will build in ${targetLanguage}",
          "estimatedTime": "X hours",
          "difficulty": "beginner/intermediate/advanced",
          "language": "${targetLanguage}"
        }
      ],
      "resources": [
        {
          "type": "tutorial",
          "title": "${targetLanguage} tutorial title",
          "description": "What this ${targetLanguage} resource covers",
          "estimatedTime": "X minutes",
          "difficulty": "beginner/intermediate/advanced",
          "language": "${targetLanguage}",
          "focusArea": "Specific ${targetLanguage} concept"
        }
      ],
      "xp": 150,
      "completed": false
    }
  ],
  "totalXP": 900,
  "currentXP": 0,
  "progress": 0
}

Ensure the pathway is:
- Progressively structured (each module builds on the previous)
- Practical and hands-on
- Tailored to the ${currentLanguage} to ${targetLanguage} transition
- Appropriate for ${skillLevel} level developers
- Aligned with the stated goals: ${goals}

Return only valid JSON without any markdown formatting or additional text.`;

    const messages: GrokMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.createChatCompletion(messages, 'grok-beta', {
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Grok API');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse Grok response as JSON:', content);
      throw new Error('Invalid JSON response from Grok API');
    }
  }

  async generateExercise(params: {
    language: string;
    topic: string;
    difficulty: string;
    focusArea?: string;
    learningObjectives?: string[];
  }): Promise<any> {
    const { language, topic, difficulty, focusArea, learningObjectives } = params;

    const systemPrompt = `You are an expert programming instructor specializing in creating engaging, educational coding exercises. You understand how to design exercises that effectively teach programming concepts through hands-on practice.

Your exercises should be:
- Pedagogically sound and progressive
- Engaging and practical
- Appropriate for the specified difficulty level
- Include clear instructions and helpful hints
- Provide complete solutions with explanations`;

    const userPrompt = `Create a comprehensive coding exercise specifically for ${language} programming.

CRITICAL: ALL code examples, syntax, and references MUST be specifically for ${language}. Do NOT use examples from other programming languages.

REQUIREMENTS:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Programming Language: ${language} (USE ONLY ${language} SYNTAX AND CONVENTIONS)
${focusArea ? `- Focus Area: ${focusArea}` : ''}
${learningObjectives ? `- Learning Objectives: ${learningObjectives.join(', ')}` : ''}

LANGUAGE-SPECIFIC REQUIREMENTS:
1. ALL code must be valid ${language} syntax
2. Use ${language}-specific naming conventions
3. Include ${language}-specific comments and documentation style
4. Reference ${language} standard library and common patterns
5. Use ${language} idioms and best practices
6. Ensure starter code compiles/runs in ${language}

RESPONSE FORMAT (JSON):
{
  "id": "unique_exercise_id",
  "title": "${language} ${topic} Exercise",
  "description": "What this ${language} exercise teaches",
  "difficulty": "${difficulty}",
  "language": "${language}",
  "topic": "${topic}",
  "estimatedTime": "X minutes",
  "instructions": "Clear, step-by-step instructions for ${language}",
  "starterCode": "// ${language} starter code with proper syntax and TODO comments",
  "solution": "// Complete ${language} solution with proper syntax",
  "explanation": "Detailed explanation of the ${language} solution and concepts",
  "hints": [
    "Helpful ${language}-specific hint 1",
    "Helpful ${language}-specific hint 2"
  ],
  "learningObjectives": [
    "What the learner will understand about ${language} after completing this exercise"
  ],
  "testCases": [
    {
      "input": "example input",
      "expected": "expected output",
      "description": "what this test case validates"
    }
  ]
}

Return only valid JSON without any markdown formatting or additional text.`;

    const messages: GrokMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.createChatCompletion(messages, 'grok-beta', {
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Grok API');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse Grok response as JSON:', content);
      throw new Error('Invalid JSON response from Grok API');
    }
  }

  async answerQuestion(question: string, context?: string): Promise<string> {
    const systemPrompt = `You are a knowledgeable programming tutor and learning assistant. You provide clear, accurate, and helpful answers to programming and learning-related questions. 

Your responses should be:
- Accurate and technically correct
- Clear and easy to understand
- Practical and actionable
- Encouraging and supportive
- Include examples when helpful`;

    const userPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}`
      : question;

    const messages: GrokMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.createChatCompletion(messages, 'grok-beta', {
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  }
}

// Export a singleton instance
export const grokAPI = new GrokAPI();
