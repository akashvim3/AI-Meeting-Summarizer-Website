"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { format, formatDistanceToNow } from "date-fns"
import { Search, CalendarIcon, FileText, Clock, Eye, Download, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  file_name: string
  file_type: string
  transcript_content?: string
  summary_overview?: string
  summary_key_points?: any[]
  match_type: "title" | "transcript" | "summary"
  match_snippet?: string
}

interface SearchFilters {
  query: string
  status: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
  fileType: string
}

interface SearchInterfaceProps {
  userId: string
}

export function SearchInterface({ userId }: SearchInterfaceProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
    fileType: "all",
  })

  const resultsPerPage = 10

  useEffect(() => {
    if (
      filters.query.trim() ||
      filters.status !== "all" ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.fileType !== "all"
    ) {
      performSearch()
    } else {
      loadRecentMeetings()
    }
  }, [filters, currentPage])

  async function performSearch() {
    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase
        .from("meetings")
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          file_name,
          file_type,
          transcripts(content),
          summaries(overview, key_points)
        `)
        .eq("user_id", userId)

      // Apply filters
      if (filters.status !== "all") {
        query = query.eq("status", filters.status)
      }

      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom.toISOString())
      }

      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo.toISOString())
      }

      if (filters.fileType !== "all") {
        if (filters.fileType === "audio") {
          query = query.or("file_type.ilike.%audio%,file_type.ilike.%mp3%,file_type.ilike.%wav%,file_type.ilike.%m4a%")
        } else if (filters.fileType === "video") {
          query = query.or("file_type.ilike.%video%,file_type.ilike.%mp4%")
        } else if (filters.fileType === "text") {
          query = query.or("file_type.ilike.%text%,file_type.ilike.%docx%,file_type.ilike.%srt%")
        }
      }

      // Apply text search
      if (filters.query.trim()) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)

      if (error) throw error

      // Process results to include match information
      const processedResults: SearchResult[] = (data || []).map((meeting) => {
        let matchType: "title" | "transcript" | "summary" = "title"
        let matchSnippet = ""

        if (filters.query.trim()) {
          const query = filters.query.toLowerCase()

          if (meeting.title.toLowerCase().includes(query)) {
            matchType = "title"
            matchSnippet = meeting.title
          } else if (meeting.transcripts?.[0]?.content?.toLowerCase().includes(query)) {
            matchType = "transcript"
            const content = meeting.transcripts[0].content
            const index = content.toLowerCase().indexOf(query)
            matchSnippet = content.substring(Math.max(0, index - 50), index + 100) + "..."
          } else if (meeting.summaries?.[0]?.overview?.toLowerCase().includes(query)) {
            matchType = "summary"
            matchSnippet = meeting.summaries[0].overview
          }
        }

        return {
          id: meeting.id,
          title: meeting.title,
          description: meeting.description,
          status: meeting.status,
          created_at: meeting.created_at,
          file_name: meeting.file_name,
          file_type: meeting.file_type,
          transcript_content: meeting.transcripts?.[0]?.content,
          summary_overview: meeting.summaries?.[0]?.overview,
          summary_key_points: meeting.summaries?.[0]?.key_points,
          match_type: matchType,
          match_snippet: matchSnippet,
        }
      })

      setResults(processedResults)
      setTotalResults(count || 0)
    } catch (error) {
      console.error("Error searching meetings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadRecentMeetings() {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data, error, count } = await supabase
        .from("meetings")
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          file_name,
          file_type,
          transcripts(content),
          summaries(overview, key_points)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)

      if (error) throw error

      const processedResults: SearchResult[] = (data || []).map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        status: meeting.status,
        created_at: meeting.created_at,
        file_name: meeting.file_name,
        file_type: meeting.file_type,
        transcript_content: meeting.transcripts?.[0]?.content,
        summary_overview: meeting.summaries?.[0]?.overview,
        summary_key_points: meeting.summaries?.[0]?.key_points,
        match_type: "title",
        match_snippet: "",
      }))

      setResults(processedResults)
      setTotalResults(count || 0)
    } catch (error) {
      console.error("Error loading meetings:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
      fileType: "all",
    })
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "title":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "transcript":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "summary":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const totalPages = Math.ceil(totalResults / resultsPerPage)

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Meetings
          </CardTitle>
          <CardDescription>Search through your meeting titles, transcripts, and summaries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings, transcripts, or summaries..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button onClick={() => performSearch()} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">File Type</label>
              <Select
                value={filters.fileType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, fileType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters((prev) => ({ ...prev, dateFrom: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters((prev) => ({ ...prev, dateTo: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.query ||
            filters.status !== "all" ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.fileType !== "all") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.query && (
                <Badge variant="secondary" className="gap-1">
                  Query: "{filters.query}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
                  />
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, status: "all" }))}
                  />
                </Badge>
              )}
              {filters.fileType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filters.fileType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, fileType: "all" }))}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filters.query ? `Search Results (${totalResults})` : `Recent Meetings (${totalResults})`}
          </h2>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{filters.query ? "No results found" : "No meetings yet"}</h3>
              <p className="text-muted-foreground">
                {filters.query
                  ? "Try adjusting your search terms or filters"
                  : "Upload your first meeting to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{result.title}</h3>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                        {filters.query && result.match_snippet && (
                          <Badge className={getMatchTypeColor(result.match_type)}>Match in {result.match_type}</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
                        </div>
                        {result.file_name && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{result.file_name}</span>
                          </div>
                        )}
                      </div>

                      {result.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.description}</p>
                      )}

                      {filters.query && result.match_snippet && (
                        <div className="bg-muted/50 rounded p-3 mb-3">
                          <p className="text-sm">
                            <span className="font-medium">Match found in {result.match_type}:</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 italic">"{result.match_snippet}"</p>
                        </div>
                      )}

                      {result.summary_overview && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-3 mb-3">
                          <p className="text-sm font-medium mb-1">Summary:</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{result.summary_overview}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                if (pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
