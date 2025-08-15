"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, FileText, File, FileImage, Loader2 } from "lucide-react"

interface ExportMenuProps {
  summary: any
  format: string
}

export function ExportMenu({ summary, format }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Document",
      icon: <FileImage className="h-4 w-4" />,
      description: "Professional PDF format",
    },
    {
      id: "markdown",
      name: "Markdown",
      icon: <FileText className="h-4 w-4" />,
      description: "GitHub-compatible markdown",
    },
    { id: "docx", name: "Word Document", icon: <File className="h-4 w-4" />, description: "Microsoft Word format" },
    { id: "txt", name: "Plain Text", icon: <FileText className="h-4 w-4" />, description: "Simple text file" },
  ]

  const handleExportClick = (exportFormat: string) => {
    setSelectedFormat(exportFormat)
    setMeetingTitle(`Meeting Summary - ${new Date().toLocaleDateString()}`)
    setShowTitleDialog(true)
  }

  const handleExport = async () => {
    if (!meetingTitle.trim()) return

    setIsExporting(true)
    setShowTitleDialog(false)

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          format,
          exportFormat: selectedFormat,
          meetingTitle: meetingTitle.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get("content-disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `meeting-summary.${selectedFormat}`

      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      // You could add a toast notification here
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {exportFormats.map((exportFormat) => (
            <DropdownMenuItem
              key={exportFormat.id}
              onClick={() => handleExportClick(exportFormat.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {exportFormat.icon}
                <div>
                  <div className="font-medium">{exportFormat.name}</div>
                  <div className="text-xs text-gray-500">{exportFormat.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Meeting Summary</DialogTitle>
            <DialogDescription>
              Choose a title for your exported meeting summary. This will be used as the filename and document title.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="mt-1"
              />
            </div>
            <div className="text-sm text-gray-500">
              Exporting as: {exportFormats.find((f) => f.id === selectedFormat)?.name}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTitleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={!meetingTitle.trim()}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
