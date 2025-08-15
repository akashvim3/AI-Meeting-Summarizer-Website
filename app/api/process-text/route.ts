import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const textContent = formData.get("text") as string

    let processedText = ""

    if (file) {
      // Handle different text file formats
      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      if (fileExtension === "txt" || fileExtension === "srt") {
        processedText = await file.text()
      } else if (fileExtension === "docx") {
        // For DOCX files, we'd need a library like mammoth
        // For now, return an error asking user to convert to txt
        return NextResponse.json(
          { error: "DOCX files not yet supported. Please convert to .txt format." },
          { status: 400 },
        )
      }
    } else if (textContent) {
      processedText = textContent
    } else {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 })
    }

    // Clean up the text (remove extra whitespace, normalize line breaks)
    const cleanedText = processedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    return NextResponse.json({
      success: true,
      transcript: cleanedText,
      wordCount: cleanedText.split(/\s+/).length,
    })
  } catch (error) {
    console.error("Text processing error:", error)
    return NextResponse.json({ error: "Failed to process text file. Please try again." }, { status: 500 })
  }
}
