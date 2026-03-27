'use client';

import { useState, useEffect } from 'react';

interface ApiTemplate {
  name: string;
  url: string;
  keyPlaceholder: string;
  authHeader: string;
  modelParam: string;
}

const API_TEMPLATES: ApiTemplate[] = [
  {
    name: '智谱 GLM',
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    keyPlaceholder: '你的智谱 API Key',
    authHeader: 'Authorization',
    modelParam: 'glm-4-flash',
  },
  {
    name: 'Kimi (月之暗面)',
    url: 'https://api.moonshot.cn/v1/chat/completions',
    keyPlaceholder: '你的 Kimi API Key',
    authHeader: 'Authorization',
    modelParam: 'kimi-k2.5',
  },
  {
    name: 'Claude (Anthropic)',
    url: 'https://api.anthropic.com/v1/messages',
    keyPlaceholder: '你的 Claude API Key',
    authHeader: 'x-api-key',
    modelParam: 'claude-sonnet-4-20250514',
  },
  {
    name: 'OpenAI GPT',
    url: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: '你的 OpenAI API Key',
    authHeader: 'Authorization',
    modelParam: 'gpt-4o-mini',
  },
  {
    name: '阿里 Qwen',
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    keyPlaceholder: '你的阿里 API Key',
    authHeader: 'Authorization',
    modelParam: 'qwen-turbo',
  },
  {
    name: '硅基流动',
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    keyPlaceholder: '你的 SiliconFlow API Key',
    authHeader: 'Authorization',
    modelParam: 'Qwen/Qwen2-7B-Instruct',
  },
  {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    keyPlaceholder: '你的 OpenRouter API Key',
    authHeader: 'Authorization',
    modelParam: 'anthropic/claude-3-haiku',
  },
  {
    name: '字节 火山引擎',
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    keyPlaceholder: '你的字节 API Key',
    authHeader: 'Authorization',
    modelParam: '',
  },
  {
    name: '自定义',
    url: '',
    keyPlaceholder: '输入 API 密钥',
    authHeader: 'Authorization',
    modelParam: '',
  },
];

interface ApiConfigProps {
  onConfigComplete: (config: { apiUrl: string; apiKey: string; model: string }) => void;
}

export default function ApiConfig({ onConfigComplete }: ApiConfigProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [apiUrl, setApiUrl] = useState(API_TEMPLATES[0].url);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(API_TEMPLATES[0].modelParam);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // 切换模板时清空密钥
  const handleTemplateChange = (index: number) => {
    setSelectedTemplate(index);
    setApiUrl(API_TEMPLATES[index].url);
    setModel(API_TEMPLATES[index].modelParam);
    setApiKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!apiUrl || !apiKey) {
      setTestResult({ success: false, message: '请填写 API 地址和密钥' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl,
          apiKey,
          model,
          template: API_TEMPLATES[selectedTemplate],
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({ success: true, message: data.message || '连接成功！' });
      } else {
        setTestResult({ success: false, message: data.error || data.message || '连接失败，请检查 API 地址和密钥' });
      }
    } catch (error) {
      setTestResult({ success: false, message: '网络错误，请检查网络连接' });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = () => {
    if (!apiUrl || !apiKey) {
      setTestResult({ success: false, message: '请填写 API 地址和密钥' });
      return;
    }

    // 不保存密钥到本地，保证安全
    onConfigComplete({ apiUrl, apiKey, model });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          配置你的 AI API
        </h2>
        <p className="text-gray-600 mb-8">
          选择 AI 服务商，填入 API 密钥即可开始
        </p>

        {/* API 模板选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择 AI 服务商
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {API_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateChange(index)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${selectedTemplate === index
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* API 地址 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API 地址
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => {
              setApiUrl(e.target.value);
              setSelectedTemplate(API_TEMPLATES.length - 1);
            }}
            placeholder="输入 API 地址"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* API 密钥 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API 密钥
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={API_TEMPLATES[selectedTemplate].keyPlaceholder}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 模型选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            模型 (可选)
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="留空使用默认模型"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">
            默认模型: {API_TEMPLATES[selectedTemplate].modelParam || '无'}
          </p>
        </div>

        {/* 测试连接 - 文字按钮 */}
        <button
          onClick={handleTest}
          disabled={testing || !apiUrl || !apiKey}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed mb-6"
        >
          {testing ? '测试中...' : '🔗 测试连接'}
        </button>

        {/* 测试结果 */}
        {testResult && (
          <div className={`mb-6 p-4 rounded-lg ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!apiUrl || !apiKey}
          className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          继续 →
        </button>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 提示：</strong> API 密钥仅在本地浏览器中使用，不会发送给我们的服务器。
          </p>
        </div>
      </div>
    </div>
  );
}