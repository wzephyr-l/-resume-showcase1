import path from 'path';
import fs from 'fs';
import { Resume } from './resume-schema';

const DATA_DIR = path.join(process.cwd(), 'data/resumes');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getResumePath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

export function saveResume(resume: Resume): void {
  ensureDataDir();

  const resumePath = getResumePath(resume.id);
  const data = JSON.stringify(resume, null, 2);

  fs.writeFileSync(resumePath, data, 'utf-8');
}

export function getResume(id: string): Resume | null {
  ensureDataDir();

  const resumePath = getResumePath(id);

  if (!fs.existsSync(resumePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(resumePath, 'utf-8');
    const resume: Resume = JSON.parse(data);

    // Convert date strings back to Date objects
    resume.uploadedAt = new Date(resume.uploadedAt);
    if (resume.expiresAt) {
      resume.expiresAt = new Date(resume.expiresAt);
    }

    return resume;
  } catch (error) {
    console.error('Error reading resume:', error);
    return null;
  }
}

export function deleteResume(id: string): boolean {
  ensureDataDir();

  const resumePath = getResumePath(id);

  if (!fs.existsSync(resumePath)) {
    return false;
  }

  try {
    fs.unlinkSync(resumePath);
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

export function getAllResumes(): Resume[] {
  ensureDataDir();

  try {
    const files = fs.readdirSync(DATA_DIR);
    const resumes: Resume[] = [];

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        try {
          const data = fs.readFileSync(filePath, 'utf-8');
          const resume: Resume = JSON.parse(data);

          // Convert date strings back to Date objects
          resume.uploadedAt = new Date(resume.uploadedAt);
          if (resume.expiresAt) {
            resume.expiresAt = new Date(resume.expiresAt);
          }

          resumes.push(resume);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
    });

    // Sort by uploadedAt descending
    return resumes.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 100);
  } catch (error) {
    console.error('Error reading resumes:', error);
    return [];
  }
}

export function cleanupExpiredResumes(): number {
  ensureDataDir();

  const resumes = getAllResumes();
  let deletedCount = 0;

  resumes.forEach((resume) => {
    if (resume.expiresAt && resume.expiresAt < new Date()) {
      if (deleteResume(resume.id)) {
        deletedCount++;
      }
    }
  });

  return deletedCount;
}

export function closeDatabase(): void {
  // No-op for file-based storage
}

