import Anthropic from '@anthropic-ai/sdk';
import { Resume, ParsedResumeResponse } from './resume-schema';
import { v4 as uuidv4 } from 'uuid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `你是一个专业的简历解析助手。请从简历文本中提取结构化信息，返回有效的 JSON。

重要：返回完整闭合的 JSON，不要被截断！

请严格按照以下 JSON 格式返回（只返回 JSON，不要任何其他文字）：
{
  "personal": {
    "name": "姓名",
    "email": "邮箱或null",
    "phone": "电话或null",
    "location": "城市或null",
    "summary": "个人简介或null"
  },
  "experiences": [
    {
      "company": "公司名称",
      "title": "职位名称",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM或至今",
      "description": ["工作描述1","工作描述2","工作描述3"]
    }
  ],
  "skills": ["技能1","技能2","技能3","技能4","技能5"],
  "education": [
    {
      "school": "学校名称",
      "degree": "学历",
      "major": "专业",
      "graduationYear": "年份"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["技术栈1", "技术栈2"]
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
