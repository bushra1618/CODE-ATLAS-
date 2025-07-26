import { type NextRequest, NextResponse } from "next/server"

// Exercise templates for different languages and topics
const exerciseTemplates = {
  Rust: {
    fundamentals: {
      title: "Rust Basics: Variables and Functions",
      description: "Practice Rust syntax, variable declarations, and basic functions",
      difficulty: "Easy",
      instructions:
        "Complete the function to demonstrate basic Rust concepts including variable binding, mutability, and function definitions.",
      starterCode: `// Rust Fundamentals Exercise
// Complete the functions below

fn greet_user(name: &str) -> String {
    // TODO: Create a greeting message
    // Hint: Use format! macro to create formatted strings
}

fn calculate_area(length: f64, width: f64) -> f64 {
    // TODO: Calculate and return the area
}

fn main() {
    let user_name = "Alice";
    println!("{}", greet_user(user_name));
    
    let area = calculate_area(5.0, 3.0);
    println!("Area: {}", area);
}`,
      solution: `fn greet_user(name: &str) -> String {
    format!("Hello, {}! Welcome to Rust!", name)
}

fn calculate_area(length: f64, width: f64) -> f64 {
    length * width
}

fn main() {
    let user_name = "Alice";
    println!("{}", greet_user(user_name));
    
    let area = calculate_area(5.0, 3.0);
    println!("Area: {}", area);
}`,
      explanation:
        "This solution demonstrates Rust's ownership system with string slices (&str), the format! macro for string formatting, and basic function definitions with type annotations.",
      hints: [
        "Use the format! macro to create formatted strings in Rust",
        "Remember that Rust functions need explicit return types",
        "String slices (&str) are used for borrowed string data",
        "The last expression in a function is automatically returned",
      ],
      testCases: [
        {
          input: 'greet_user("Bob")',
          expectedOutput: "Hello, Bob! Welcome to Rust!",
          description: "Should create a personalized greeting",
        },
        {
          input: "calculate_area(4.0, 6.0)",
          expectedOutput: "24.0",
          description: "Should calculate area correctly",
        },
      ],
      concepts: ["Variables", "Functions", "String formatting", "Type annotations"],
    },
    ownership: {
      title: "Rust Ownership and Borrowing",
      description: "Master Rust's unique ownership system and borrowing rules",
      difficulty: "Medium",
      instructions: "Complete the functions to demonstrate ownership, borrowing, and references in Rust.",
      starterCode: `// Ownership and Borrowing Exercise
// Fix the ownership issues in the code below

fn take_ownership(s: String) {
    println!("Taking ownership of: {}", s);
}

fn borrow_string(s: &String) -> usize {
    // TODO: Return the length of the string
}

fn modify_string(s: &mut String) {
    // TODO: Add " - Modified!" to the end of the string
}

fn main() {
    let mut my_string = String::from("Hello, Rust");
    
    // TODO: Fix the borrowing issues
    let len = borrow_string(&my_string);
    println!("Length: {}", len);
    
    modify_string(&mut my_string);
    println!("Modified: {}", my_string);
    
    take_ownership(my_string);
    // println!("{}", my_string); // This would cause an error!
}`,
      solution: `fn take_ownership(s: String) {
    println!("Taking ownership of: {}", s);
}

fn borrow_string(s: &String) -> usize {
    s.len()
}

fn modify_string(s: &mut String) {
    s.push_str(" - Modified!");
}

fn main() {
    let mut my_string = String::from("Hello, Rust");
    
    let len = borrow_string(&my_string);
    println!("Length: {}", len);
    
    modify_string(&mut my_string);
    println!("Modified: {}", my_string);
    
    take_ownership(my_string);
    // println!("{}", my_string); // This would cause an error!
}`,
      explanation:
        "This demonstrates Rust's ownership rules: each value has one owner, borrowing allows temporary access without taking ownership, and mutable references allow modification.",
      hints: [
        "Use .len() method to get string length",
        "Use .push_str() to append to a mutable string",
        "Remember the difference between &String and &mut String",
        "Once ownership is moved, the original variable can't be used",
      ],
      testCases: [
        {
          input: 'borrow_string(&String::from("test"))',
          expectedOutput: "4",
          description: "Should return correct string length",
        },
      ],
      concepts: ["Ownership", "Borrowing", "References", "Mutability"],
    },
  },
  TypeScript: {
    fundamentals: {
      title: "TypeScript Basics: Types and Interfaces",
      description: "Practice TypeScript type annotations and interface definitions",
      difficulty: "Easy",
      instructions: "Add proper type annotations and create interfaces for the given JavaScript code.",
      starterCode: `// TypeScript Fundamentals Exercise
// Add type annotations and create interfaces

// TODO: Create an interface for User
interface User {
    // Define the structure here
}

// TODO: Add proper type annotations
function greetUser(user) {
    return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

// TODO: Add type annotations for the array and return type
function getActiveUsers(users) {
    return users.filter(user => user.isActive);
}

// TODO: Add type annotations
function calculateTotal(prices) {
    return prices.reduce((sum, price) => sum + price, 0);
}

// Test the functions
const testUser = {
    name: "Alice",
    age: 30,
    isActive: true
};

console.log(greetUser(testUser));`,
      solution: `interface User {
    name: string;
    age: number;
    isActive: boolean;
}

function greetUser(user: User): string {
    return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

function getActiveUsers(users: User[]): User[] {
    return users.filter(user => user.isActive);
}

function calculateTotal(prices: number[]): number {
    return prices.reduce((sum, price) => sum + price, 0);
}

const testUser: User = {
    name: "Alice",
    age: 30,
    isActive: true
};

console.log(greetUser(testUser));`,
      explanation:
        "This solution demonstrates TypeScript's type system with interfaces, function parameter types, return types, and array types for better code safety and documentation.",
      hints: [
        "Interfaces define the shape of objects in TypeScript",
        "Use : Type syntax to add type annotations",
        "Array types can be written as Type[] or Array<Type>",
        "Function return types come after the parameter list",
      ],
      testCases: [
        {
          input: "greetUser({name: 'Bob', age: 25, isActive: true})",
          expectedOutput: "Hello, Bob! You are 25 years old.",
          description: "Should create proper greeting with type safety",
        },
      ],
      concepts: ["Interfaces", "Type annotations", "Function types", "Array types"],
    },
  },
}

