# AI Meeting Notes Summarizer

A comprehensive web-based tool that transforms meeting recordings and transcripts into actionable insights using AI-powered transcription and summarization.

## 🌐 Live Demo

**[Try the Live Demo →](https://ai-meeting-summarizer.vercel.app)**

Experience the full functionality of the AI Meeting Notes Summarizer:
- Upload sample meeting files or paste transcript text
- See AI transcription and summarization in action
- Test export functionality across multiple formats
- Explore the responsive design on any device

*Demo account available - no signup required for testing basic features*

## 🚀 Features

### Core Functionality
- **Multi-format File Upload**: Support for .txt, .docx, .srt transcript files and audio/video files (.mp3, .mp4, .wav, .m4a)
- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper API with speaker identification
- **Intelligent Summarization**: GPT-4o powered summaries with structured output including:
  - Meeting Overview
  - Key Discussion Points
  - Decisions Made
  - Action Items with responsible parties
  - Questions Raised
  - Important Quotes with timestamps

### Export & Integration
- **Multiple Export Formats**: PDF, Word/RTF, Markdown, and Plain Text
- **Customizable Summaries**: Short, medium, and detailed summary formats
- **Professional Formatting**: Clean, structured documents ready for sharing

### User Experience
- **Responsive Design**: Optimized for mobile phones, tablets, desktops, and laptops
- **Dark/Light Mode**: Theme toggle for user preference
- **Real-time Progress**: Live updates during transcription and summarization
- **Drag & Drop Interface**: Intuitive file upload experience

### Security & Authentication
- **Supabase Authentication**: Secure user registration and login
- **Row Level Security**: Database policies ensuring users only access their own data
- **Privacy First**: Secure file processing with optional auto-deletion

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Server-side functionality
- **Supabase**: Database and authentication
- **PostgreSQL**: Relational database with RLS

### AI Integration
- **OpenAI Whisper API**: Speech-to-text transcription
- **OpenAI GPT-4o**: Intelligent summarization
- **AI SDK**: Streamlined AI model integration

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd ai-meeting-summarizer
npm install
\`\`\`

### 2. Environment Setup
Create a `.env.local` file with the following variables:

\`\`\`env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

### 3. Database Setup
Run the SQL script to create the necessary tables:

\`\`\`sql
-- Execute in your Supabase SQL editor
-- See scripts/01_create_tables.sql for the complete schema
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 📊 Database Schema

### Tables
- **profiles**: User profile information
- **meetings**: Meeting metadata and file information
- **transcripts**: Transcription results with speaker data
- **summaries**: AI-generated summaries with structured content

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic profile creation on user registration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Core Features
- `POST /api/transcribe` - Audio/video transcription
- `POST /api/process-text` - Text file processing
- `POST /api/summarize` - AI summarization
- `POST /api/export` - Document export

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## 🎨 Design System

### Colors
- Primary: Blue gradient (blue-600 to indigo-600)
- Neutrals: Gray scale with dark mode support
- Accents: Green for success, Red for errors

### Typography
- Headings: Space Grotesk (bold weights)
- Body: DM Sans (regular and medium)
- Responsive scaling across all devices

## 🔒 Security Features

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security policies
- **Data Protection**: Encrypted data transmission
- **Privacy**: Optional file auto-deletion
- **Validation**: Input sanitization and validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading
- **Bundle Analysis**: Webpack bundle analyzer

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 📚 Usage Guide

### 1. Sign Up & Login
- Create an account with email and password
- Choose your plan (Free, Pro, or Enterprise)
- Verify your email address

### 2. Upload Files
- Drag and drop files or click to browse
- Supported formats: .txt, .docx, .srt, .mp3, .mp4, .wav, .m4a
- Or paste transcript text directly

### 3. AI Processing
- Automatic transcription for audio/video files
- Speaker identification and timestamps
- AI-powered summarization with structured output

### 4. Review & Export
- Review generated summaries
- Choose summary format (short, medium, detailed)
- Export to PDF, Word, Markdown, or Plain Text

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Akash** - Full Stack Developer

## 🆘 Support

For support, email support@aimeetingsummarizer.com or create an issue in the GitHub repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added export functionality and responsive design
- **v1.2.0** - Enhanced authentication and database integration

---

© 2025 AI Meeting Summarizer. Developed by Akash. All rights reserved.
