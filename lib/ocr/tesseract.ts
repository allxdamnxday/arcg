import Tesseract from 'tesseract.js'

export async function extractText(file: File, onProgress?: (p: number) => void, lang: string = 'eng') {
  const { data } = await Tesseract.recognize(file, lang, {
    logger: (m) => {
      if (m.status === 'recognizing text' && m.progress != null) onProgress?.(m.progress)
    },
  })
  return data.text
}

