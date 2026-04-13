const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Landmark', href: '#landmark' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
 
]

function Header() {
  return (
    <header className="absolute top-0 left-0 z-20 w-full px-6 py-5 sm:px-8 lg:px-12">
      <nav className="flex flex-col gap-4 bg-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
          Tourism
        </h1>

        <ul className="flex flex-wrap items-center gap-2 text-sm font-medium text-white sm:justify-end">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="rounded-full bg-transparent px-4 py-2 transition hover:bg-cyan-400/20 hover:text-white"
            >
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
