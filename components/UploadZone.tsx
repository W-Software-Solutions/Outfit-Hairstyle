import { useCallback, useState } from 'react'

export default function UploadZone({ onFile }: { onFile: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }, [onFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`rounded-3xl border-2 border-dashed ${dragOver ? 'border-aqua bg-white/5' : 'border-navy-800 bg-card-gradient'} p-8 text-center shadow-soft transition-colors`}
      aria-label="Drag and drop image"
    >
      <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-aqua to-coral opacity-90 mb-3 animate-float"/>
      <p className="text-soft-gray">Drag & drop an outfit photo here, or click to select</p>
      <input
        type="file"
        accept="image/*"
        className="mt-3 block w-full text-soft-gray file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-aqua file:text-navy-900 hover:file:brightness-105"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
    </div>
  )
}
