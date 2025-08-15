# Gemini Vision Demo (Next.js App Router)

A Next.js app that sends an image and text prompt to a Gemini multimodal model and streams the Markdown response from a server API route.

## Setup

1. Install Node.js 18+.
2. Install dependencies:

```powershell
npm install
```

3. Copy `.env.example` to `.env.local` and set your key:

```env
GEMINI_API_KEY=YOUR_KEY
```

4. Start the dev server:

```powershell
npm run dev
```

Open http://localhost:3000.

## Usage
- Paste an image URL and an optional prompt.
- Click Generate to stream the model's response as Markdown.

## Notes
- API calls run on the server in `app/api/generate/route.ts`, keeping your key secret.
- If the image host blocks server-side fetches or requires auth, host the image somewhere public or extend the API to accept uploads.
