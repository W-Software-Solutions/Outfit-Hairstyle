import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// API key from Vite env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const form = document.querySelector('form');
const promptInput = document.querySelector('input[name="prompt"]');
const output = document.querySelector('.output');

form?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!output) return;
  output.textContent = 'Generating...';

  try {
    const imageUrl = form.elements.namedItem('chosen-image')?.value;
    if (!imageUrl) throw new Error('Please provide an image URL.');

    const imageBase64 = await fetch(imageUrl, { mode: 'cors' })
      .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch image: ${r.status}`);
        return r.arrayBuffer();
      })
      .then(a => Base64.fromByteArray(new Uint8Array(a)));

    const contents = [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: promptInput?.value || '' }
        ]
      }
    ];

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
    });

    const buffer = [];
    const md = new MarkdownIt();
    for await (const response of stream) {
      buffer.push(response.text);
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML = (output.innerHTML || '') + '<hr>' + String(e);
  }
});

maybeShowApiKeyBanner(API_KEY);
