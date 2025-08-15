import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateGallery } from "@/components/template-gallery"
import { CreateTemplateDialog } from "@/components/create-template-dialog"
import { Button } from "@/components/ui/button"
import { Plus, FileIcon as FileTemplate } from "lucide-react"

export default async function TemplatesPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileTemplate className="h-8 w-8" />
            Meeting Templates
          </h1>
          <p className="text-muted-foreground mt-2">
            Use pre-built templates or create custom ones to structure your meeting summaries
          </p>
        </div>
        <CreateTemplateDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </CreateTemplateDialog>
      </div>

      <TemplateGallery userId={user.id} />
    </div>
  )
}
