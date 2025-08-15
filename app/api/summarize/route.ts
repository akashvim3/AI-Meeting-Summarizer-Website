import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { transcript, format = "medium" } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    const systemPrompt = getSystemPrompt(format)

    console.log(`Generating ${format} summary for transcript of ${transcript.length} characters`)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please analyze and summarize the following meeting transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.3,
      max_tokens: getMaxTokens(format),
    })

    const summaryText = completion.choices[0]?.message?.content

    if (!summaryText) {
      throw new Error("No summary generated")
    }

    // Parse the structured summary
    const parsedSummary = parseSummaryResponse(summaryText)

    return NextResponse.json({
      success: true,
      summary: parsedSummary,
      format,
      usage: completion.usage,
    })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json({ error: "Failed to generate summary. Please try again." }, { status: 500 })
  }
}

function getSystemPrompt(format: string): string {
  const basePrompt = `You are an AI meeting summarizer. Your task is to analyze meeting transcripts and create structured, professional summaries that are easy to scan and actionable.

IMPORTANT: Always respond with a structured format using the following sections:

## Meeting Overview
[2-3 sentence summary of the meeting's purpose and main outcomes]

## Key Discussion Points
[Bullet points of major topics discussed]

## Decisions Made
[Clear list of agreements, conclusions, or resolutions]

## Action Items
[List with responsible person and due date if mentioned, format: "- Task description (Assigned to: Person, Due: Date)"]

## Questions Raised
[Any unresolved issues or questions that need follow-up]

## Important Quotes
[Key statements or critical information worth highlighting]

Guidelines:
- Preserve important names, dates, numbers, and specific details
- Use clear, professional language
- Focus on actionable information
- Maintain chronological flow when relevant`

  switch (format) {
    case "short":
      return (
        basePrompt +
        `\n\nFor this SHORT format:
- Keep each section concise (2-3 items max)
- Focus only on the most critical information
- Prioritize decisions and action items`
      )

    case "detailed":
      return (
        basePrompt +
        `\n\nFor this DETAILED format:
- Include comprehensive coverage of all topics
- Provide context and background for decisions
- Include relevant quotes and specific examples
- Add timestamps when available in the transcript`
      )

    default: // medium
      return (
        basePrompt +
        `\n\nFor this MEDIUM format:
- Balance comprehensiveness with readability
- Include all major points without excessive detail
- Focus on practical outcomes and next steps`
      )
  }
}

function getMaxTokens(format: string): number {
  switch (format) {
    case "short":
      return 800
    case "detailed":
      return 2000
    default: // medium
      return 1200
  }
}

function parseSummaryResponse(summaryText: string) {
  const sections = {
    overview: "",
    keyPoints: [] as string[],
    decisions: [] as string[],
    actionItems: [] as string[],
    questions: [] as string[],
    quotes: [] as string[],
  }

  const lines = summaryText.split("\n")
  let currentSection = ""

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith("## Meeting Overview")) {
      currentSection = "overview"
      continue
    } else if (trimmedLine.startsWith("## Key Discussion Points")) {
      currentSection = "keyPoints"
      continue
    } else if (trimmedLine.startsWith("## Decisions Made")) {
      currentSection = "decisions"
      continue
    } else if (trimmedLine.startsWith("## Action Items")) {
      currentSection = "actionItems"
      continue
    } else if (trimmedLine.startsWith("## Questions Raised")) {
      currentSection = "questions"
      continue
    } else if (trimmedLine.startsWith("## Important Quotes")) {
      currentSection = "quotes"
      continue
    }

    if (trimmedLine && !trimmedLine.startsWith("#")) {
      switch (currentSection) {
        case "overview":
          sections.overview += (sections.overview ? " " : "") + trimmedLine
          break
        case "keyPoints":
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.keyPoints.push(trimmedLine.substring(1).trim())
          }
          break
        case "decisions":
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.decisions.push(trimmedLine.substring(1).trim())
          }
          break
        case "actionItems":
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.actionItems.push(trimmedLine.substring(1).trim())
          }
          break
        case "questions":
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.questions.push(trimmedLine.substring(1).trim())
          }
          break
        case "quotes":
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.quotes.push(trimmedLine.substring(1).trim())
          }
          break
      }
    }
  }

  return sections
}
