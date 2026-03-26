import { Resume, ParsedResumeResponse } from './resume-schema';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `你是一个专业的简历解析助手。请从下面的简历文本中提取结构化信息，并以有效的 JSON 格式返回。

请严格按以下 JSON 格式返回（只返回 JSON，不要任何其他文字）：
{
  "personal": {
    "name": "姓名",
    "email": "邮箱或 null",
    "phone": "电话或 null",
    "location": "所在地或 null",
    "summary": "个人简介或 null"
  },
  "experiences": [
    {
      "company": "公司名称",
      "title": "职位名称",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM 或 至今",
      "description": ["工作描述要点1", "工作描述要点2"]
    }
  ],
  "skills": ["技能1", "技能2"],
  "education": [
    {
      "school": "学校名称",
      "degree": "学历",
      "major": "专业",
      "graduationYear": "毕业年份"
    }
  ]
}`;

interface ApiConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}

// 检测 API 类型并构建请求头
function buildApiHeaders(config: ApiConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 根据 URL 特征判断 API 类型
  const url = config.apiUrl.toLowerCase();

  // 火山引擎/字节方舟 - 使用 Bearer Token
  if (url.includes('volces.com') || url.includes('ark.cn-beijing') || url.includes('ark.cn-shanghai') || url.includes('api/coding')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // Anthropic 官方
  else if (url.includes('anthropic.com')) {
    headers['x-api-key'] = config.apiKey;
    headers['anthropic-version'] = '2023-06-01';
  }
  // OpenRouter
  else if (url.includes('openrouter.ai')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // OpenAI API
  else if (url.includes('openai.com')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // 智谱 GLM
  else if (url.includes('bigmodel.cn') || url.includes('zhipuai')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // Kimi (月之暗面)
  else if (url.includes('moonshot.cn')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // 阿里 Qwen
  else if (url.includes('aliyuncs.com') || url.includes('qwen')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // 硅基流动
  else if (url.includes('siliconflow')) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  // 默认使用 Bearer Token
  else {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  return headers;
}

// 检测是否使用 Anthropic 格式
function isAnthropicFormat(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('anthropic.com') ||
    lowerUrl.includes('volces.com') ||
    lowerUrl.includes('ark.cn-beijing') ||
    lowerUrl.includes('ark.cn-shanghai') ||
    lowerUrl.includes('ark.cn-hangzhou') ||
    lowerUrl.includes('api/coding') ||
    lowerUrl.includes('/api/v3/') ||
    lowerUrl.includes('openrouter.ai')
  );
}

// 构建请求体（统一使用 Anthropic 兼容格式）
function buildRequestBody(config: ApiConfig, rawText: string): any {
  const url = config.apiUrl.toLowerCase();

  if (isAnthropicFormat(url)) {
    // Anthropic 兼容格式（Claude Code 使用的 API）
    // 注意：火山引擎等兼容 API 可能不支持 system 消息，我们把系统提示放在 user 消息中
    const userContent = `你是简历解析专家。${SYSTEM_PROMPT}\n\n请解析以下简历文本：\n\n${rawText}`;

    return {
      model: config.model || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userContent,
        },
      ],
    };
  } else if (url.includes('openai.com')) {
    // OpenAI API 格式
    return {
      model: config.model || 'gpt-4o-mini',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `请解析以下简历文本：\n\n${rawText}`,
        },
      ],
      temperature: 0.1,
    };
  } else {
    // 其他 OpenAI 兼容格式（智谱、阿里、硅基、Kimi 等）
    const body: any = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `请解析以下简历文本：\n\n${rawText}`,
        },
      ],
      max_tokens: 4096,
    };

    // Kimi 不支持 temperature 参数
    if (!url.includes('moonshot.cn')) {
      body.temperature = 0.1;
    }

    return body;
  }
}

// 解析不同 API 的响应
function parseApiResponse(data: any, config: ApiConfig): any {
  const url = config.apiUrl.toLowerCase();

  if (isAnthropicFormat(url)) {
    // Anthropic 兼容格式响应
    // 处理 content 是数组还是字符串的情况
    if (Array.isArray(data.content)) {
      return data.content.find((c: any) => c.type === 'text')?.text || '';
    }
    return data.content || '';
  } else {
    // OpenAI 兼容格式
    return data.choices?.[0]?.message?.content || '';
  }
}

export async function parseResumeWithCustomApi(
  rawText: string,
  fileName: string,
  apiConfig: ApiConfig,
  resumeId?: string
): Promise<ParsedResumeResponse> {
  try {
    const headers = buildApiHeaders(apiConfig);
    const body = buildRequestBody(apiConfig, rawText);

    const response = await fetch(apiConfig.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const responseText = parseApiResponse(data, apiConfig);

    if (!responseText) {
      throw new Error('API 响应为空');
    }

    // 解析 JSON 响应
    let parsedData;
    try {
      // 查找 JSON（有些 API 可能返回解释文本）
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // 如果没找到 JSON，尝试直接解析整个响应
        parsedData = JSON.parse(responseText);
      } else {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error('Failed to parse API response:', responseText.substring(0, 500));
      throw new Error(`简历结构解析失败：AI 返回的内容无法解析为 JSON。请确保模型能返回有效的 JSON 格式。返回内容：${responseText.substring(0, 200)}...`);
    }

    // 创建 Resume 对象
    const resume: Resume = {
      id: resumeId || uuidv4(),
      fileName,
      uploadedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

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
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Error parsing resume with custom API:', error);
    throw error;
  }
}

// 测试 API 连接
export async function testApiConnection(config: ApiConfig): Promise<{ success: boolean; message: string }> {
  try {
    const headers = buildApiHeaders(config);

    // 发送一个简单的测试请求
    const body = buildRequestBody(config, '你好，请回复 "OK"');

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.error?.message || errorData.message || `API 错误: ${response.status}`,
      };
    }

    const data = await response.json();
    const responseText = parseApiResponse(data, config);

    if (responseText && responseText.length > 0) {
      return {
        success: true,
        message: '连接成功！API 密钥有效。',
      };
    }

    return {
      success: false,
      message: 'API 响应格式异常',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    return {
      success: false,
      message: `连接失败: ${message}`,
    };
  }
}