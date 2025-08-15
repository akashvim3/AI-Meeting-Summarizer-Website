"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  Users,
  Target,
  MessageSquare,
  Briefcase,
  Coffee,
  TrendingUp,
  CheckCircle,
  Star,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { FileTemplate } from "@/components/FileTemplate" // Declare FileTemplate here

interface Template {
  id: string
  name: string
  description: string
  category: string
  questions: string[]
  is_default: boolean
  created_at: string
}

interface TemplateGalleryProps {
  userId: string
}

const defaultTemplates = [
  {
    id: "standup",
    name: "Daily Standup",
    description: "Perfect for daily team check-ins and progress updates",
    category: "Team",
    icon: Users,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    questions: [
      "What did you accomplish yesterday?",
      "What are you working on today?",
      "Are there any blockers or challenges?",
      "Do you need help from anyone?",
    ],
    is_default: true,
  },
  {
    id: "retrospective",
    name: "Sprint Retrospective",
    description: "Reflect on what went well and areas for improvement",
    category: "Agile",
    icon: TrendingUp,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    questions: [
      "What went well during this sprint?",
      "What could be improved?",
      "What will we commit to improve in the next sprint?",
      "Any action items or follow-ups?",
    ],
    is_default: true,
  },
  {
    id: "client-meeting",
    name: "Client Meeting",
    description: "Structure client discussions and capture requirements",
    category: "Business",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    questions: [
      "What are the main objectives for this project?",
      "What are the key requirements and constraints?",
      "What is the timeline and budget?",
      "Who are the key stakeholders?",
      "What are the next steps?",
    ],
    is_default: true,
  },
  {
    id: "one-on-one",
    name: "One-on-One",
    description: "Personal development and feedback sessions",
    category: "HR",
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    questions: [
      "How are you feeling about your current workload?",
      "What challenges are you facing?",
      "What support do you need from me?",
      "Any career development goals to discuss?",
      "Feedback on recent projects or performance?",
    ],
    is_default: true,
  },
  {
    id: "planning",
    name: "Project Planning",
    description: "Plan project milestones and deliverables",
    category: "Project",
    icon: Target,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    questions: [
      "What are the project goals and success criteria?",
      "What are the key milestones and deadlines?",
      "What resources and team members are needed?",
      "What are the potential risks and mitigation strategies?",
      "How will we track progress and communicate updates?",
    ],
    is_default: true,
  },
  {
    id: "brainstorm",
    name: "Brainstorming Session",
    description: "Creative ideation and problem-solving meetings",
    category: "Creative",
    icon: Coffee,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    questions: [
      "What problem are we trying to solve?",
      "What ideas were generated?",
      "Which ideas show the most promise?",
      "What are the next steps for validation?",
      "Who will own each action item?",
    ],
    is_default: true,
  },
]

export function TemplateGallery({ userId }: TemplateGalleryProps) {
  const [customTemplates, setCustomTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomTemplates()
  }, [userId])

  async function fetchCustomTemplates() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("meeting_templates")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCustomTemplates(data || [])
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteTemplate(templateId: string) {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("meeting_templates").delete().eq("id", templateId).eq("user_id", userId)

      if (error) throw error
      setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId))
    } catch (error) {
      console.error("Error deleting template:", error)
    }
  }

  async function duplicateTemplate(template: any) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("meeting_templates")
        .insert({
          user_id: userId,
          name: `${template.name} (Copy)`,
          description: template.description,
          category: template.category,
          questions: template.questions,
          is_default: false,
        })
        .select()
        .single()

      if (error) throw error
      setCustomTemplates((prev) => [data, ...prev])
    } catch (error) {
      console.error("Error duplicating template:", error)
    }
  }

  const allTemplates = [
    ...defaultTemplates.map((t) => ({ ...t, created_at: new Date().toISOString() })),
    ...customTemplates,
  ]

  const categories = Array.from(new Set(allTemplates.map((t) => t.category)))

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {category} Templates
            <Badge variant="secondary">{allTemplates.filter((t) => t.category === category).length}</Badge>
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allTemplates
              .filter((template) => template.category === category)
              .map((template) => {
                const IconComponent = template.is_default
                  ? defaultTemplates.find((dt) => dt.id === template.id)?.icon || FileTemplate
                  : FileTemplate

                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              template.is_default
                                ? defaultTemplates.find((dt) => dt.id === template.id)?.color ||
                                  "bg-gray-100 text-gray-800"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {template.name}
                              {template.is_default && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            </CardTitle>
                          </div>
                        </div>

                        {!template.is_default && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteTemplate(template.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Key Questions ({template.questions.length})
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {template.questions.slice(0, 3).map((question, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              <span className="line-clamp-1">{question}</span>
                            </li>
                          ))}
                          {template.questions.length > 3 && (
                            <li className="text-xs italic">+{template.questions.length - 3} more questions...</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" size="sm">
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      ))}

      {allTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-4">Create your first custom template to get started.</p>
        </div>
      )}
    </div>
  )
}
