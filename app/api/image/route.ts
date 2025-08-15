import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url') || ''
  try {
    if (!url) return new Response('Missing url', { status: 400 })
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response('Invalid protocol', { status: 400 })
    }

    const res = await fetch(url)
    if (!res.ok) return new Response(`Upstream error ${res.status}`, { status: res.status })
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) {
      return new Response('URL is not an image', { status: 400 })
    }
    // Stream the response body through
    return new Response(res.body, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 })
  }
}
