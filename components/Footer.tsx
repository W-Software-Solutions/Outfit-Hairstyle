export default function Footer() {
  return (
    <footer id="contact" className="mt-16 border-t border-navy-800/80">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-soft-gray">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-aqua to-coral" aria-hidden />
          <span className="font-heading text-white">W Software Solutions</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#tools">Tools</a>
          <a className="hover:text-white" href="#">Privacy</a>
        </nav>
      </div>
    </footer>
  )
}
