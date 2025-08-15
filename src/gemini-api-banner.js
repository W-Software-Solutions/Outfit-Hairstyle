export function maybeShowApiKeyBanner(apiKey) {
  const container = document.getElementById('api-banner');
  if (!container) return;

  const missing = !apiKey || apiKey.trim() === '';
  if (!missing) return;

  container.innerHTML = `
    <div class="api-banner">
      <p><strong>Set your Gemini API key</strong> to run this demo.</p>
      <ol>
        <li>Create a <code>.env</code> file in the project root</li>
        <li>Add: <code>VITE_GEMINI_API_KEY=YOUR_KEY_HERE</code></li>
        <li>Restart the dev server</li>
      </ol>
      <p>Get a key: <a href="https://g.co/ai/idxGetGeminiKey" target="_blank" rel="noreferrer">g.co/ai/idxGetGeminiKey</a></p>
    </div>
  `;
}
