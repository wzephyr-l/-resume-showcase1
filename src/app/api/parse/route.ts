import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { extractTextFromPDF, truncateText } from '@/lib/pdf-parser';
import { parseResumeWithCustomApi } from '@/lib/api-client';
import { saveResume } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
  try {
    const { resumeId, fileName, apiConfig } = await request.json();

    if (!resumeId || !fileName) {
      return NextResponse.json(
        { error: 'Missing resumeId or fileName' },
        { status: 400 }
      );
    }

    // 检查是否提供了 API 配置
    if (!apiConfig || !apiConfig.apiUrl || !apiConfig.apiKey) {
      return NextResponse.json(
        { error: 'Missing API configuration. Please configure your API first.' },
        { status: 400 }
      );
    }

    // Find the uploaded PDF file
    const filePath = path.join(UPLOAD_DIR, `${resumeId}.pdf`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Resume file not found' },
        { status: 404 }
      );
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const rawText = await extractTextFromPDF(pdfBuffer);

    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: '无法从 PDF 中提取文本内容' },
        { status: 400 }
      );
    }

    // Truncate text to avoid exceeding API limits
    const truncatedText = truncateText(rawText);

    // Parse resume using user's custom API
    const parsedResult = await parseResumeWithCustomApi(truncatedText, fileName, apiConfig, resumeId);

    // Save resume to database
    saveResume(parsedResult.resume);

    // Delete the temporary PDF file
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      resumeId: parsedResult.resume.id,
      resume: parsedResult.resume,
      confidence: parsedResult.confidence,
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '解析简历失败，请检查 API 配置后重试。',
      },
      { status: 500 }
    );
  }
}