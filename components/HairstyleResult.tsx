"use client"
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

type Parsed = {
  title: string
  rating: number | null
  ratingLabel: string
  pros: string[]
  cons: string[]
  styles: { name: string; reason?: string; imageUrl?: string; keywords?: string[] }[]
}

function parse(text: string): Parsed {
  const safe = text || ''
  const lines = safe.split(/\r?\n/)
  const title = lines.find(l => /^#{1,3}\s+/.test(l))?.replace(/^#{1,3}\s+/, '').trim()
    || 'Your Hairstyle Analysis'

  let rating: number | null = null
  let ratingLabel = '—/10'
  const m = safe.match(/Hair\s*Rating:\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*10/i)
  if (m) {
    const v = parseFloat(m[1]); if (!Number.isNaN(v)) { rating = Math.min(10, Math.max(0, v)); ratingLabel = `${v}/10` }
  }

  const section = (name: string) => {
    const re = new RegExp(`${name}\\s*:?\\s*[\\r\\n]+([\\s\\S]*?)(?=\\n#+\\s|\\n{2,}[A-Z].*?:|$)`, 'i')
    return safe.match(re)?.[1]?.trim() ?? ''
  }

  const toList = (block: string): string[] => {
    const items = block.split(/\r?\n/).map(l => l.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean)
    if (items.length <= 1 && block) {
      return block.split(/[•·–—\-]\s+|(?<=\.)\s+(?=[A-Z])/).map(x => x.trim()).filter(Boolean)
    }
    return items
  }

  const pros = toList(section('What Works') || section('Pros'))
  const cons = toList(section('Improvements') || section('Cons'))
  const stylesBlock = section('Suggested Styles') || section('Hairstyle Suggestions')
  const styles: Parsed['styles'] = []
  for (const raw of stylesBlock.split(/\r?\n/).map(x => x.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean)) {
    let line = raw
    // Extract [img: URL]
    let imageUrl: string | undefined
    const imgMatch = line.match(/\[img:\s*([^\]]+)\]/i)
    if (imgMatch) {
      imageUrl = imgMatch[1].trim()
      line = line.replace(imgMatch[0], '').trim()
    }
    // Extract (keywords: ... ) or [keywords: ...]
    let keywords: string[] | undefined
    const kwMatch = line.match(/(?:\(|\[)?keywords:\s*([^\)\]]+)(?:\)|\])?/i)
    if (kwMatch) {
      keywords = kwMatch[1].split(/,|\|/).map(s => s.trim()).filter(Boolean)
      line = line.replace(kwMatch[0], '').trim()
    }
    const mm = line.match(/^([^—\-:]+)\s*[—\-:]\s*(.+)$/)
    if (mm) styles.push({ name: mm[1].trim(), reason: mm[2].trim(), imageUrl, keywords })
    else styles.push({ name: line, imageUrl, keywords })
  }

  return { title, rating, ratingLabel, pros, cons, styles }
}

const variants = {
  parent: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.3 } } },
  item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
}

const Card: React.FC<React.PropsWithChildren<{ title?: string; icon?: string; className?: string }>> = ({ title, icon, className, children }) => (
  <motion.section variants={variants.item} className={`rounded-2xl border border-navy-800 bg-white/10 backdrop-blur-md shadow-soft p-5 sm:p-6 ${className || ''}`}>
    {title && (
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-lg" aria-hidden>{icon}</span>}
        <h3 className="text-white font-semibold text-lg leading-tight">{title}</h3>
      </div>
    )}
    {children}
  </motion.section>
)

const Rating: React.FC<{ rating: number | null; label: string }> = ({ rating, label }) => {
  const pct = Math.max(0, Math.min(100, (rating ?? 0) * 10))
  return (
    <motion.section variants={variants.item} className="rounded-2xl p-5 sm:p-6 shadow-soft bg-gradient-to-r from-aqua to-coral text-navy-900">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Hair Rating</h3>
        <div className="text-base font-semibold">{label}</div>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-black/10 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={10} aria-valuenow={rating ?? 0}>
        <div className="h-full bg-navy-900/80 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-navy-900/80">Score reflects harmony with face shape, texture, and styling.</p>
    </motion.section>
  )
}

const Bullet: React.FC<React.PropsWithChildren> = ({ children }) => (
  <li className="pl-1 text-[#EAEAFF] leading-relaxed">{children}</li>
)

function buildPreviewUrl(s: { name: string; imageUrl?: string; keywords?: string[] }) {
  if (s.imageUrl) return s.imageUrl
  const label = encodeURIComponent((s.keywords?.join(' ') || s.name || 'hairstyle').slice(0, 40))
  // Fallback placeholder with style name/keywords
  return `https://placehold.co/480x320/png?text=${label}`
}

export default function HairstyleResult({ text }: { text: string }) {
  const data = useMemo(() => parse(text), [text])
  return (
    <motion.div variants={variants.parent} initial="hidden" animate="show" className="w-full space-y-4 sm:space-y-5">
      <motion.div variants={variants.item} className="flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-aqua shadow-[0_0_18px_#64FFDA]" aria-hidden />
        <h2 className="font-heading text-white text-xl sm:text-2xl leading-tight">{data.title}</h2>
      </motion.div>

      <Rating rating={data.rating} label={data.ratingLabel} />

      <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
        <Card title="What Works" icon="✅">
          {data.pros.length ? (
            <ul className="grid gap-2 list-none">{data.pros.map((p, i) => <Bullet key={`p-${i}`}>{p}</Bullet>)}</ul>
          ) : (
            <p className="text-soft-gray">No highlights extracted.</p>
          )}
        </Card>
        <Card title="Improvements" icon="⚠️">
          {data.cons.length ? (
            <ul className="grid gap-2 list-none">{data.cons.map((c, i) => <Bullet key={`c-${i}`}>{c}</Bullet>)}</ul>
          ) : (
            <p className="text-soft-gray">No improvements extracted.</p>
          )}
        </Card>
      </div>

      <Card title="Suggested Styles" icon="✂️">
        {data.styles.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {data.styles.map((s, i) => (
              <motion.div
                key={`s-${i}`}
                variants={variants.item}
                className="min-w-[240px] sm:min-w-[260px] snap-start rounded-2xl border border-navy-800 bg-white/7 backdrop-blur-md shadow-soft hover:shadow-[0_12px_44px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02]"
              >
                <div className="p-3">
                  <div className="relative w-full overflow-hidden rounded-xl border border-navy-800 bg-white/10">
                    {/* Preview image or placeholder */}
                    <img
                      src={buildPreviewUrl(s)}
                      alt={`${s.name} preview`}
                      className="h-36 w-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = buildPreviewUrl({ name: s.name }) }}
                    />
                  </div>
                  <div className="mt-3">
                    <div className="text-white font-semibold leading-tight">{s.name}</div>
                    {s.reason && <div className="text-soft-gray text-sm mt-0.5">{s.reason}</div>}
                    {s.keywords?.length ? (
                      <div className="text-soft-gray/90 text-xs mt-2">{s.keywords.join(', ')}</div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-soft-gray">No styles extracted.</p>
        )}
      </Card>
    </motion.div>
  )
}
