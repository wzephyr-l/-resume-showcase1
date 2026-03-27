// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await pdf(fileBuffer);

    // Extract text from all pages
    let fullText = '';
    if (data.pages && data.pages.length > 0) {
      fullText = data.pages
        .map((page: any) => page.getTextContent())
        .flat()
        .map((item: any) => item.str || '')
        .join(' ');
    } else {
      // Fallback to text property if pages not available
      fullText = data.text || '';
    }

    // Clean up text
    fullText = fullText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export function truncateText(text: string, maxTokens: number = 15000): string {
  // Rough estimation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  if (text.length > maxChars) {
    return text.substring(0, maxChars);
  }
  return text;
}
