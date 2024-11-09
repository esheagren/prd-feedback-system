// src/app/api/analyze/structure/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key present:', !!apiKey);

if (!apiKey) {
  throw new Error('OpenAI API key is not configured');
}

const openai = new OpenAI({
  apiKey: apiKey
});

export const POST = async (req: Request) => {
  try {
    const { content } = await req.json();
    
    if (!content) {
      throw new Error('No content provided');
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a PRD structuring assistant. Take the user's input and organize it into the following sections:
            - Product Overview
            - Problem Statement
            - Key Features
            - Technical Requirements
            - Success Metrics
            
            For each section, provide clear, well-structured content based on the user's input.
            Format your response exactly as:
            Product Overview:
            [content]

            Problem Statement:
            [content]

            Key Features:
            [content]

            Technical Requirements:
            [content]

            Success Metrics:
            [content]`
        },
        {
          role: "user",
          content
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    const sections = {};
    let currentSection = '';
    
    // Parse the response into sections
    response.split('\n').forEach(line => {
      const sectionMatch = line.match(/^([\w\s]+):/);
      if (sectionMatch) {
        currentSection = sectionMatch[1].trim();
        sections[currentSection] = '';
      } else if (currentSection && line.trim()) {
        sections[currentSection] += (sections[currentSection] ? '\n' : '') + line.trim();
      }
    });

    return NextResponse.json({ sections });

  } catch (error: any) {
    console.error('Error in structure analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to structure PRD',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}