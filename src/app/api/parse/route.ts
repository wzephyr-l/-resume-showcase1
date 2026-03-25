import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { extractTextFromPDF, truncateText } from '@/lib/pdf-parser';
import { parseResumeWithClaude } from '@/lib/claude-client';
import { saveResume } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
  try {
    const { resumeId, fileName } = await request.json();

    if (!resumeId || !fileName) {
      return NextResponse.json(
        { error: 'Missing resumeId or fileName' },
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
        { error: 'Could not extract meaningful text from PDF' },
        { status: 400 }
      );
    }

    // Truncate text to avoid exceeding Claude API limits
    const truncatedText = truncateText(rawText);

    // Parse resume using Claude API
    const parsedResult = await parseResumeWithClaude(truncatedText, fileName);

    // Save resume to database
    saveResume(parsedResult.resume);

    // Delete the temporary PDF file
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      resumeId: parsedResult.resume.id,
      resume: parsedResult.resume,
      confidence: parsedResult.confidence,
      warnings: parsedResult.warnings,
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to parse resume. Please try with a different PDF.',
      },
      { status: 500 }
    );
  }
}
