export default function Testimonials() {
  const quotes = [
    { q: 'It feels like a personal stylist in my pocket.', a: 'Amara, Creative Director' },
    { q: 'The hairstyle suggestions were spot-on for my face shape.', a: 'Jade, Product Manager' },
    { q: 'Polished, fast, and surprisingly accurate.', a: 'Rahul, Consultant' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="font-heading text-white text-3xl mb-6">What users say</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {quotes.map((t, i) => (
          <figure key={i} className="rounded-3xl border border-navy-800 bg-glass backdrop-blur-xs p-6 shadow-soft">
            <blockquote className="text-white">“{t.q}”</blockquote>
            <figcaption className="text-soft-gray mt-2 text-sm">— {t.a}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
