'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Resume } from '@/lib/resume-schema';

interface ResumeDisplayProps {
  resume: Resume;
}

export default function ResumeDisplay({ resume }: ResumeDisplayProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const resumeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resume/${resume.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上传新简历
          </Link>
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 md:px-12 py-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{resume.personal.name}</h1>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mt-6">
              {resume.personal.email && (
                <a href={`mailto:${resume.personal.email}`} className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {resume.personal.email}
                </a>
              )}
              {resume.personal.phone && (
                <a href={`tel:${resume.personal.phone}`} className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {resume.personal.phone}
                </a>
              )}
              {resume.personal.location && (
                <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {resume.personal.location}
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 md:px-12 py-10 space-y-10">
            {/* Summary / 个人优势 */}
            {resume.personal.summary && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  个人优势
                </h2>
                <ul className="space-y-2">
                  {resume.personal.summary.split(/[。；；\n]/).filter(s => s.trim()).map((item, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  专业技能
                </h2>
                <div className="flex flex-wrap gap-3">
                  {resume.skills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 rounded-xl text-sm font-medium border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume.experiences.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></span>
                  工作经历
                </h2>
                <div className="space-y-8">
                  {resume.experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-8 border-l-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      {exp.description.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
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

            {/* Education */}
            {resume.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  教育背景
                </h2>
                <div className="grid gap-6">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{edu.school}</h3>
                        <p className="text-gray-700">{edu.degree} · {edu.major}</p>
                        <p className="text-sm text-gray-500 mt-1">毕业于 {edu.graduationYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
                  项目经验
                </h2>
                <div className="grid gap-6">
                  {resume.projects.map((project, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 md:px-12 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              分享简历
            </button>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制链接
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          简历展示生成器 · AI-Powered Resume Parser
        </p>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">分享你的简历</h2>
              <p className="text-gray-500 mt-2">复制链接发送给招聘方</p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-500 mb-2">简历链接</p>
              <p className="text-blue-600 font-medium break-all text-sm">{resumeUrl}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={copyToClipboard} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                复制链接
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}