'use client'

import { useState, useRef, useMemo } from 'react'
import MarkdownIt from 'markdown-it'
import styles from './page.module.css'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import UploadZone from '../components/UploadZone'
import ResultCard from '../components/ResultCard'
import Footer from '../components/Footer'
import HairstyleResult from '../components/HairstyleResult'

export default function HomePage() {
  const [imageUrl, setImageUrl] = useState('')
  const [prompt, setPrompt] = useState('Describe the image')
  const [html, setHtml] = useState('')
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'outfit' | 'hairstyle'>('outfit')
  const [filePreview, setFilePreview] = useState<string>('')
  const [previewError, setPreviewError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const md = new MarkdownIt()
  const previewSrc = useMemo(() => {
    if (filePreview) return filePreview
    if (imageUrl) return `/api/image?url=${encodeURIComponent(imageUrl)}`
    return ''
  }, [filePreview, imageUrl])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setHtml('Generating...')
  setRaw('')

    try {
  const payload: any = { prompt, mode }
      if (filePreview) {
        // filePreview is a data URL; split to get base64 and mime
        const [header, b64] = filePreview.split(',')
        const mimeMatch = /data:(.*);base64/.exec(header || '')
        payload.image = { data: b64, mimeType: mimeMatch?.[1] || 'image/jpeg' }
      } else {
        payload.imageUrl = imageUrl
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed: ${res.status}`)
      }
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buf = ''
    if (!reader) {
        setHtml('No stream received')
      } else {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          setHtml(md.render(buf))
      setRaw(buf)
        }
      }
    } catch (err: any) {
      setHtml(`<p style=\"color:#f88\">${String(err)}</p>`)  
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) {
      setFilePreview('')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFilePreview(String(reader.result || ''))
    reader.readAsDataURL(f)
  }

  return (
    <>
      <Header />
      <Hero />
      <main id="tools">
      <h1 className="font-heading text-white text-2xl mb-3">Styling Assistant</h1>
      <div className="mb-4 inline-flex rounded-2xl border border-navy-800 overflow-hidden">
        <button type="button" aria-pressed={mode==='outfit'} onClick={() => setMode('outfit')} className={`px-4 py-2 ${mode==='outfit' ? 'bg-aqua text-navy-900 font-semibold' : 'text-soft-gray hover:bg-white/5'}`}>Outfit Rater</button>
  <button type="button" aria-pressed={mode==='hairstyle'} onClick={() => setMode('hairstyle')} className={`px-4 py-2 ${mode==='hairstyle' ? 'bg-aqua text-navy-900 font-semibold' : 'text-soft-gray hover:bg-white/5'}`}>Hairstyle Matcher</button>
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <UploadZone onFile={(file) => {
          const reader = new FileReader();
          reader.onload = () => setFilePreview(String(reader.result || ''))
          reader.readAsDataURL(file)
        }} />
        <div className={styles.or}>or paste a URL</div>
        <label>
          Image URL
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required={!filePreview} placeholder="https://example.com/image.jpg" />
        </label>
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Image preview"
            className={styles.preview}
            onLoad={() => setPreviewError('')}
            onError={() => setPreviewError('Could not load image. Try a different URL or upload a file.')}
          />
        )}
        {previewError && <div className={styles.error}>{previewError}</div>}
        <label>
          Prompt
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate'}</button>
      </form>
       <div className="mt-6 grid gap-4">
         {mode === 'hairstyle'
           ? (!!raw && !loading ? <HairstyleResult text={raw} /> : null)
           : <ResultCard title="Your Style Analysis" html={html} show={!!html && !loading} />}
       </div>
      </main>
      <Features />
      <Testimonials />
      <Footer />
    </>
  )
}
