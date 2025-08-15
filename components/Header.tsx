export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-navy-800 bg-navy-900/70">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-aqua to-coral animate-pulseGlow" aria-hidden />
          <span className="font-heading text-white text-lg">W Software Solutions</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-soft-gray">
          <a className="hover:text-white transition-colors" href="#features">Features</a>
          <a className="hover:text-white transition-colors" href="#tools">Tools</a>
          <a className="hover:text-white transition-colors" href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}
