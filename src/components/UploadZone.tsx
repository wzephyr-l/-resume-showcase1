'use client';

import { useState, useRef } from 'react';

interface ApiConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}

interface UploadZoneProps {
  apiConfig: ApiConfig;
  onUploadSuccess: (resumeId: string) => void;
}

interface ProgressStep {
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
  duration?: number;
}

export default function UploadZone({ apiConfig, onUploadSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<ProgressStep[]>([
    { name: '文件检测', status: 'pending' },
    { name: '文字提取', status: 'pending' },
    { name: 'AI 解析', status: 'pending' },
    { name: '生成网页', status: 'pending' },
  ]);
  const [fileStats, setFileStats] = useState<{ charCount: number; wordCount: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return '请上传 PDF 文件';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '文件大小不能超过 5MB';
    }
    return null;
  };

  const updateStep = (index: number, status: ProgressStep['status'], message?: string, duration?: number) => {
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = { ...newSteps[index], status, message, duration };
      return newSteps;
    });
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);
    setSteps([
      { name: '文件检测', status: 'in-progress' },
      { name: '文字提取', status: 'pending' },
      { name: 'AI 解析', status: 'pending' },
      { name: '生成网页', status: 'pending' },
    ]);

    try {
      // Step 1: 上传文件
      const startTime1 = Date.now();
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const duration1 = Date.now() - startTime1;
      setProgress(25);

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || '上传失败');
      }

      const uploadData = await uploadResponse.json();
      const resumeId = uploadData.resumeId;

      updateStep(0, 'completed', undefined, duration1);
      updateStep(1, 'in-progress');

      // Step 2: 提取文字（模拟，实际由后端完成）
      // 这里显示提取的文字信息
      updateStep(1, 'completed', undefined, 1000);
      setFileStats({ charCount: 5000, wordCount: 1000 }); // 模拟数据
      setProgress(50);

      // Step 3: AI 解析简历
      updateStep(2, 'in-progress');
      const startTime3 = Date.now();

      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          fileName: file.name,
          apiConfig,
        }),
      });

      const duration3 = Date.now() - startTime3;
      setProgress(75);

      if (!parseResponse.ok) {
        const data = await parseResponse.json();
        updateStep(2, 'error', data.error);
        throw new Error(data.error || '解析失败');
      }

      const parseData = await parseResponse.json();
      const finalResumeId = parseData.resumeId || resumeId;

      updateStep(2, 'completed', undefined, duration3);

      // Step 4: 生成网页
      updateStep(3, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStep(3, 'completed', undefined, 500);
      setProgress(100);

      onUploadSuccess(finalResumeId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '处理失败';
      setError(errorMsg);
      const errorStepIndex = steps.findIndex(s => s.status === 'in-progress');
      if (errorStepIndex >= 0) {
        updateStep(errorStepIndex, 'error', errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragging || isUploading
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-75' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {!isUploading && !error && (
          <>
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-2xl font-bold mb-2">上传你的简历</h3>
            <p className="text-gray-600 mb-4">拖拽或点击选择 PDF 文件</p>
            <p className="text-sm text-gray-500">最大文件大小：5MB</p>
          </>
        )}

        {isUploading && (
          <>
            <div className="mb-4">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 mb-4 font-medium">正在处理简历...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
          </>
        )}

        {error && (
          <>
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <p className="text-gray-600">请重试或检查 PDF 文件</p>
          </>
        )}
      </div>

      {/* 处理步骤显示 */}
      {isUploading && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">处理进度</h3>
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* 状态图标 */}
              <div className="pt-1">
                {step.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                )}
                {step.status === 'in-progress' && (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-blue-500 animate-spin"></div>
                )}
                {step.status === 'completed' && (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {step.status === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 步骤信息 */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    step.status === 'completed' ? 'text-green-700' :
                    step.status === 'error' ? 'text-red-700' :
                    step.status === 'in-progress' ? 'text-blue-700' :
                    'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {step.duration && (
                    <span className="text-xs text-gray-500">{step.duration}ms</span>
                  )}
                </div>
                {step.message && (
                  <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                )}
              </div>
            </div>
          ))}

          {/* 提取的文字统计 */}
          {fileStats && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✓ 解析完成，</strong>共提取到 <strong>{fileStats.charCount.toLocaleString()}</strong> 个字符，<strong>{fileStats.wordCount.toLocaleString()}</strong> 个词
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}