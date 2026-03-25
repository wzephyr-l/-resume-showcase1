import Anthropic from '@anthropic-ai/sdk';
import { Resume, ParsedResumeResponse } from './resume-schema';
import { v4 as uuidv4 } from 'uuid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert resume parser. Your task is to extract structured information from PDF resume text and convert it into a well-organized JSON format.

Extract the following information:
1. Personal Information: name, email, phone, location, professional summary
2. Work Experience: company, job title, dates (start/end), descriptions/achievements
3. Skills: technical and soft skills
4. Education: school/university, degree, major/field, graduation year

IMPORTANT RULES:
- Return ONLY valid JSON, no other text
- Dates should be in format "YYYY-MM" (e.g., "2020-01")
- Use empty arrays/objects if information is not found
- Preserve all details from the original text
- Convert any date variations to the YYYY-MM format
- For descriptions, split them into bullet points

Return the JSON with this exact structure:
{
  "personal": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "summary": "string or null"
  },
  "experiences": [
    {
      "company": "string",
      "title": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": ["string"]
    }
  ],
  "skills": ["string"],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "major": "string",
      "graduationYear": "string"
    }
  ]
}`;

export async function parseResumeWithClaude(
  rawText: string,
  fileName: string
): Promise<ParsedResumeResponse> {
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please parse the following resume text:\n\n${rawText}`,
        },
      ],
    });

    // Extract the text content from the response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    let parsedData;
    try {
      // Find JSON in the response (sometimes Claude includes explanation)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Failed to parse resume structure');
    }

    // Create Resume object
    const resume: Resume = {
      id: uuidv4(),
      fileName,
      uploadedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days

      personal: {
        name: parsedData.personal?.name || 'Unknown',
        email: parsedData.personal?.email || undefined,
        phone: parsedData.personal?.phone || undefined,
        location: parsedData.personal?.location || undefined,
        summary: parsedData.personal?.summary || undefined,
      },

      experiences: (parsedData.experiences || []).map((exp: any) => ({
        company: exp.company || '',
        title: exp.title || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: Array.isArray(exp.description) ? exp.description : [exp.description || ''],
      })),

      skills: parsedData.skills || [],

      education: (parsedData.education || []).map((edu: any) => ({
        school: edu.school || '',
        degree: edu.degree || '',
        major: edu.major || '',
        graduationYear: edu.graduationYear || '',
      })),

      rawText,
      parsedData,
    };

    return {
      resume,
      confidence: message.stop_reason === 'end_turn' ? 0.95 : 0.85,
    };
  } catch (error) {
    console.error('Error parsing resume with Claude:', error);
    throw error;
  }
}

export async function validateApiKey(): Promise<boolean> {
  try {
    await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}
