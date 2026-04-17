import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuth } from "./context/AuthContext.jsx"

function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
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
    { label: "Landmark", href: "/landmark" },
    { label: "Booking", href: "/booking" },
  ]

  if (user) {
    navItems.push({ label: "Wishlist", href: "/wishlist" })
  }

  const profileInitial = user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"

  return (
    <header className="absolute top-0 left-0 z-20 w-full px-6 py-5 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-[2rem] bg-slate-950/45 px-5 py-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl sm:flex-row sm:justify-between sm:gap-0">
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
          Tourism
        </h1>

        <div className="flex w-full flex-col items-center gap-3 text-sm font-medium text-slate-100 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <ul className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <Link
              to="/login"
              className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="inline-flex items-center gap-2 rounded-full border-slate-700 bg-slate-900 px-3 py-2 text-white"
                onClick={() => setMenuOpen((current) => !current)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{profileInitial}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {menuOpen && (
                <DropdownMenuContent className="right-0 mt-2 w-56">
                  <div className="space-y-2 p-4">
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/profile")
                        setMenuOpen(false)
                      }}
                    >
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout()
                        navigate("/")
                        setMenuOpen(false)
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
