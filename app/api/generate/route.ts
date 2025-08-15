import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const { imageUrl, prompt, image, mode } = (body || {}) as {
    imageUrl?: string
    prompt?: string
    image?: { data: string; mimeType?: string }
    mode?: 'outfit' | 'hairstyle'
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return new Response('Missing GEMINI_API_KEY in .env.local', { status: 500 })
  }

  if (!image && !imageUrl) {
    return new Response('Provide an image file (base64) or an imageUrl', { status: 400 })
  }

  try {
    let base64 = ''
    let mime = 'image/jpeg'

    if (image && image.data) {
      base64 = String(image.data)
      mime = image.mimeType || 'image/jpeg'
    } else if (imageUrl) {
      const imgRes = await fetch(imageUrl)
      if (!imgRes.ok) return new Response(`Failed to fetch image: ${imgRes.status}`, { status: 400 })
      const arrayBuffer = await imgRes.arrayBuffer()
      base64 = Buffer.from(arrayBuffer).toString('base64')
      mime = imgRes.headers.get('content-type') || 'image/jpeg'
    }

    const tool = mode === 'hairstyle' ? 'hairstyle' : 'outfit'

    const instruction = tool === 'hairstyle'
  ? `You are a professional hair stylist. The user will provide a face photo. Analyze ONLY the person's hair and face shape. If the image does not clearly contain a person's face and hair, respond with: "Please provide a clear front-facing photo focusing on your hair and face." Be polite and encouraging.

Output your response in Markdown with the following exact sections:

## Hair Rating:
Give a score out of 10 (example: "8.5/10").

## What Works:
List 3–5 positive aspects of the current hairstyle — how it suits the face shape, texture, density, movement, and lifestyle.

## Improvements:
List 2–4 constructive changes (length, layers, fringe/part, volume placement, color tone) with specific suggestions.

## Suggested Styles:
List 3–5 hairstyle ideas by name with a one-line reason (e.g., "Soft curtain bangs + long layers — adds movement and frames an oval face"). For each item, you may optionally append one or both of the following tokens to help clients discover visuals:
- [keywords: comma-separated keywords]
- [img: a representative image URL if you know one; optional]

Format each style on a single line like:
- Soft bob — chin-length cut that accentuates the jawline [keywords: soft bob, chin length, slight wave]
- Long layers + face-framing pieces — adds movement without losing length [img: https://example.com/soft-layers.jpg]

Tone guidelines:
- Always be polite and encouraging.
- If the hairstyle is already excellent, praise it sincerely and explain why no changes are needed.
- Avoid insulting language; frame suggestions as opportunities for enhancement.

Do not include any additional commentary outside of the requested sections.`
  : `You are a professional personal stylist and fashion consultant. The user will provide an image of themselves. Analyze ONLY the outfit worn by the person (clothing, accessories, shoes). If the image does not clearly contain a person wearing an outfit, respond with: "Please provide a clear photo focusing on the outfit." Be polite and encouraging.

Output your response in Markdown with the following exact sections:

## Style Rating:
Give a score out of 10 (example: "8.5/10").

## What Works:
List 3–5 positive aspects about the outfit — things that are done well in terms of fit, color harmony, fabric choice, accessories, and appropriateness for the setting.

## Improvements:
List 2–4 constructive suggestions to improve the outfit. Include specific examples of alternative colors, accessories, or garment types.

## Bonus Style Tip:
Provide 1 extra tip to elevate the style, either through accessories, layering, or small adjustments.

Tone guidelines:
- Always be polite and encouraging.
- If the outfit is already excellent, praise it sincerely and explain why no changes are needed.
- Avoid insulting language; frame suggestions as opportunities for enhancement.

Do not include any additional commentary outside of the requested sections.`

    const contents = [
      { role: 'user', parts: [
        { text: instruction },
        { inlineData: { mimeType: mime, data: base64 } },
        { text: String(prompt || '') }
      ] }
    ]

    const ai = new GoogleGenAI({ apiKey })
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash',
      contents
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.text))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    })
  } catch (e: any) {
    console.error('API /api/generate error:', e)
    return new Response(String(e?.message || e), { status: 500 })
  }
}
