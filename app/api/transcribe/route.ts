import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if file is audio/video
    const fileType = file.type
    const isAudioVideo = fileType.startsWith("audio/") || fileType.startsWith("video/")

    if (!isAudioVideo) {
      return NextResponse.json({ error: "File must be audio or video format" }, { status: 400 })
    }

    // Check file size (Whisper API has a 25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 25MB" }, { status: 400 })
    }

    console.log(`Transcribing file: ${file.name}, size: ${file.size} bytes`)

    // Convert File to the format expected by OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    })

    // Process the transcription to add speaker identification
    const processedTranscript = processTranscriptWithSpeakers(transcription)

    return NextResponse.json({
      success: true,
      transcript: processedTranscript,
      originalText: transcription.text,
      duration: transcription.duration,
      language: transcription.language,
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio. Please try again." }, { status: 500 })
  }
}

function processTranscriptWithSpeakers(transcription: any) {
  if (!transcription.segments) {
    return transcription.text
  }

  let currentSpeaker = 1
  let lastSpeakerChange = 0
  let processedText = ""

  transcription.segments.forEach((segment: any, index: number) => {
    // Simple speaker detection based on pauses (this is a basic implementation)
    // In a real app, you might want to use more sophisticated speaker diarization
    const timeDiff = segment.start - lastSpeakerChange

    if (timeDiff > 3.0 && index > 0) {
      // 3 second pause indicates potential speaker change
      currentSpeaker = currentSpeaker === 1 ? 2 : 1
      lastSpeakerChange = segment.start
    }

    const timestamp = formatTimestamp(segment.start)
    processedText += `\n\n[${timestamp}] Speaker ${currentSpeaker}: ${segment.text}`
  })

  return processedText.trim()
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
