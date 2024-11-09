// src/app/api/analyze/feedback/route.ts
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

const ROLES = [
  {
    role: 'ux-designer',
    label: 'UX Designer',
    prompt: `You are a UX/UI Designer. Review this PRD and provide:
      1. An overall assessment (2-3 sentences)
      2. A list of 5 key considerations prefixed with numbers (1., 2., etc.)
      3. A list of 5 action items prefixed with numbers (1., 2., etc.)
      
      Format your response exactly as:
      Assessment:
      [Your assessment here]

      Key Considerations:
      1. First consideration
      2. Second consideration
      (and so on...)
      
      Action Items:
      1. First action item
      2. Second action item
      (and so on...)`
  },
  {
    role: 'product-manager',
    label: 'Product Manager',
    prompt: `You are a Product Manager. Review this PRD and provide:
      1. An overall assessment (2-3 sentences)
      2. A list of 5 key considerations prefixed with numbers (1., 2., etc.)
      3. A list of 5 action items prefixed with numbers (1., 2., etc.)
      
      Format your response exactly as:
      Assessment:
      [Your assessment here]

      Key Considerations:
      1. First consideration
      2. Second consideration
      (and so on...)
      
      Action Items:
      1. First action item
      2. Second action item
      (and so on...)`
  },
  {
    role: 'backend-engineer',
    label: 'Backend Engineer',
    prompt: `You are a Backend Engineer. Review this PRD and provide:
      1. An overall assessment (2-3 sentences)
      2. A list of 5 key considerations prefixed with numbers (1., 2., etc.)
      3. A list of 5 action items prefixed with numbers (1., 2., etc.)
      
      Format your response exactly as:
      Assessment:
      [Your assessment here]

      Key Considerations:
      1. First consideration
      2. Second consideration
      (and so on...)
      
      Action Items:
      1. First action item
      2. Second action item
      (and so on...)`
  }
];

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log('Request body received:', body);

    if (!body.sections) {
      throw new Error('No sections provided');
    }

    // Convert sections object to formatted PRD text
    const prdText = Object.entries(body.sections)
      .map(([title, content]) => `${title}:\n${content}`)
      .join('\n\n');

    // Get feedback from each role
    const feedbackPromises = ROLES.map(async ({ role, label, prompt }) => {
      console.log(`Getting feedback for ${label}`);
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: prdText }
          ],
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 1500,
        });
        
        const content = completion.choices[0].message.content || '';
        console.log(`Raw ${label} feedback:`, content);

        // Parse the sections
        const assessmentMatch = content.match(/Assessment:([\s\S]*?)(?=Key Considerations:)/i);
        const considerationsMatch = content.match(/Key Considerations:([\s\S]*?)(?=Action Items:)/i);
        const actionItemsMatch = content.match(/Action Items:([\s\S]*)/i);

        const assessment = assessmentMatch ? assessmentMatch[1].trim() : '';
        const considerations = considerationsMatch ? 
          considerationsMatch[1]
            .trim()
            .split('\n')
            .map(item => item.trim())
            .filter(item => item.match(/^\d+\./))
            .map(item => item.replace(/^\d+\.\s*/, '')) : [];

        const actionItems = actionItemsMatch ?
          actionItemsMatch[1]
            .trim()
            .split('\n')
            .map(item => item.trim())
            .filter(item => item.match(/^\d+\./))
            .map(item => item.replace(/^\d+\.\s*/, '')) : [];

        return {
          role,
          feedback: {
            assessment,
            considerations,
            actionItems,
            status: 'completed'
          }
        };
      } catch (error: any) {
        console.error(`Error getting ${label} feedback:`, error);
        return {
          role,
          feedback: {
            assessment: 'Error processing feedback',
            considerations: ['Error processing feedback'],
            actionItems: ['Please try again later'],
            status: 'error'
          }
        };
      }
    });

    const feedbackResults = await Promise.all(feedbackPromises);
    const feedback = feedbackResults.reduce((acc, { role, feedback }) => {
      acc[role] = feedback;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ feedback });

  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process PRD', details: error.message },
      { status: 500 }
    );
  }
};