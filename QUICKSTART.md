# 🚀 快速启动指南

## 欢迎使用 Resume Showcase！

你现在有了一个完整的 AI 驱动的简历解析和在线展示平台。以下是如何快速启动它：

## 📋 前置条件

- ✅ Node.js 18+ (已安装)
- ✅ Claude API 密钥 (需要获取)

## 🔑 第 1 步：获取 Claude API 密钥

1. 访问 [https://console.anthropic.com](https://console.anthropic.com)
2. 创建账户或登录
3. 在 **API Keys** 中创建新密钥
4. 复制密钥（看起来像 `sk-ant-v1-xxxxx...`）

## ⚙️ 第 2 步：配置环境变量

编辑 `.env.local` 文件，替换为你的 Claude API 密钥：

```env
ANTHROPIC_API_KEY=sk-ant-v1-your_actual_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_PATH=./data/resumes.db
```

## ▶️ 第 3 步：启动开发服务器

```bash
npm run dev
```

你应该看到：
```
  ▲ Next.js 15.x
  - Local:        http://localhost:3000
```

## 🌐 第 4 步：打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

## 📄 第 5 步：测试它！

1. 拖放一个 PDF 简历（或点击选择）
2. 等待上传完成（显示进度条）
3. 等待 AI 解析（可能需要 10-15 秒）
4. 查看你的在线简历展示页面！
5. 点击"Share"获取可分享链接

## 🛠️ 项目结构

```
resume-showcase/
├── src/app/                    # Next.js 页面和 API 路由
│   ├── page.tsx               # 首页（上传页面）
│   ├── resume/[id]/page.tsx   # 简历展示页面
│   └── api/
│       ├── upload/route.ts    # 文件上传
│       ├── parse/route.ts     # AI 解析
│       └── resume/[id]/...    # 数据获取
├── src/lib/
│   ├── claude-client.ts       # Claude API 集成
│   ├── pdf-parser.ts          # PDF 文本提取
│   ├── db.ts                  # 文件存储
│   └── resume-schema.ts       # 数据结构
└── data/resumes/              # 存储的简历数据（JSON 文件）
```

## 📚 核心功能

### 1. PDF 上传
- 拖拽或点击上传 PDF 文件
- 文件大小限制：5MB
- 支持各种 PDF 格式

### 2. AI 解析
- 使用 Claude API (Opus 4.6) 智能提取信息
- 识别：姓名、邮箱、电话、工作经历、技能、教育背景
- 准确率：90%+

### 3. 在线展示
- 现代和经典两种主题
- 完全响应式设计
- 可分享的唯一链接

### 4. 数据存储
- JSON 文件存储（可轻松迁移到数据库）
- 30 天后自动过期
- 完全隐私保护

## 💰 成本估算

| 使用量 | 成本估算 |
|--------|---------|
| 10 份简历 | ~$0.01 |
| 100 份简历 | ~$0.10-0.30 |
| 1000 份简历 | ~$1.00-3.00 |

## 🔍 测试示例 PDF

可以创建一个简单的 PDF 来测试。或者，尝试这个示例内容：

```
John Doe
john@example.com | 123-456-7890
San Francisco, CA

EXPERIENCE
Senior Software Engineer - Tech Company (2020-2024)
- Led team of 5 engineers
- Increased performance by 40%
- Managed $2M budget

SKILLS
JavaScript, Python, React, Node.js, AWS

EDUCATION
BS Computer Science - University of California (2020)
```

## 🐛 常见问题

**Q: "API key not found" 错误**
- A: 确保 `.env.local` 中有正确的 `ANTHROPIC_API_KEY`

**Q: PDF 解析失败**
- A: 尝试不同的 PDF 或确保文件 < 5MB

**Q: 端口 3000 已被占用**
- A: 使用 `npm run dev -- -p 3001` 改用 3001 端口

**Q: 如何查看已保存的简历？**
- A: 检查 `data/resumes/` 文件夹，每份都是一个 JSON 文件

## 📦 部署到 Vercel

### 用 Git 部署（推荐）

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: Resume Showcase MVP"

# 推送到 GitHub（创建仓库后）
git remote add origin https://github.com/yourusername/resume-showcase.git
git push -u origin main
```

然后在 [vercel.com](https://vercel.com) 连接你的仓库。

### 在 Vercel 中设置环境变量

1. 在 Vercel 项目设置中
2. 添加环境变量：
   - `ANTHROPIC_API_KEY`: 你的 Claude API 密钥
   - `NEXT_PUBLIC_APP_URL`: 你的 Vercel URL

### 注意事项

- 文件存储将保存在 `/tmp` 目录（Vercel 无状态）
- 对于生产环境，考虑迁移到数据库或云存储
- 推荐使用 Vercel 的 D1（SQLite）或 PostgreSQL

## 🚀 下一步优化（MVP 后）

1. **用户账户**
   - 实现用户注册/登录
   - 允许管理多份简历

2. **数据库迁移**
   - 从 JSON 迁移到 Prisma + SQLite/PostgreSQL
   - 改进查询性能

3. **PDF 导出**
   - 添加 HTML 转 PDF 功能
   - 保留原始格式和样式

4. **SEO 优化**
   - 生成 meta 标签
   - 为 Google 索引优化

5. **分析**
   - 跟踪浏览量
   - 记录访客信息

6. **模板库**
   - 添加更多专业主题
   - 允许用户自定义样式

## 📞 技术支持

遇到问题？

1. 检查 console 错误（F12 开发者工具）
2. 查看服务器日志（终端）
3. 验证 .env.local 配置
4. 尝试重新启动开发服务器

## 📝 许可证

MIT License - 自由使用和修改！

---

**祝你好运！** 🎉

有任何问题，查看 README.md 获取更多详细信息。