// Generate exercise based on module and language
function generateExercise(moduleTitle: string, targetLanguage: string, currentLanguage: string, skillLevel: string) {
  const language = targetLanguage.toLowerCase()
  const topic = getTopicFromModule(moduleTitle)

  // Try to find specific template
  const languageTemplates = exerciseTemplates[targetLanguage as keyof typeof exerciseTemplates]
  if (languageTemplates && languageTemplates[topic as keyof typeof languageTemplates]) {
    return languageTemplates[topic as keyof typeof languageTemplates]
  }

  // Generate generic exercise
  return {
    title: `${targetLanguage} Practice: ${moduleTitle}`,
    description: `Practice the key concepts from ${moduleTitle} with hands-on coding`,
    difficulty: skillLevel === "beginner" ? "Easy" : skillLevel === "advanced" ? "Hard" : "Medium",
    instructions: `Complete the function below to demonstrate your understanding of ${moduleTitle}. Apply the concepts you learned in this module.`,
    starterCode: generateStarterCode(language, moduleTitle),
    solution: generateSolution(language, moduleTitle),
    explanation: `This exercise demonstrates key concepts from ${moduleTitle} in ${targetLanguage}, helping you practice the syntax and patterns you've learned.`,
    hints: [
      `Review the ${moduleTitle} documentation for syntax help`,
      `Think about how ${targetLanguage} handles this differently from ${currentLanguage}`,
      "Start with the simplest implementation first",
      "Test your solution with different inputs",
    ],
    testCases: [
      {
        input: "Basic test case",
        expectedOutput: "Expected result",
        description: "Should handle basic functionality",
      },
    ],
    concepts: [moduleTitle, "Basic syntax", "Problem solving"],
  }
}

function getTopicFromModule(moduleTitle: string): string {
  const title = moduleTitle.toLowerCase()
  if (title.includes("fundamental") || title.includes("basic") || title.includes("intro")) {
    return "fundamentals"
  }
  if (title.includes("ownership") || title.includes("memory") || title.includes("borrow")) {
    return "ownership"
  }
  if (title.includes("type") || title.includes("interface")) {
    return "types"
  }
  return "fundamentals"
}

function generateStarterCode(language: string, moduleTitle: string): string {
  const templates: { [key: string]: string } = {
    Rust: `// ${moduleTitle} Exercise
// Complete the function below

fn solve_challenge() -> String {
    // TODO: Implement your solution here
    String::from("Hello, World!")
}

fn main() {
    println!("{}", solve_challenge());
}`,
    TypeScript: `// ${moduleTitle} Exercise
// Complete the function below

function solveChallenge(): string {
    // TODO: Implement your solution here
    return "Hello, World!";
}

console.log(solveChallenge());`,
    Python: `# ${moduleTitle} Exercise
# Complete the function below

def solve_challenge():
    # TODO: Implement your solution here
    return "Hello, World!"

print(solve_challenge())`,
    JavaScript: `// ${moduleTitle} Exercise
// Complete the function below

function solveChallenge() {
    // TODO: Implement your solution here
    return "Hello, World!";
}

console.log(solveChallenge());`,
  }

  return templates[language] || templates["JavaScript"]
}

function generateSolution(language: string, moduleTitle: string): string {
  const templates: { [key: string]: string } = {
    Rust: `fn solve_challenge() -> String {
    String::from("Hello, World!")
}

fn main() {
    println!("{}", solve_challenge());
}`,
    TypeScript: `function solveChallenge(): string {
    return "Hello, World!";
}

console.log(solveChallenge());`,
    Python: `def solve_challenge():
    return "Hello, World!"

print(solve_challenge())`,
    JavaScript: `function solveChallenge() {
    return "Hello, World!";
}

console.log(solveChallenge());`,
  }

  return templates[language] || templates["JavaScript"]
}

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 Generating exercise...")

    const { moduleTitle, targetLanguage, currentLanguage, skillLevel } = await request.json()

    console.log("📚 Exercise request:", { moduleTitle, targetLanguage, currentLanguage })

    // Generate exercise using templates
    const exercise = generateExercise(moduleTitle, targetLanguage, currentLanguage, skillLevel)

    console.log("✅ Exercise generated:", exercise.title)

    return NextResponse.json({
      success: true,
      exercise: exercise,
    })
  } catch (error) {
    console.error("❌ Error generating exercise:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate exercise",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
