#!/usr/bin/env node

// Test script for Grok API integration
// Run with: node test-grok-integration.js

const { spawn } = require('child_process');
const path = require('path');

async function testGrokIntegration() {
  console.log('🧪 Testing Grok API Integration...\n');

  // Test 1: Check environment variable
  console.log('1️⃣ Checking GROK_API_KEY...');
  if (process.env.GROK_API_KEY) {
    console.log('✅ GROK_API_KEY is set');
  } else {
    console.log('❌ GROK_API_KEY is not set');
    console.log('Please set your Grok API key in .env file');
    return;
  }

  // Test 2: Test pathway generation endpoint
  console.log('\n2️⃣ Testing pathway generation...');
  try {
    const response = await fetch('http://localhost:3000/api/ai-pathway-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentLanguage: 'JavaScript',
        targetLanguage: 'Python',
        skillLevel: 'intermediate',
        goals: 'Learn data science with Python'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Pathway generation successful');
      console.log(`Generated pathway: ${data.pathway?.title || 'No title'}`);
    } else {
      console.log('❌ Pathway generation failed');
      console.log(`Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Network error testing pathway generation');
    console.log('Make sure your development server is running (npm run dev)');
  }

  // Test 3: Test exercise generation endpoint
  console.log('\n3️⃣ Testing exercise generation...');
  try {
    const response = await fetch('http://localhost:3000/api/generate-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'Python',
        topic: 'functions',
        difficulty: 'beginner'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Exercise generation successful');
      console.log(`Generated exercise: ${data.exercise?.title || 'No title'}`);
    } else {
      console.log('❌ Exercise generation failed');
      console.log(`Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Network error testing exercise generation');
  }

  // Test 4: Test Q&A endpoint
  console.log('\n4️⃣ Testing Q&A endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/ai-qa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'What is the difference between Python and JavaScript?'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Q&A successful');
      console.log(`Answer length: ${data.answer?.length || 0} characters`);
    } else {
      console.log('❌ Q&A failed');
      console.log(`Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Network error testing Q&A');
  }

  console.log('\n🏁 Testing complete!');
  console.log('\nTo run the application:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('3. Open http://localhost:3000');
}

// Run the test
testGrokIntegration().catch(console.error);
