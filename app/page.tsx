import { FileUpload } from "@/components/file-upload"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Brain, Download, Zap, Shield, Clock, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Meeting Summarizer</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Powered by OpenAI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="#features"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/signup"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </a>
              </nav>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Beta
                </Badge>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>AI-Powered Meeting Analysis</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
              Transform Meeting Chaos into
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block sm:inline">
                {" "}
                Clear Insights
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mb-6 sm:mb-8">
              Upload your meeting transcripts or audio recordings to get intelligent summaries with key points, action
              items, and decisions. Powered by OpenAI Whisper and GPT-4o.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
              <a
                href="/signup"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Get Started Free
              </a>
              <button className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Main Upload Card */}
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <span>Upload Your Meeting Content</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base px-2">
                Support for transcripts (.txt, .docx, .srt) and audio/video files (.mp3, .mp4, .wav, .m4a)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <FileUpload />
            </CardContent>
          </Card>

          {/* Features Grid */}
          <section id="features" className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features for Better Meetings
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to transform your meeting recordings into actionable insights
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="text-center px-4 sm:px-6">
                  <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Smart Transcription</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Powered by OpenAI Whisper for accurate speech-to-text conversion with automatic speaker
                    identification and timestamps.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="text-center px-4 sm:px-6">
                  <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">AI Summarization</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    GPT-4o generates structured summaries with key points, decisions, action items, and important
                    quotes.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <CardHeader className="text-center px-4 sm:px-6">
                  <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Download className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Download as PDF, Word, or Markdown. Export action items to your favorite project management tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200 text-base sm:text-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Save Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-sm sm:text-base text-orange-700 dark:text-orange-300">
                  Turn hours of meeting recordings into actionable summaries in minutes. Focus on what matters most.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Secure & Private</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-sm sm:text-base text-green-700 dark:text-green-300">
                  Your meeting data is processed securely and can be automatically deleted after processing.
                </p>
              </CardContent>
            </Card>
          </div>

          <section id="pricing" className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the plan that works best for your team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="text-center px-6 py-8">
                  <CardTitle className="text-xl mb-2">Free</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for trying out</p>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>5 meetings per month
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Basic AI summaries
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      PDF export
                    </li>
                  </ul>
                  <button className="w-full mt-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                    Get Started
                  </button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
                <CardHeader className="text-center px-6 py-8">
                  <CardTitle className="text-xl mb-2">Pro</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$19</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">per month</p>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Unlimited meetings
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Advanced AI summaries
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      All export formats
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Priority support
                    </li>
                  </ul>
                  <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                    Start Free Trial
                  </button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="text-center px-6 py-8">
                  <CardTitle className="text-xl mb-2">Enterprise</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Custom</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">For large teams</p>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Everything in Pro
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      Dedicated support
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                      SLA guarantee
                    </li>
                  </ul>
                  <button className="w-full mt-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                    Contact Sales
                  </button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Teams Worldwide
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how teams are transforming their meeting workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      SM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">Sarah Mitchell</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Product Manager</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "This tool has revolutionized how we handle meeting follow-ups. Action items are never missed
                    anymore!"
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      JD
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">John Davis</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Engineering Lead</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "The AI summaries are incredibly accurate. It saves us hours every week on meeting documentation."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      AL
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">Anna Lopez</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Operations Director</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Perfect for remote teams. Everyone stays aligned with clear, structured meeting summaries."
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-12 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg">AI Meeting Summarizer</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Transform your meetings into actionable insights with AI-powered transcription and summarization. Built
                with cutting-edge technology for modern teams.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Powered by OpenAI Whisper & GPT-4o</span>
                <span>•</span>
                <span>Built with Next.js & Tailwind CSS</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                © 2025 AI Meeting Summarizer. All rights reserved.
                <span className="block md:inline md:ml-2">
                  Developed with ❤️ by <span className="font-medium text-gray-700 dark:text-gray-300">Akash</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
