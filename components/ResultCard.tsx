"use client"
import { motion, AnimatePresence } from 'framer-motion'

export default function ResultCard({ title, html, show }: { title: string; html: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-3xl border border-navy-800 bg-glass backdrop-blur-xs p-6 shadow-soft"
        >
          <h2 className="font-heading text-white text-xl mb-3">{title}</h2>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </motion.section>
      )}
    </AnimatePresence>
  )
}
