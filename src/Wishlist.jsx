import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { AnimatePresence, motion as Motion } from "framer-motion"
import { Briefcase, Heart, Home, LayoutDashboard, Map, Ticket,Pencil} from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchDestinations } from "@/lib/destinations"
import { DestinationCard } from "./Landmark.jsx"
import { supabase } from "./supabase-client"
import { useAuth } from "./context/AuthContext.jsx"

function BookingList({ bookings, onCancelBooking }) {
  if (bookings.length === 0) {
    return (
      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-slate-400 italic"
      >
        No booked trips yet.
      </Motion.p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <AnimatePresence mode="popLayout">
        {bookings.map((trip) => (
          <Motion.div
            key={trip.id ?? `${trip.destination}-${trip.checkIn}`}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-white/5 bg-slate-900/50 p-5 text-slate-200"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Destination
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{trip.destination}</p>
              </div>
              <div className="text-right text-sm text-slate-400">
                <p className="font-mono">
                  {trip.checkIn} - {trip.checkOut}
                </p>
                <p>{trip.guests} guest{trip.guests === 1 ? "" : "s"}</p>
              </div>
            </div>
            {trip.notes ? (
              <p className="mt-4 rounded-lg bg-black/20 p-3 text-sm text-slate-400">
                Note: {trip.notes}
              </p>
            ) : null}
            {onCancelBooking && trip.id ? (
              <div className="mt-5 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                  onClick={() => onCancelBooking(trip.id)}
                >
                  Cancel Trip
                </Button>
              </div>
            ) : null}
          </Motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])

  const fetchWishlist = async (userUuid) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("wishlist")
      .select("landmark_id")
      .eq("user_id", userUuid)

    if (error) {
      toast.error("Unable to load wishlist.")
      setWishlistIds([])
    } else {
      setWishlistIds((data || []).map((item) => item.landmark_id))
    }

    setLoading(false)
  }

  const toggleWishlist = async (landmarkId) => {
    if (!user?.id) return

    if (wishlistIds.includes(landmarkId)) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("landmark_id", landmarkId)

      if (!error) {
        setWishlistIds((prev) => prev.filter((id) => id !== landmarkId))
      }
      return
    }

    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, landmark_id: landmarkId })

    if (!error) {
      setWishlistIds((prev) => [...prev, landmarkId])
    }
  }

  const fetchDestinationsFromDb = async () => {
    const { data, error, formattedError } = await fetchDestinations()

    if (error) {
      toast.error(formattedError || error.message || "Unable to load destinations.")
      setDestinations([])
      return
    }

    setDestinations(data || [])
  }

  const fetchBookings = async (userUuid) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userUuid)
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Unable to load bookings.")
      setBookings([])
      return
    }

    setBookings(
      (data || []).map((trip) => ({
        ...trip,
        checkIn: trip.check_in,
        checkOut: trip.check_out,
      }))
    )
  }

  const handleCancelBooking = async (bookingId) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .eq("user_id", user?.id)

    if (error) {
      toast.error("Unable to cancel booking.")
      return
    }

    setBookings((current) => current.filter((booking) => booking.id !== bookingId))
    toast.success("Booking cancelled.")
  }

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await Promise.all([
          fetchWishlist(user.id),
          fetchBookings(user.id),
          fetchDestinationsFromDb(),
        ])
      } else {
        setLoading(false)
        setWishlistIds([])
        setBookings([])
        await fetchDestinationsFromDb()
      }
    }

    loadData()
  }, [user])

  const savedDestinations = useMemo(
    () => destinations.filter((destination) => wishlistIds.includes(destination.id)),
    [wishlistIds, destinations]
  )

  return (
    <div className="flex min-h-screen text-white">
      <Toaster position="bottom-right" />

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/5 bg-slate-900/40 backdrop-blur-xl lg:flex">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
           <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
          Tourism
        </h1>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4">
          <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
          <SidebarLink to="/destinations" icon={<Map size={18} />} label="Destinations" />
          <SidebarLink to="/booking" icon={<Ticket size={18} />} label="Bookings" />
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink to="/admin" icon={<Pencil size={18} />} label="Admin" />
        </nav>

        <div className="mt-auto border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-400">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500">Account</p>
              <p className="truncate text-sm font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-6xl p-6 lg:p-12">
          {!user && !loading ? (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="mt-2 text-slate-400">
                  Please log in to view your private dashboard.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-block rounded-full bg-cyan-500 px-8 py-3 font-semibold"
                >
                  Log In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
                <p className="mt-2 text-slate-400">
                  Manage your wishlist and upcoming reservations.
                </p>
              </header>

              <div className="grid gap-10 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Heart size={20} />
                    <h2 className="text-xl font-semibold text-white">Saved Destinations</h2>
                  </div>

                  {savedDestinations.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-500">
                      No saved items yet.
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <AnimatePresence>
                        {savedDestinations.map((destination) => (
                          <DestinationCard
                            key={destination.id}
                            landmark={destination}
                            isFavorite
                            onToggleFavorite={() => toggleWishlist(destination.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Briefcase size={20} />
                    <h2 className="text-xl font-semibold text-white">Upcoming Trips</h2>
                  </div>
                  <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm">
                    <BookingList bookings={bookings} onCancelBooking={handleCancelBooking} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        active
          ? "bg-cyan-500/10 font-medium text-cyan-400"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
