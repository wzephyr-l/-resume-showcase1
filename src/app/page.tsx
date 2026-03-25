'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';

export default function Home() {
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);

  const handleUploadSuccess = (resumeId: string) => {
    setUploadedResumeId(resumeId);
    // Redirect to resume page after 2 seconds
    setTimeout(() => {
      window.location.href = `/resume/${resumeId}`;
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Resume Showcase
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Transform your PDF resume into a beautiful online portfolio
          </p>
          <p className="text-gray-500">
            Powered by AI - No account needed, instant results
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                Upload Your Resume
              </h3>
              <p className="text-gray-600">
                Simply drag and drop your PDF resume or click to select a file. We support PDF files up to 5MB.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                AI Parsing
              </h3>
              <p className="text-gray-600">
                Our AI extracts and structures your resume data with 90%+ accuracy, handling various formats and languages.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  3
                </span>
                Share Instantly
              </h3>
              <p className="text-gray-600">
                Get a unique shareable link to your online resume. Perfect for job applications and networking.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold mb-2">Beautiful Templates</h3>
              <p className="text-gray-600">Multiple professional design templates to choose from</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="font-semibold mb-2">Shareable Links</h3>
              <p className="text-gray-600">Get instant shareable links for your online resume</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Results in seconds with no sign up required</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {uploadedResumeId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">Resume Uploaded!</h3>
              <p className="text-gray-600 mb-4">Redirecting to your resume page...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
