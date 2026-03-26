import { NextRequest, NextResponse } from 'next/server';
import { testApiConnection } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const { apiUrl, apiKey, model } = await request.json();

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing apiUrl or apiKey' },
        { status: 400 }
      );
    }

    const result = await testApiConnection({ apiUrl, apiKey, model: model || '' });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}