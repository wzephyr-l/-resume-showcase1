export interface Resume {
  id: string;
  fileName: string;
  uploadedAt: Date;
  expiresAt?: Date;

  // 个人信息
  personal: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };

  // 工作经历
  experiences: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;

  // 技能
  skills: string[];

  // 教育背景
  education: Array<{
    school: string;
    degree: string;
    major: string;
    graduationYear: string;
  }>;

  // 项目经验
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;

  // 原始数据
  rawText: string; // 原始 PDF 文本
  parsedData: Record<string, unknown>; // Claude 解析的原始数据
}

export interface ParsedResumeRequest {
  rawText: string;
  fileName: string;
}

export interface ParsedResumeResponse {
  resume: Resume;
  confidence: number; // 0-1, 解析置信度
  warnings?: string[];
}
