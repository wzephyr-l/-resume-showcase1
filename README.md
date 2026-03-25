# Resume Showcase - AI-Powered Resume Parser

Transform your PDF resume into a beautiful online portfolio instantly with AI-powered parsing.

## Features

- ✨ **AI-Powered Parsing**: Uses Claude API to intelligently extract and structure resume data
- 🔗 **Shareable Links**: Get unique URLs for your online resume
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Multiple Themes**: Choose from modern and classic resume templates
- ⚡ **Lightning Fast**: Results in seconds, no sign up required
- 🔒 **Privacy Focused**: Auto-expires after 30 days

## Prerequisites

- Node.js 18+ and npm/yarn
- Claude API key (get it from [console.anthropic.com](https://console.anthropic.com))

## Setup Instructions

### 1. Get Claude API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Create an API key in the settings
4. Copy the key

### 2. Configure Environment Variables

Update `.env.local` with your API key:

```bash
ANTHROPIC_API_KEY=sk-ant-v1-your_actual_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_PATH=./data/resumes.db
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
resume-showcase/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Upload page
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── api/
│   │   │   ├── upload/route.ts   # File upload endpoint
│   │   │   ├── parse/route.ts    # PDF parsing endpoint
│   │   │   └── resume/[id]/route.ts  # Resume data endpoint
│   │   └── resume/[id]/page.tsx  # Resume display page
│   ├── lib/
│   │   ├── claude-client.ts      # Claude API wrapper
│   │   ├── pdf-parser.ts         # PDF text extraction
│   │   ├── db.ts                 # Database operations
│   │   └── resume-schema.ts      # TypeScript interfaces
│   └── components/
│       ├── UploadZone.tsx        # File upload component
│       └── ResumeDisplay.tsx     # Resume display component
├── public/
│   └── uploads/                   # Temporary PDF storage
├── data/
│   └── resumes.db                # SQLite database
└── [config files]
```

## How It Works

1. **Upload**: User drags or clicks to upload a PDF resume
2. **Extract**: PDF text is extracted using pdf-parse
3. **Parse**: Claude API analyzes the text and extracts structured data
4. **Store**: Resume data is saved to SQLite database
5. **Display**: Beautiful resume page is generated with shareable link

## Technical Stack

- **Frontend**: React 19 + Next.js 15 + Tailwind CSS
- **Backend**: Next.js API Routes
- **PDF Processing**: pdf-parse
- **AI Engine**: Claude API (Opus 4.6)
- **Database**: SQLite (better-sqlite3)
- **Deployment**: Vercel (recommended)

## API Endpoints

### POST `/api/upload`
Upload a PDF file

Request:
```json
Form Data: { file: File }
```

Response:
```json
{
  "success": true,
  "resumeId": "uuid",
  "fileName": "resume.pdf"
}
```

### POST `/api/parse`
Parse uploaded resume with Claude API

Request:
```json
{
  "resumeId": "uuid",
  "fileName": "resume.pdf"
}
```

Response:
```json
{
  "success": true,
  "resumeId": "uuid",
  "resume": { ... },
  "confidence": 0.95
}
```

### GET `/api/resume/[id]`
Fetch parsed resume data

Response:
```json
{
  "success": true,
  "resume": { ... }
}
```

## Cost Estimation

- **Per Resume**: ~$0.001-0.003 (depends on resume length)
- **100 Resumes**: ~$0.10-0.30
- **1000 Resumes**: ~$1.00-3.00

Check [Claude Pricing](https://www.anthropic.com/pricing) for latest rates.

## Deployment to Vercel

### With Git

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

Then connect your repository to Vercel at [vercel.com](https://vercel.com)

### Environment Variables on Vercel

In Vercel project settings, add:
- `ANTHROPIC_API_KEY`: Your Claude API key
- `NEXT_PUBLIC_APP_URL`: Your production URL

## Troubleshooting

### Issue: "Claude API key not found"
- Make sure `.env.local` has the correct `ANTHROPIC_API_KEY`
- Verify the key format starts with `sk-ant-v1-`

### Issue: "PDF parsing failed"
- Check that the PDF is readable and not corrupted
- Try with a different PDF file
- Maximum file size is 5MB

### Issue: "Database locked"
- Wait a few seconds and try again
- Check if multiple instances are running on same database

## Development

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
npm start
```

### View database
```bash
# Using sqlite CLI
sqlite3 ./data/resumes.db

# Query resumes
SELECT id, uploadedAt FROM resumes;
```

## Contributing

This is a personal project. Feel free to fork and customize!

## Future Enhancements

- [ ] User accounts and resume management
- [ ] Multiple resume uploads per user
- [ ] Resume editing interface
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Custom domain support

## License

MIT License - feel free to use for personal and commercial projects

## Support

Having issues? Check the troubleshooting section or create an issue in the repository.

---

Built with ❤️ using Claude API
