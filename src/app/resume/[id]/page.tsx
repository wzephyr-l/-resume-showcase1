'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resume } from '@/lib/resume-schema';
import ResumeDisplay from '@/components/ResumeDisplay';

interface ResumePageProps {
  params: Promise<{ id: string }>;
}

export default function ResumePage({ params }: ResumePageProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    // Unwrap params Promise
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${id}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load resume');
        }

        const data = await response.json();
        setResume(data.resume);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Could not load resume</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ResumeDisplay resume={resume} />
    </main>
  );
}
