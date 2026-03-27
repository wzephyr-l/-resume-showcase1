import { Resume, ParsedResumeResponse } from './resume-schema';
import { v4 as uuidv4 } from 'uuid';

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
      max_tokens: 8192, // 增加 token 限制，避免响应被截断
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
      max_tokens: 8192, // 增加 token 限制，避免响应被截断
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
    const messages: any[] = [];

    // Kimi 不支持 system 消息，需要合并到 user 消息中
    if (url.includes('moonshot.cn')) {
      messages.push({
        role: 'user',
        content: `${SYSTEM_PROMPT}\n\n请解析以下简历文本：\n\n${rawText}`,
      });
    } else {
      messages.push({
        role: 'system',
        content: SYSTEM_PROMPT,
      });
      messages.push({
        role: 'user',
        content: `请解析以下简历文本：\n\n${rawText}`,
      });
    }

    const body: any = {
      model: config.model,
      messages,
      max_tokens: 8192, // 增加 token 限制，避免响应被截断
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
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
        throw new Error(errorMessage);
      } catch {
        throw new Error(`API 请求失败 (${response.status}): ${errorText.substring(0, 200)}`);
      }
    }

    const data = await response.json();

    // 调试日志
    const responseStr = JSON.stringify(data);
    console.log('[API] Response data:', responseStr.substring(0, 500));

    // 检查是否有 API 错误
    if (data.error) {
      throw new Error(`API 错误: ${data.error.message || JSON.stringify(data.error)}`);
    }

    // 检查响应是否完整（JSON 被截断的情况）
    if (!responseStr.endsWith('}') && !responseStr.endsWith('"]')) {
      console.error('[API] Response appears to be truncated:', responseStr.substring(0, 300));
    }

    const responseText = parseApiResponse(data, apiConfig);

    console.log('[API] Parsed response text:', responseText?.substring(0, 200));

    if (!responseText) {
      throw new Error(`API 响应为空或格式异常。原始响应：${responseStr.substring(0, 300)}`);
    }

    // 解析 JSON 响应
    let parsedData;
    try {
      // 去除 Markdown 代码块标记 ```json 和 ```
      let cleanText = responseText
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '')
        .replace(/^```\n?/, '')
        .replace(/\n?```$/, '')
        .trim();

      // 尝试直接解析
      try {
        parsedData = JSON.parse(cleanText);
      } catch (e1) {
        // 尝试修复被截断的 JSON - 尝试补全缺失的括号
        try {
          let fixedText = cleanText;
          // 计算缺失的闭合括号
          const openBraces = (fixedText.match(/\{/g) || []).length;
          const closeBraces = (fixedText.match(/\}/g) || []).length;
          const openBrackets = (fixedText.match(/\[/g) || []).length;
          const closeBrackets = (fixedText.match(/\]/g) || []).length;

          // 添加缺失的闭合括号
          for (let i = 0; i < openBraces - closeBraces; i++) fixedText += '}';
          for (let i = 0; i < openBrackets - closeBrackets; i++) fixedText += ']';

          console.log('[API] Trying to fix JSON, added braces/brackets');
          parsedData = JSON.parse(fixedText);
        } catch (e2) {
          // 最后尝试：查找 JSON 块
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('无法找到有效的 JSON 内容');
          }
        }
      }
    } catch (err) {
      // 提供更详细的错误信息
      const truncated = responseText.length > 500 ? responseText.substring(0, 500) + '...' : responseText;
      throw new Error(`AI 响应解析失败。返回内容：${truncated}`);
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

      projects: (parsedData.projects || []).map((proj: any) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
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