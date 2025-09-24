'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { extractText } from '@/lib/ocr/tesseract'
import { uploadImage } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function OcrUploader({ changeOrderId }: { changeOrderId: string }) {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<number>(0)
  const [text, setText] = React.useState<string>('')
  const [uploading, setUploading] = React.useState(false)
  const [status, setStatus] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const onDrop = React.useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  async function runOcr() {
    if (!file) return
    setError(null)
    setStatus(null)
    setProgress(0)
    try {
      const extracted = await extractText(file, (p) => setProgress(p))
      setText(extracted)
      setStatus('OCR extraction complete')
    } catch (err) {
      console.error(err)
      setError('Failed to extract text from image')
    }
  }

  async function saveToChangeOrder() {
    if (!file) return
    setUploading(true)
    setError(null)
    setStatus(null)
    try {
      const url = await uploadImage(file, `change-orders/${changeOrderId}`)
      const { error } = await supabase
        .from('change_orders')
        .update({ original_image_url: url, ocr_text: text })
        .eq('id', changeOrderId)
      if (error) throw error
      setStatus('OCR saved to change order')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Unable to save OCR result')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div
        {...getRootProps()}
        className="cursor-pointer rounded border border-dashed p-6 text-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image, or click to select</p>
        )}
      </div>
      {preview && (
        <div className="flex gap-4">
          <Image
            src={preview}
            alt="preview"
            width={128}
            height={128}
            className="h-32 w-32 rounded object-cover"
          />
          <div className="flex-1">
            <div className="h-2 w-full rounded bg-foreground/10">
              <div
                className="h-2 rounded bg-foreground"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" onClick={runOcr}>
                Run OCR
              </Button>
              <Button type="button" onClick={saveToChangeOrder} disabled={!text || uploading}>
                {uploading ? 'Saving...' : 'Save to Change Order'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {text && (
        <div>
          <div className="mb-1 text-sm font-medium">Extracted Text</div>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border p-2 text-xs">
            {text}
          </pre>
        </div>
      )}
      {status ? <div className="text-sm text-green-600">{status}</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
    </div>
  )
}
