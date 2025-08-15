export default function Hero() {
  return (
    <section className="bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <span className="badge">AI Styling Platform</span>
        <h1 className="mt-4 font-heading text-4xl sm:text-5xl text-white leading-[1.05]">Look your best, every day.</h1>
        <p className="mt-3 text-soft-gray max-w-2xl">Our AI analyzes your outfits and face shape to give personalized style advice, from wardrobe tweaks to hairstyle matches.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#tools" className="px-5 py-3 rounded-2xl bg-gradient-to-r from-aqua to-coral text-navy-900 font-semibold shadow-soft hover:scale-[1.02] transition-transform">Try the Tools</a>
          <a href="#features" className="px-5 py-3 rounded-2xl border border-navy-800 text-white hover:bg-white/5 transition-colors">See Features</a>
        </div>
      </div>
    </section>
  )
}
