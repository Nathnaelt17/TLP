const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Landmark', href: '#landmark' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function Header() {
  return (
    <header className="absolute top-0 left-0 z-20 w-full px-6 py-5 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl flex-col items-center justify-between rounded-[2rem] bg-slate-950/45 px-5 py-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl sm:flex-row">
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
          Tourism
        </h1>

        <ul className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-100 sm:justify-end">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
