import { type NextRequest, NextResponse } from "next/server"
import { grokAPI } from "../../lib/grok-api"

export async function POST(request: NextRequest) {
  try {
    const { language, topic, difficulty, focusArea, learningObjectives } = await request.json()

    // Validate required fields
    if (!language || !topic || !difficulty) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: language, topic, difficulty" 
        },
        { status: 400 }
      )
    }

    console.log("🚀 Generating exercise with Grok for", language)
    console.log("📝 Parameters:", { language, topic, difficulty, focusArea })

    // Use Grok API to generate the exercise
    const exercise = await grokAPI.generateExercise({
      language,
      topic,
      difficulty,
      focusArea,
      learningObjectives
    })

    // Enhance exercise with metadata
    exercise.id = exercise.id || Date.now().toString()
    exercise.createdAt = new Date().toISOString()
    exercise.generatedBy = "Grok AI"

    console.log("✅ Exercise generated successfully for", language)

    return NextResponse.json({
      success: true,
      exercise,
      generatedBy: "Grok AI"
    })

  } catch (error) {
    console.error("❌ Error generating exercise:", error)

    // Get request data for fallback
    const body = await request.clone().json().catch(() => ({}))
    
    // Create language-specific fallback exercise
    const fallbackExercise = createLanguageSpecificFallbackExercise(
      body.language || "JavaScript",
      body.topic || "fundamentals",
      body.difficulty || "Easy"
    )
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate exercise with Grok AI",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        exercise: fallbackExercise,
        generatedBy: "Language-Specific Template System"
      },
      { status: 500 }
    )
  }
}

