export default function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && <p className="text-xs tracking-[0.35em] text-gold-600 uppercase">{eyebrow}</p>}
      <h2 className="gold-text mt-2 text-3xl font-semibold md:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 flex items-center justify-center gap-2 text-gold-400">
        <span className="h-px w-12 bg-gold-300" />✦<span className="h-px w-12 bg-gold-300" />
      </div>
      {children && <p className="mx-auto mt-3 max-w-xl text-sm text-ink/60">{children}</p>}
    </div>
  )
}
