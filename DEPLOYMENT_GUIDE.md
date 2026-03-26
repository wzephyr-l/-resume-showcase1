# 🌍 部署到 Vercel - 完整指南

## 方法 1：使用 GitHub + Vercel（推荐，最简单）

### 步骤 1：创建 GitHub 仓库

1. 访问 [GitHub.com](https://github.com)
2. 登录或注册账户
3. 点击右上角 **+** → **New repository**
4. 填写信息：
   - **Repository name**: `resume-showcase`
   - **Description**: AI-Powered Resume Parser
   - **Public**: 选中（让别人能看到你的项目）
5. 点击 **Create repository**

### 步骤 2：推送代码到 GitHub

在你的终端运行（Windows 命令行）：

```bash
cd D:\resume-showcase

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/resume-showcase.git

# 重命名主分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

**替换 `YOUR_USERNAME` 为你的 GitHub 用户名**

### 步骤 3：部署到 Vercel

1. 访问 [Vercel.com](https://vercel.com)
2. 点击 **Sign Up**，选择 **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub 账户
4. 点击 **New Project**
5. 在 "Import Git Repository" 中找到 `resume-showcase` 仓库
6. 点击 **Import**

#### 配置环境变量

在部署前，需要设置 Claude API 密钥：

1. 在项目配置页面，找到 **Environment Variables**
2. 添加以下变量：

```
ANTHROPIC_API_KEY = sk-ant-v1-your_actual_key_here
NEXT_PUBLIC_APP_URL = (Vercel 会自动填充)
```

3. 点击 **Deploy**

### 步骤 4：等待部署完成

Vercel 会自动：
- 构建你的项目
- 运行测试
- 部署到全球 CDN

完成后你会看到一个 URL：
```
https://resume-showcase-xxxxx.vercel.app
```

🎉 **你的网站现在在线了！**

---

## 方法 2：使用 Vercel CLI（快速）

如果你想更快速地部署：

```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 在项目目录运行
cd D:\resume-showcase
vercel

# 跟随提示完成部署
```

---

## ⚙️ Vercel 部署配置

### 自动识别

Vercel 会自动识别这是一个 Next.js 项目，并配置：
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`
- ✅ Node.js version: 20 LTS

### 环境变量检查清单

部署前确保设置了：
- [ ] `ANTHROPIC_API_KEY` - Claude API 密钥
- [ ] `.env.local.example` 中的所有变量都已配置

### 文件存储注意事项

由于 Vercel 是无状态的，文件存储有以下注意事项：

**当前配置：** JSON 文件存储在 `/data/resumes/`

**生产环境的改进：**

选项 A - 使用 Vercel KV (推荐简单的 MVP)
```bash
# 在 Vercel 仪表板添加 KV 数据库
# 然后更新 src/lib/db.ts 使用 KV
```

选项 B - 使用 Vercel Postgres (推荐生产)
```bash
# 在 Vercel 仪表板添加 PostgreSQL
# 迁移到 Prisma ORM
```

选项 C - 使用外部云存储 (AWS S3、Google Cloud)
```bash
# 更新文件上传逻辑指向云存储
```

**现在的问题：**
Vercel 的文件系统是临时的，每次重新部署后会被清除。这对测试没问题，但生产需要数据库。

---

## 🚀 部署后的步骤

### 1. 获取你的网站 URL

部署完成后，你会得到一个 URL：
```
https://resume-showcase-xxxxx.vercel.app
```

### 2. 分享你的网站

- 分享给朋友
- 加入你的作品集
- 发布到社交媒体

### 3. 设置自定义域名（可选）

在 Vercel 仪表板：
1. 项目设置 → Domains
2. 添加你的自定义域名
3. 更新 DNS 配置

### 4. 监控和维护

- 查看部署日志
- 监控错误
- 查看分析数据

---

## 🐛 部署问题排查

### 问题 1：构建失败

**症状：** 部署时显示 "Build failed"

**解决方案：**
1. 检查构建日志（Vercel 仪表板会显示）
2. 确保 `.env.local` 中有所有必需的环境变量
3. 运行本地构建检查：`npm run build`

### 问题 2：API 错误

**症状：** 上传时显示 "API key not found"

**解决方案：**
1. 在 Vercel 仪表板验证 `ANTHROPIC_API_KEY` 已设置
2. 确保密钥格式正确（`sk-ant-v1-...`）
3. 重新部署：点击 Vercel 仪表板的 "Redeploy"

### 问题 3：文件上传失败

**症状：** PDF 上传失败

**解决方案：**
1. 检查文件大小 < 5MB
2. 确保是有效的 PDF 文件
3. 检查 Vercel 日志

---

## 📊 Vercel 免费额度

| 功能 | 免费额度 | 说明 |
|------|---------|------|
| 部署 | 无限 | 可以随时部署 |
| 带宽 | 100GB/月 | 足够中等流量 |
| 函数执行 | 100万次/月 | API 调用限制 |
| 构建时间 | 6000分钟/月 | 足够频繁部署 |
| 存储 | 不适用 | 需要使用外部服务 |

---

## 🔒 安全最佳实践

### 1. 隐藏敏感信息

✅ **已做：**
- `.env.local` 在 `.gitignore` 中
- API 密钥不会被提交

✅ **需要做：**
- 不要在代码中硬编码密钥
- 定期轮换 API 密钥

### 2. 数据隐私

**当前：** 数据保存在 Vercel 临时文件系统（会被清除）

**生产建议：**
- 使用数据库存储
- 实现数据加密
- 设置过期策略

### 3. API 速率限制

考虑添加：
```typescript
// 添加速率限制中间件
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制100个请求
});
```

---

## 📈 下一步优化

### 短期（部署后 1-2 周）
- [ ] 收集用户反馈
- [ ] 修复任何 bugs
- [ ] 优化上传体验

### 中期（1-3 个月）
- [ ] 迁移到数据库存储
- [ ] 实现用户账户
- [ ] 添加更多主题模板

### 长期（3+ 个月）
- [ ] 移动应用
- [ ] 高级功能
- [ ] 考虑商业化

---

## 💡 部署后如何使用

### 分享简历

1. 访问你的网站：`https://resume-showcase-xxxxx.vercel.app`
2. 上传 PDF 简历
3. 等待 AI 解析（10-15秒）
4. 点击 "Share" 获取链接
5. 分享链接给雇主/HR

### 测试上传

使用示例简历文本创建 PDF：
```
John Doe
john@example.com | 123-456-7890

EXPERIENCE
Senior Developer - Tech Company (2020-2024)
- Led team, improved performance 40%

SKILLS
JavaScript, Python, React, Node.js

EDUCATION
BS Computer Science (2020)
```

---

## 🎯 最终检查清单

部署前确认：
- [ ] 项目代码已提交到 Git
- [ ] 已推送到 GitHub
- [ ] Vercel 连接到 GitHub 仓库
- [ ] 环境变量已设置（ANTHROPIC_API_KEY）
- [ ] 本地构建成功（`npm run build`）
- [ ] 部署完成，获得了 Vercel URL

部署后：
- [ ] 可以访问网站
- [ ] 可以上传 PDF
- [ ] AI 解析工作
- [ ] 可以分享链接

---

## 📞 获取帮助

遇到问题？
1. 检查 Vercel 部署日志
2. 查看 `.next/logs` 日志文件
3. 验证环境变量设置
4. 尝试本地运行 `npm run dev` 复现问题

---

## 🎉 完成！

一旦部署成功，你就有了一个可以：
- ✅ 全球访问的网站
- ✅ 自动扩展的服务
- ✅ 免费的 HTTPS
- ✅ CDN 加速
- ✅ 自动备份

**恭喜！你的简历解析平台现在在线了！** 🚀