// Language-specific fallback exercise creation
function createLanguageSpecificFallbackExercise(language: string, topic: string, difficulty: string) {
  const languageExercises: { [key: string]: any } = {
    "C++": {
      title: "C++ Memory Management Exercise",
      starterCode: `#include <iostream>
#include <memory>

// TODO: Implement a simple class with proper memory management
class Student {
private:
    std::string name;
    int age;
    
public:
    // TODO: Add constructor
    // TODO: Add destructor
    // TODO: Add copy constructor
    // TODO: Add assignment operator
};

int main() {
    // TODO: Create Student objects and demonstrate proper memory management
    return 0;
}`,
      solution: `#include <iostream>
#include <memory>
#include <string>

class Student {
private:
    std::string name;
    int age;
    
public:
    // Constructor
    Student(const std::string& n, int a) : name(n), age(a) {
        std::cout << "Student " << name << " created" << std::endl;
    }
    
    // Destructor
    ~Student() {
        std::cout << "Student " << name << " destroyed" << std::endl;
    }
    
    // Copy constructor
    Student(const Student& other) : name(other.name), age(other.age) {
        std::cout << "Student " << name << " copied" << std::endl;
    }
    
    // Assignment operator
    Student& operator=(const Student& other) {
        if (this != &other) {
            name = other.name;
            age = other.age;
        }
        return *this;
    }
    
    void display() const {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
};

int main() {
    Student s1("Alice", 20);
    Student s2 = s1;  // Copy constructor
    Student s3("Bob", 22);
    s3 = s1;  // Assignment operator
    
    s1.display();
    s2.display();
    s3.display();
    
    return 0;
}`
    },
    "Python": {
      title: "Python Data Structures Exercise",
      starterCode: `# TODO: Create a class to manage a library of books
class Library:
    def __init__(self):
        # TODO: Initialize empty book collection
        pass
    
    def add_book(self, title, author, year):
        # TODO: Add a book to the library
        pass
    
    def find_books_by_author(self, author):
        # TODO: Return all books by a specific author
        pass
    
    def get_books_by_year_range(self, start_year, end_year):
        # TODO: Return books published within a year range
        pass

# TODO: Test your Library class
if __name__ == "__main__":
    library = Library()
    # Add test cases here`,
      solution: `class Library:
    def __init__(self):
        self.books = []
    
    def add_book(self, title, author, year):
        book = {
            'title': title,
            'author': author,
            'year': year
        }
        self.books.append(book)
    
    def find_books_by_author(self, author):
        return [book for book in self.books if book['author'].lower() == author.lower()]
    
    def get_books_by_year_range(self, start_year, end_year):
        return [book for book in self.books if start_year <= book['year'] <= end_year]
    
    def display_all_books(self):
        for book in self.books:
            print(f"{book['title']} by {book['author']} ({book['year']})")

if __name__ == "__main__":
    library = Library()
    library.add_book("1984", "George Orwell", 1949)
    library.add_book("Animal Farm", "George Orwell", 1945)
    library.add_book("Brave New World", "Aldous Huxley", 1932)
    
    print("Books by George Orwell:")
    for book in library.find_books_by_author("George Orwell"):
        print(f"  {book['title']} ({book['year']})")
    
    print("\\nBooks from 1940-1950:")
    for book in library.get_books_by_year_range(1940, 1950):
        print(f"  {book['title']} by {book['author']}")`
    },
    "Java": {
      title: "Java Object-Oriented Programming Exercise",
      starterCode: `// TODO: Create a Vehicle class hierarchy
abstract class Vehicle {
    protected String brand;
    protected String model;
    protected int year;
    
    // TODO: Add constructor
    // TODO: Add abstract method start()
    // TODO: Add abstract method stop()
}

// TODO: Create Car class that extends Vehicle
class Car extends Vehicle {
    private int numberOfDoors;
    
    // TODO: Implement constructor
    // TODO: Implement abstract methods
}

// TODO: Create Motorcycle class that extends Vehicle
class Motorcycle extends Vehicle {
    private boolean hasSidecar;
    
    // TODO: Implement constructor
    // TODO: Implement abstract methods
}

public class VehicleTest {
    public static void main(String[] args) {
        // TODO: Create instances and test functionality
    }
}`,
      solution: `abstract class Vehicle {
    protected String brand;
    protected String model;
    protected int year;
    
    public Vehicle(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    
    public abstract void start();
    public abstract void stop();
    
    public void displayInfo() {
        System.out.println(year + " " + brand + " " + model);
    }
}

class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, String model, int year, int numberOfDoors) {
        super(brand, model, year);
        this.numberOfDoors = numberOfDoors;
    }
    
    @Override
    public void start() {
        System.out.println("Car engine started with key ignition");
    }
    
    @Override
    public void stop() {
        System.out.println("Car engine stopped");
    }
    
    public int getNumberOfDoors() {
        return numberOfDoors;
    }
}

class Motorcycle extends Vehicle {
    private boolean hasSidecar;
    
    public Motorcycle(String brand, String model, int year, boolean hasSidecar) {
        super(brand, model, year);
        this.hasSidecar = hasSidecar;
    }
    
    @Override
    public void start() {
        System.out.println("Motorcycle engine started with kick start");
    }
    
    @Override
    public void stop() {
        System.out.println("Motorcycle engine stopped");
    }
    
    public boolean hasSidecar() {
        return hasSidecar;
    }
}

public class VehicleTest {
    public static void main(String[] args) {
        Car car = new Car("Toyota", "Camry", 2023, 4);
        Motorcycle motorcycle = new Motorcycle("Harley-Davidson", "Street 750", 2022, false);
        
        car.displayInfo();
        car.start();
        car.stop();
        
        motorcycle.displayInfo();
        motorcycle.start();
        motorcycle.stop();
    }
}`
    },
    "Go": {
      title: "Go Concurrency Exercise",
      starterCode: `package main

import (
    "fmt"
    "sync"
    "time"
)

// TODO: Create a worker function that processes jobs
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    // TODO: Implement worker logic
}

func main() {
    // TODO: Set up channels and goroutines
    // TODO: Send jobs to workers
    // TODO: Collect results
}`,
      solution: `package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        time.Sleep(time.Millisecond * 100) // Simulate work
        results <- job * 2 // Double the job number
    }
}

func main() {
    const numWorkers = 3
    const numJobs = 9
    
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    var wg sync.WaitGroup
    
    // Start workers
    for i := 1; i <= numWorkers; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }
    
    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Wait for workers to finish
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    for result := range results {
        fmt.Printf("Result: %d\\n", result)
    }
}`
    },
    "Rust": {
      title: "Rust Ownership and Borrowing Exercise",
      starterCode: `// TODO: Fix the ownership and borrowing issues in this code
fn main() {
    let mut data = vec![1, 2, 3, 4, 5];
    
    // TODO: Implement a function that takes ownership of the vector
    let result = process_data(data);
    
    // TODO: This should work without ownership issues
    println!("Original data: {:?}", data);
    println!("Processed result: {:?}", result);
}

// TODO: Implement this function with proper ownership handling
fn process_data(data: Vec<i32>) -> Vec<i32> {
    // TODO: Process the data and return a new vector
}

// TODO: Implement a function that borrows the data instead
fn calculate_sum(data: &Vec<i32>) -> i32 {
    // TODO: Calculate and return the sum
}`,
      solution: `fn main() {
    let mut data = vec![1, 2, 3, 4, 5];
    
    // Calculate sum without taking ownership
    let sum = calculate_sum(&data);
    println!("Sum: {}", sum);
    
    // Clone the data to pass ownership
    let result = process_data(data.clone());
    
    // This works because we cloned the data
    println!("Original data: {:?}", data);
    println!("Processed result: {:?}", result);
    
    // Demonstrate mutable borrowing
    modify_data(&mut data);
    println!("Modified data: {:?}", data);
}

fn process_data(mut data: Vec<i32>) -> Vec<i32> {
    // Process the data by doubling each element
    for item in &mut data {
        *item *= 2;
    }
    data
}

fn calculate_sum(data: &Vec<i32>) -> i32 {
    data.iter().sum()
}

fn modify_data(data: &mut Vec<i32>) {
    data.push(6);
    data.push(7);
}`
    }
  }

  // Get language-specific exercise or create a generic one
  const exerciseTemplate = languageExercises[language] || {
    title: `${language} Programming Exercise`,
    starterCode: `// ${language} ${topic} exercise\n// TODO: Implement the solution`,
    solution: `// ${language} solution\n// Implementation would go here`
  }

  return {
    id: Date.now().toString(),
    title: exerciseTemplate.title || `${language} ${topic} Exercise`,
    description: `Practice ${language} ${topic} concepts`,
    difficulty,
    language,
    topic,
    estimatedTime: "30 minutes",
    instructions: `Complete the ${language} exercise focusing on ${topic} concepts. Follow ${language} best practices and conventions.`,
    starterCode: exerciseTemplate.starterCode,
    solution: exerciseTemplate.solution,
    explanation: `This exercise helps you practice ${topic} concepts specific to ${language}. It demonstrates ${language} syntax, conventions, and best practices.`,
    hints: [
      `Remember to follow ${language} naming conventions`,
      `Focus on ${language}-specific ${topic} patterns`,
      `Use ${language} standard library features when appropriate`
    ],
    learningObjectives: [
      `Understand ${topic} concepts in ${language}`,
      `Apply ${language}-specific programming patterns`,
      `Write idiomatic ${language} code`
    ],
    testCases: [
      {
        input: "example input",
        expected: "expected output",
        description: `Test case for ${language} ${topic}`
      }
    ],
    createdAt: new Date().toISOString(),
    generatedBy: "Language-Specific Template System"
  }
}
