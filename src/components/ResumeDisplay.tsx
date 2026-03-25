'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Resume } from '@/lib/resume-schema';

interface ResumeDisplayProps {
  resume: Resume;
}

export default function ResumeDisplay({ resume }: ResumeDisplayProps) {
  const [theme, setTheme] = useState<'modern' | 'classic'>('modern');
  const [showShareModal, setShowShareModal] = useState(false);

  const resumeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resume/${resume.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeUrl);
    alert('Link copied to clipboard!');
  };

  const downloadPDF = () => {
    // This would require html2pdf or similar library
    alert('PDF export feature coming soon!');
  };

  return (
    <div className="container-custom py-8">
      {/* Header with controls */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-block">
            ← Back to upload
          </Link>
          <h1 className="text-3xl font-bold">{resume.personal.name}</h1>
          <p className="text-gray-600">{resume.personal.summary}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="btn-secondary text-sm"
            title="Download as PDF"
          >
            📥 Download
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn-primary text-sm"
            title="Share this resume"
          >
            🔗 Share
          </button>
        </div>
      </div>

      {/* Theme selector */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setTheme('modern')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            theme === 'modern'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Modern
        </button>
        <button
          onClick={() => setTheme('classic')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            theme === 'classic'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Classic
        </button>
      </div>

      {/* Resume content */}
      <div className={`bg-white rounded-lg shadow-lg p-8 ${theme === 'modern' ? 'modern-theme' : 'classic-theme'}`}>
        {/* Contact Info */}
        {(resume.personal.email || resume.personal.phone || resume.personal.location) && (
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {resume.personal.email && (
                <a href={`mailto:${resume.personal.email}`} className="hover:text-primary-600">
                  ✉️ {resume.personal.email}
                </a>
              )}
              {resume.personal.phone && (
                <a href={`tel:${resume.personal.phone}`} className="hover:text-primary-600">
                  📱 {resume.personal.phone}
                </a>
              )}
              {resume.personal.location && (
                <span>📍 {resume.personal.location}</span>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary-600 border-b-2 border-primary-200 pb-2">
              Experience
            </h2>
            <div className="space-y-6">
              {resume.experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-sm">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary-600 border-b-2 border-primary-200 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-primary-100 text-primary-900 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary-600 border-b-2 border-primary-200 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                  <p className="text-gray-700">{edu.degree} in {edu.major}</p>
                  <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Share Your Resume</h2>
            <p className="text-gray-600 mb-4">Share this link with employers and recruiters:</p>

            <div className="bg-gray-100 p-4 rounded-lg mb-4 break-all text-sm">
              {resumeUrl}
            </div>

            <div className="flex gap-3">
              <button onClick={copyToClipboard} className="btn-primary flex-1">
                📋 Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
