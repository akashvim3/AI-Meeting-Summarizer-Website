"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { User, Brain, Bell, Shield, Download, Trash2, Save, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserPreferences {
  default_summary_format: "short" | "medium" | "detailed"
  auto_transcribe: boolean
  auto_summarize: boolean
  email_notifications: boolean
  processing_notifications: boolean
  default_template_id: string | null
  language_preference: string
  export_format: "pdf" | "docx" | "markdown"
  theme_preference: "light" | "dark" | "system"
}

interface SettingsInterfaceProps {
  user: any
  profile: any
}

export function SettingsInterface({ user, profile }: SettingsInterfaceProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    email: user?.email || "",
    avatar_url: profile?.avatar_url || "",
  })
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_summary_format: "medium",
    auto_transcribe: true,
    auto_summarize: true,
    email_notifications: true,
    processing_notifications: true,
    default_template_id: null,
    language_preference: "en",
    export_format: "pdf",
    theme_preference: "system",
  })
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    fetchUserPreferences()
    fetchTemplates()
  }, [])

  async function fetchUserPreferences() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setPreferences(data)
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
    }
  }

  async function fetchTemplates() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("meeting_templates").select("id, name").eq("user_id", user.id)

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  async function updateProfile() {
    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profileData.full_name,
        email: profileData.email,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function updatePreferences() {
    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function exportSettings() {
    const settingsData = {
      profile: profileData,
      preferences: preferences,
      exported_at: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `meeting-summarizer-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Settings exported",
      description: "Your settings have been downloaded as a JSON file.",
    })
  }

  async function deleteAccount() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Delete user data (cascading deletes will handle related records)
      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) throw error

      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      })

      // Sign out and redirect
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">AI Settings</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Privacy</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and profile settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
              <Input
                id="avatar_url"
                value={profileData.avatar_url}
                onChange={(e) => setProfileData((prev) => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <Button onClick={updateProfile} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Processing Settings</CardTitle>
            <CardDescription>Configure how AI processes your meetings and generates summaries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="summary_format">Default Summary Format</Label>
                <Select
                  value={preferences.default_summary_format}
                  onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, default_summary_format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short - Quick overview</SelectItem>
                    <SelectItem value="medium">Medium - Balanced detail</SelectItem>
                    <SelectItem value="detailed">Detailed - Comprehensive analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language Preference</Label>
                <Select
                  value={preferences.language_preference}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, language_preference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="default_template">Default Template</Label>
                <Select
                  value={preferences.default_template_id || "none"}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      default_template_id: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default template</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="export_format">Default Export Format</Label>
                <Select
                  value={preferences.export_format}
                  onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, export_format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Automation Settings</h4>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_transcribe">Auto-transcribe audio/video files</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically transcribe uploaded audio and video files
                  </p>
                </div>
                <Switch
                  id="auto_transcribe"
                  checked={preferences.auto_transcribe}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, auto_transcribe: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_summarize">Auto-generate summaries</Label>
                  <p className="text-sm text-muted-foreground">Automatically create AI summaries after transcription</p>
                </div>
                <Switch
                  id="auto_summarize"
                  checked={preferences.auto_summarize}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, auto_summarize: checked }))}
                />
              </div>
            </div>

            <Button onClick={updatePreferences} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save AI Settings"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how and when you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your meetings and summaries
                  </p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, email_notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="processing_notifications">Processing Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when transcription and summarization are complete
                  </p>
                </div>
                <Switch
                  id="processing_notifications"
                  checked={preferences.processing_notifications}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, processing_notifications: checked }))
                  }
                />
              </div>
            </div>

            <Button onClick={updatePreferences} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Notification Settings"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Data Export</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your settings and preferences as a backup file
                </p>
                <Button variant="outline" onClick={exportSettings}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Data Retention</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Your meeting data is stored securely and can be deleted at any time. Transcripts and summaries are
                  processed using OpenAI's API with data retention policies.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Encrypted Storage</Badge>
                  <Badge variant="secondary">GDPR Compliant</Badge>
                  <Badge variant="secondary">User Controlled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Manage your account settings and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone.</p>

                <div className="border border-red-200 rounded-lg p-4 space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Delete Account</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data including meetings, transcripts,
                      summaries, and templates.
                    </p>

                    {!showDeleteConfirm ? (
                      <Button variant="destructive" onClick={deleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-red-600">
                          Are you absolutely sure? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="destructive" onClick={deleteAccount} disabled={loading}>
                            {loading ? "Deleting..." : "Yes, Delete My Account"}
                          </Button>
                          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
