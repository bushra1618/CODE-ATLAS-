// Test script to verify language-specific resource generation
// Run this after starting the dev server

async function testLanguageSpecificGeneration() {
  const testLanguages = ['C++', 'Python', 'Java', 'Go', 'Rust']
  
  console.log('🧪 Testing Language-Specific Resource Generation\n')
  
  for (const language of testLanguages) {
    console.log(`\n🔍 Testing ${language} pathway generation...`)
    
    try {
      const response = await fetch('http://localhost:3001/api/ai-pathway-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLanguage: 'JavaScript',
          targetLanguage: language,
          skillLevel: 'intermediate',
          goals: `Learn ${language} for systems programming`
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const pathway = data.pathway
        
        console.log(`✅ ${language} pathway generated successfully`)
        console.log(`   Title: ${pathway.title}`)
        console.log(`   Target Language: ${pathway.targetLanguage}`)
        console.log(`   Modules: ${pathway.modules?.length || 0}`)
        
        // Check if resources are language-specific
        if (pathway.modules && pathway.modules.length > 0) {
          const firstModule = pathway.modules[0]
          if (firstModule.resources && firstModule.resources.length > 0) {
            const resource = firstModule.resources[0]
            console.log(`   First resource language: ${resource.language || 'Not specified'}`)
            
            if (resource.language === language) {
              console.log(`   ✅ Resources are ${language}-specific`)
            } else {
              console.log(`   ⚠️  Resources may not be ${language}-specific`)
            }
          }
        }
      } else {
        console.log(`❌ ${language} pathway generation failed: ${response.status}`)
        const errorData = await response.json()
        
        // Check if fallback is language-specific
        if (errorData.pathway) {
          console.log(`   📝 Fallback pathway used for ${language}`)
          console.log(`   Target Language: ${errorData.pathway.targetLanguage}`)
        }
      }
    } catch (error) {
      console.log(`❌ Network error testing ${language}: ${error.message}`)
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n🏁 Language-specific testing complete!')
  console.log('\nTo verify the improvements:')
  console.log('1. Check that each language generates resources specific to that language')
  console.log('2. Verify that C++ resources mention memory management, pointers, etc.')
  console.log('3. Verify that Python resources mention data science, simplicity, etc.')
  console.log('4. Verify that Go resources mention goroutines, concurrency, etc.')
}

// Check if we're in a browser or Node.js environment
if (typeof window !== 'undefined') {
  // Browser environment
  testLanguageSpecificGeneration().catch(console.error)
} else {
  // Node.js environment
  console.log('Run this script in the browser console or update for Node.js fetch')
}

// For Node.js testing, export the function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testLanguageSpecificGeneration }
}
