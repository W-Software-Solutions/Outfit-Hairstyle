import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Inter, Fira_Code } from 'next/font/google'

const heading = Poppins({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-heading' })
const body = Inter({ subsets: ['latin'], variable: '--font-body' })
const code = Fira_Code({ subsets: ['latin'], variable: '--font-code' })

export const metadata: Metadata = {
  title: 'Gemini Vision Demo (Next.js)',
  description: 'Stream responses from a Gemini multimodal model',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
  <body className={`${body.variable} ${heading.variable} ${code.variable}`}>{children}</body>
    </html>
  )
}
