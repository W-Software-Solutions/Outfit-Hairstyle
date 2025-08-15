export default function Features() {
  const items = [
    { title: 'Outfit Rater', desc: 'Upload a look and get a score plus detailed feedback.', icon: '👗' },
    { title: 'Hairstyle Matcher', desc: 'Analyze face shape and get hairstyle ideas with examples.', icon: '💇‍♀️' },
  ]
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="font-heading text-white text-3xl mb-6">What you can do</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((f) => (
          <div key={f.title} className="rounded-3xl border border-navy-800 bg-glass backdrop-blur-xs p-6 shadow-soft">
            <div className="text-3xl mb-2" aria-hidden>{f.icon}</div>
            <h3 className="font-heading text-white text-xl">{f.title}</h3>
            <p className="text-soft-gray mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
