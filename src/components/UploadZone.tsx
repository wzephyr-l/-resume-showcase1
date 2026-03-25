'use client';

import { useState, useRef } from 'react';

interface UploadZoneProps {
  onUploadSuccess: (resumeId: string) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please upload a PDF file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Step 1: Upload file
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 40) {
            clearInterval(progressInterval);
            return 40;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(50);

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const resumeId = uploadData.resumeId;

      // Step 2: Parse resume with Claude
      const parseInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(parseInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          fileName: file.name,
        }),
      });

      clearInterval(parseInterval);
      setProgress(100);

      if (!parseResponse.ok) {
        const data = await parseResponse.json();
        throw new Error(data.error || 'Parsing failed');
      }

      onUploadSuccess(resumeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Process failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
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
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragging || isUploading
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
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
            <h3 className="text-2xl font-bold mb-2">Drop your resume here</h3>
            <p className="text-gray-600 mb-4">or click to select a PDF file</p>
            <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
          </>
        )}

        {isUploading && (
          <>
            <div className="mb-4">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 mb-2">Uploading your resume...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-full transition-all duration-300"
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
            <p className="text-gray-600">Please try again with a valid PDF file</p>
          </>
        )}
      </div>
    </div>
  );
}
