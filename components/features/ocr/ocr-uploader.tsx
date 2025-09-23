"use client"

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { extractText } from '@/lib/ocr/tesseract'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'

export default function OcrUploader({ changeOrderId }: { changeOrderId: string }) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<number>(0)
  const [text, setText] = React.useState<string>("")
  const [uploading, setUploading] = React.useState(false)
  const onDrop = React.useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false })

  async function runOcr() {
    if (!file) return
    const text = await extractText(file, (p) => setProgress(p))
    setText(text)
  }

  async function saveToChangeOrder() {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, `change-orders/${changeOrderId}`)
      const fd = new FormData()
      fd.set('image_url', url)
      fd.set('ocr_text', text)
      await (async (formData: FormData) => { 'use server'; const { saveOcrResultAction } = await import('@/app/(app)/change-orders/ocr-actions'); await saveOcrResultAction(changeOrderId, formData) })(fd)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div {...getRootProps()} className="cursor-pointer rounded border border-dashed p-6 text-center">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop an image, or click to select</p>}
      </div>
      {preview && (
        <div className="flex gap-4">
          <img src={preview} alt="preview" className="h-32 w-32 rounded object-cover" />
          <div className="flex-1">
            <div className="h-2 w-full rounded bg-foreground/10">
              <div className="h-2 rounded bg-foreground" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" onClick={runOcr}>Run OCR</Button>
              <Button type="button" onClick={saveToChangeOrder} disabled={!text || uploading}>{uploading ? 'Saving...' : 'Save to Change Order'}</Button>
            </div>
          </div>
        </div>
      )}
      {text && (
        <div>
          <div className="mb-1 text-sm font-medium">Extracted Text</div>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border p-2 text-xs">{text}</pre>
        </div>
      )}
    </div>
  )
}

