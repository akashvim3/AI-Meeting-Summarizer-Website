"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Mic, Video, X, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { SummaryDisplay } from "./summary-display"

interface UploadedFile {
  file: File
  id: string
  type: "transcript" | "audio" | "video"
}

interface TranscriptionResult {
  transcript: string
  originalText?: string
  duration?: number
  language?: string
  wordCount?: number
}

interface SummaryResult {
  summary: {
    overview: string
    keyPoints: string[]
    decisions: string[]
    actionItems: string[]
    questions: string[]
    quotes: string[]
  }
  format: string
}

export function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [textInput, setTextInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      type: getFileType(file),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setError(null)
  }, [])

  const getFileType = (file: File): "transcript" | "audio" | "video" => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (["txt", "docx", "srt"].includes(extension || "")) {
      return "transcript"
    } else if (["mp3", "wav", "m4a", "aac"].includes(extension || "")) {
      return "audio"
    } else if (["mp4", "mov", "avi", "mkv"].includes(extension || "")) {
      return "video"
    }

    return "transcript"
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/x-subrip": [".srt"],
      "audio/*": [".mp3", ".wav", ".m4a", ".aac"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple: true,
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 && !textInput.trim()) {
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setTranscriptionResult(null)

    try {
      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0]
        const formData = new FormData()
        formData.append("file", file.file)

        setProgress(25)

        let response
        if (file.type === "transcript") {
          response = await fetch("/api/process-text", {
            method: "POST",
            body: formData,
          })
        } else {
          response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          })
        }

        setProgress(75)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Processing failed")
        }

        const data = await response.json()
        setTranscriptionResult(data)
        setProgress(100)
      } else if (textInput.trim()) {
        const formData = new FormData()
        formData.append("text", textInput)

        setProgress(50)

        const response = await fetch("/api/process-text", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Processing failed")
        }

        const data = await response.json()
        setTranscriptionResult(data)
        setProgress(100)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setProgress(0)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSummarize = async (format = "medium") => {
    if (!transcriptionResult?.transcript) return

    setIsSummarizing(true)
    setError(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcriptionResult.transcript,
          format,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Summarization failed")
      }

      const data = await response.json()
      setSummaryResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary")
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleFormatChange = (newFormat: string) => {
    handleSummarize(newFormat)
  }

  const resetForm = () => {
    setUploadedFiles([])
    setTextInput("")
    setTranscriptionResult(null)
    setSummaryResult(null)
    setError(null)
    setProgress(0)
  }

  if (summaryResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={resetForm}>
            ← Process Another File
          </Button>
        </div>

        <SummaryDisplay
          summary={summaryResult.summary}
          format={summaryResult.format}
          onFormatChange={handleFormatChange}
          onRegenerate={() => handleSummarize(summaryResult.format)}
          isRegenerating={isSummarizing}
        />
      </div>
    )
  }

  if (transcriptionResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Transcription Complete</h3>
          <Button variant="outline" onClick={resetForm}>
            Process Another File
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              {transcriptionResult.duration && <span>Duration: {Math.round(transcriptionResult.duration)}s</span>}
              {transcriptionResult.language && <span>Language: {transcriptionResult.language}</span>}
              {transcriptionResult.wordCount && <span>Words: {transcriptionResult.wordCount}</span>}
            </div>

            <div>
              <h4 className="font-medium mb-2">Transcript:</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{transcriptionResult.transcript}</pre>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="px-8" onClick={() => handleSummarize()} disabled={isSummarizing}>
                {isSummarizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Summary
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11">
          <TabsTrigger value="upload" className="text-sm">
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="paste" className="text-sm">
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center cursor-pointer transition-all duration-300",
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50",
            )}
          >
            <input {...getInputProps()} />
            <div className={cn("transition-all duration-300", isDragActive ? "scale-110" : "")}>
              <Upload className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-4 sm:mb-6 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg sm:text-xl font-medium text-blue-600 dark:text-blue-400">
                  Drop the files here...
                </p>
              ) : (
                <div>
                  <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                    Supports multiple file formats
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      .txt
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      .mp3
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                      .mp4
                    </span>
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                      .wav
                    </span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                      .srt
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm sm:text-base">Uploaded Files ({uploadedFiles.length})</h3>
              {uploadedFiles.map((uploadedFile) => (
                <Card key={uploadedFile.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      {getFileIcon(uploadedFile.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{uploadedFile.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(uploadedFile.file.size)} • {uploadedFile.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Paste your meeting transcript</label>
            <Textarea
              placeholder="Paste your meeting transcript here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={8}
              className="resize-none text-sm"
            />
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="p-3 sm:p-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {(uploadedFiles.length > 0 || textInput.trim()) && !isProcessing && (
        <div className="flex justify-center">
          <Button onClick={handleProcess} size="lg" className="px-6 sm:px-8 text-sm sm:text-base">
            <CheckCircle className="h-4 w-4 mr-2" />
            {uploadedFiles.some((f) => f.type !== "transcript") ? "Transcribe & Process" : "Process Text"}
          </Button>
        </div>
      )}
    </div>
  )
}
