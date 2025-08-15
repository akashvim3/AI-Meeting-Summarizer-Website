"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Settings, Zap, Search } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks to help you get started quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent" asChild>
            <Link href="#upload">
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Upload Meeting</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent" asChild>
            <Link href="/templates">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">Use Template</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent" asChild>
            <Link href="/search">
              <Search className="h-6 w-6" />
              <span className="text-sm font-medium">Search History</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent" asChild>
            <Link href="/settings">
              <Settings className="h-6 w-6" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
