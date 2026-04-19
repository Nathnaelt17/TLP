import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuth } from "./context/AuthContext.jsx"
import { isAdminEmail } from "./lib/admin"

function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      window.addEventListener("pointerdown", handleClickOutside)
    }

    return () => {
      window.removeEventListener("pointerdown", handleClickOutside)
    }
  }, [menuOpen])

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Destinations", href: "/destinations" },
    { label: "Booking", href: "/booking" },
    { label: "Dashboard", href: "/dashboard" },
  ]
  const visibleNavItems = isAdminEmail(user?.email)
    ? [...navItems, { label: "Admin", href: "/admin" }]
    : navItems

  const profileInitial = user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"

  return (
    <header className="absolute top-0 left-0 z-20 w-full px-4 py-4 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[2rem] bg-slate-950/60 px-5 py-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link to="/">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
              Tourism
            </h1>
          </Link>
          <button
            className="text-white md:hidden"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`${
            mobileNavOpen ? "flex" : "hidden"
          } w-full flex-col items-center gap-4 text-sm font-medium text-slate-100 md:flex md:w-auto md:flex-row md:items-center md:justify-end`}
        >
          <ul className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row md:items-center">
            {visibleNavItems.map((item) => (
              <li key={item.label} className="w-full text-center md:w-auto">
                <Link
                  to={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white md:w-auto md:justify-start"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <Link
              to="/login"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex w-full justify-center rounded-full border border-cyan-400/40 bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400 md:w-auto md:justify-start"
            >
              Login
            </Link>
          ) : (
            <div className="relative mt-2 flex w-full justify-center md:mt-0 md:block md:w-auto" ref={dropdownRef}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-slate-700 bg-slate-900 px-3 py-2 text-white md:w-auto"
                onClick={() => setMenuOpen((current) => !current)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{profileInitial}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {menuOpen && (
                <DropdownMenuContent className="mt-2 w-full md:absolute md:right-0 md:w-56 z-50">
                  <div className="space-y-2 p-4">
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/profile")
                        setMenuOpen(false)
                        setMobileNavOpen(false)
                      }}
                    >
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout()
                        navigate("/")
                        setMenuOpen(false)
                        setMobileNavOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
