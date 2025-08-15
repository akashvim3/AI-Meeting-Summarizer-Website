"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, CheckCircle2, Users, HelpCircle, Quote, RefreshCw } from "lucide-react"
import { ExportMenu } from "./export-menu"

interface SummaryData {
  overview: string
  keyPoints: string[]
  decisions: string[]
  actionItems: string[]
  questions: string[]
  quotes: string[]
}

interface SummaryDisplayProps {
  summary: SummaryData
  format: string
  onFormatChange: (format: string) => void
  onRegenerate: () => void
  isRegenerating?: boolean
}

export function SummaryDisplay({
  summary,
  format,
  onFormatChange,
  onRegenerate,
  isRegenerating = false,
}: SummaryDisplayProps) {
  const sections = [
    {
      title: "Meeting Overview",
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.overview,
      type: "text" as const,
    },
    {
      title: "Key Discussion Points",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.keyPoints,
      type: "list" as const,
    },
    {
      title: "Decisions Made",
      icon: <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.decisions,
      type: "list" as const,
    },
    {
      title: "Action Items",
      icon: <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.actionItems,
      type: "action" as const,
    },
    {
      title: "Questions Raised",
      icon: <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.questions,
      type: "list" as const,
    },
    {
      title: "Important Quotes",
      icon: <Quote className="h-4 w-4 sm:h-5 sm:w-5" />,
      content: summary.quotes,
      type: "quote" as const,
    },
  ]

  const parseActionItem = (item: string) => {
    const assignedMatch = item.match(/$$Assigned to: ([^,)]+)(?:, Due: ([^)]+))?$$/)
    if (assignedMatch) {
      const task = item.replace(assignedMatch[0], "").trim()
      return {
        task,
        assignee: assignedMatch[1],
        dueDate: assignedMatch[2] || null,
      }
    }
    return { task: item, assignee: null, dueDate: null }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h2 className="text-xl sm:text-2xl font-bold">Meeting Summary</h2>
          <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
            {format} Format
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={format} onValueChange={onFormatChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="w-full sm:w-auto bg-transparent"
          >
            {isRegenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <span className="sm:inline">Regenerate</span>
          </Button>

          <ExportMenu summary={summary} format={format} />
        </div>
      </div>

      {/* Summary Sections */}
      <div className="grid gap-4 sm:gap-6">
        {sections.map((section, index) => {
          if (section.type === "text" && section.content) {
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    {section.icon}
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            )
          }

          if (section.type === "list" && Array.isArray(section.content) && section.content.length > 0) {
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    {section.icon}
                    <span className="truncate">{section.title}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {section.content.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2 sm:space-x-3">
                        <span className="text-blue-500 mt-1 sm:mt-1.5 text-sm sm:text-base flex-shrink-0">•</span>
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          }

          if (section.type === "action" && Array.isArray(section.content) && section.content.length > 0) {
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    {section.icon}
                    <span className="truncate">{section.title}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {section.content.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-3 sm:space-y-4">
                    {section.content.map((item, itemIndex) => {
                      const parsed = parseActionItem(item)
                      return (
                        <div key={itemIndex} className="border rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-gray-800">
                          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-2 leading-relaxed">
                            {parsed.task}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {parsed.assignee && (
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{parsed.assignee}</span>
                              </span>
                            )}
                            {parsed.dueDate && (
                              <span className="flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>Due: {parsed.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          }

          if (section.type === "quote" && Array.isArray(section.content) && section.content.length > 0) {
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    {section.icon}
                    <span className="truncate">{section.title}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {section.content.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-3 sm:space-y-4">
                    {section.content.map((quote, itemIndex) => (
                      <blockquote
                        key={itemIndex}
                        className="border-l-4 border-blue-500 pl-3 sm:pl-4 italic text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
