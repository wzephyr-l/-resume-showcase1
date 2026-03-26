'use client';

import { useState } from 'react';
import ApiConfig from '@/components/ApiConfig';
import UploadZone from '@/components/UploadZone';

interface ApiConfiguration {
  apiUrl: string;
  apiKey: string;
  model: string;
}

export default function Home() {
  const [apiConfig, setApiConfig] = useState<ApiConfiguration | null>(null);
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);

  const handleApiConfigComplete = (config: ApiConfiguration) => {
    setApiConfig(config);
  };

  const handleUploadSuccess = (resumeId: string) => {
    setUploadedResumeId(resumeId);
    // 2 秒后跳转到简历页面
    setTimeout(() => {
      window.location.href = `/resume/${resumeId}`;
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            简历展示生成器
          </h1>
          <p className="text-gray-600">
            上传 PDF 简历，AI 自动解析，生成美观的在线展示页
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!apiConfig ? (
            // 第一部分：API 配置
            <ApiConfig onConfigComplete={handleApiConfigComplete} />
          ) : (
            // 第二部分：上传简历
            <div className="space-y-8">
              {/* API 配置完成提示 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">API 已配置</p>
                    <p className="text-sm text-green-600">准备上传并解析简历</p>
                  </div>
                </div>
                <button
                  onClick={() => setApiConfig(null)}
                  className="text-sm text-green-700 hover:text-green-900 underline"
                >
                  修改
                </button>
              </div>

              {/* 上传区域 */}
              <UploadZone
                apiConfig={apiConfig}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          )}
        </div>

        {/* 成功提示 */}
        {uploadedResumeId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">简历解析成功！</h3>
              <p className="text-gray-600 mb-4">正在跳转到展示页面...</p>
            </div>
          </div>
        )}

        {/* 功能特点 - 仅在配置 API 前显示 */}
        {!apiConfig && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">功能特点</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-semibold mb-2">AI 智能解析</h3>
                <p className="text-gray-600 text-sm">支持多种 AI 模型，准确提取简历信息</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-semibold mb-2">美观展示页</h3>
                <p className="text-gray-600 text-sm">生成专业的在线简历，可分享链接</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="font-semibold mb-2">隐私安全</h3>
                <p className="text-gray-600 text-sm">API 密钥仅在本地使用，数据不经过我们的服务器</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}