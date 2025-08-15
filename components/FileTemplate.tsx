import { FileText } from "lucide-react"

interface FileTemplateProps {
  className?: string
  size?: number
}

export const FileTemplate = ({ className = "", size = 24 }: FileTemplateProps) => {
  return <FileText className={`text-blue-500 ${className}`} size={size} />
}

export default FileTemplate
