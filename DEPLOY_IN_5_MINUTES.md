# 🚀 5 分钟快速部署

## 最简单的方式：GitHub + Vercel

```
┌─────────────────────────────────────────────┐
│  现在你已经有了完整的 Git 仓库             │
│  (D:\resume-showcase)                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  第 1 步：创建 GitHub 仓库（2 分钟）        │
│  访问 github.com → New Repository           │
│  名称: resume-showcase                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  第 2 步：推送代码（1 分钟）                │
│  运行提供的 Git 命令                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  第 3 步：连接 Vercel（1 分钟）             │
│  访问 vercel.com → Import Repository        │
│  选择 resume-showcase                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  第 4 步：设置环境变量（1 分钟）            │
│  添加 ANTHROPIC_API_KEY                     │
└─────────────────────────────────────────────┘
                    ↓
🎉 你的网站上线了！
   https://resume-showcase-xxxxx.vercel.app
```

---

## 📋 4 个简单步骤

### 1️⃣ 创建 GitHub 仓库

```
访问: https://github.com/new

填写:
- Repository name: resume-showcase
- Description: AI-Powered Resume Parser
- Public: 选中
- Create repository
```

### 2️⃣ 推送代码到 GitHub

复制下面的命令，替换 `YOUR_USERNAME`，在终端运行：

```bash
cd D:\resume-showcase

git remote add origin https://github.com/YOUR_USERNAME/resume-showcase.git
git branch -M main
git push -u origin main
```

**替换 `YOUR_USERNAME` 为你的 GitHub 用户名**

### 3️⃣ 部署到 Vercel

```
访问: https://vercel.com

登录 → Sign Up with GitHub → Authorize

点击: New Project

选择: resume-showcase 仓库

点击: Import
```

### 4️⃣ 设置环境变量

在 Vercel 配置页面：

1. 找到 **Environment Variables**
2. 添加新变量：
   ```
   Key: ANTHROPIC_API_KEY
   Value: sk-ant-v1-your_actual_key_here
   ```
3. 点击 **Deploy**

---

## 🔑 获取 Claude API 密钥

如果你还没有 Claude API 密钥：

1. 访问 [https://console.anthropic.com](https://console.anthropic.com)
2. 注册或登录
3. 点击 **Create Key**
4. 复制密钥（看起来像 `sk-ant-v1-xxxxx...`）

**保管好这个密钥！** 不要分享给任何人。

---

## ✅ 部署完成检查

一旦部署完成，你会看到：

```
✓ Build completed
✓ Deployment successful
✓ Your URL: https://resume-showcase-xxxxx.vercel.app
```

### 测试你的网站

1. 访问你的 Vercel URL
2. 上传一个 PDF 简历
3. 等待 AI 解析（10-15 秒）
4. 查看你的在线简历！
5. 点击 "Share" 获取分享链接

---

## 🎯 现在就开始！

### 你需要：
1. GitHub 账户 (如果没有就创建一个：github.com/signup)
2. Vercel 账户 (用 GitHub 账户直接登录)
3. Claude API 密钥 (console.anthropic.com)

### 耗时：
- ⏱️ 大约 5-10 分钟

### 结果：
- 🌍 一个可以全球访问的网站
- 🚀 自动部署和更新
- 🔒 免费 HTTPS
- ⚡ CDN 加速

---

## 💡 常见问题

**Q: 需要信用卡吗？**
A: 不需要。Vercel 免费层完全足够这个项目。

**Q: 网站速度快吗？**
A: 是的！Vercel 使用全球 CDN，访问速度很快。

**Q: 可以自定义域名吗？**
A: 可以的，稍后可以在 Vercel 仪表板添加。

**Q: 数据会保留吗？**
A: 当前是临时存储。如果需要永久存储，可以迁移到数据库。

**Q: 如何更新网站？**
A: 只需要推送代码到 GitHub，Vercel 会自动重新部署。

```bash
git add .
git commit -m "Fix: update resume display"
git push origin main
# Vercel 自动部署！
```

---

## 🎉 就这么简单！

不需要：
- ❌ 不需要配置服务器
- ❌ 不需要管理数据库
- ❌ 不需要担心扩展性
- ❌ 不需要支付服务器费用

只需要：
- ✅ GitHub 账户
- ✅ 5 分钟时间
- ✅ 你的 Claude API 密钥

**立即开始部署你的网站吧！** 🚀
