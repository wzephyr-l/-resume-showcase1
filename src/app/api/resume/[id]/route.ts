import { NextRequest, NextResponse } from 'next/server';
import { getResume } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    const resume = getResume(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Check if resume has expired
    if (resume.expiresAt && resume.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This resume has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
