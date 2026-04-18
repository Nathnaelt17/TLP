import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { supabase } from "./supabase-client"
import { DestinationCard } from "./Landmark.jsx"
import { useAuth } from "./context/AuthContext.jsx"
import { Button } from "@/components/ui/button"
import { fetchDestinations } from "@/lib/destinations"
import { motion, AnimatePresence } from "framer-motion"

function BookingList({ bookings, onCancelBooking }) {
  if (bookings.length === 0) {
    return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-slate-300"
      >
        No booked trips yet. Complete the booking form to create your first booking.
      </motion.p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <AnimatePresence mode="popLayout">
        {bookings.map((trip) => (
          <motion.div 
            key={trip.id ?? `${trip.destination}-${trip.checkIn}`}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-slate-200"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Destination</p>
                <p className="mt-1 text-lg font-semibold text-white">{trip.destination}</p>
              </div>
              <div className="text-sm text-slate-400">
                <p>{trip.checkIn} → {trip.checkOut}</p>
                <p>{trip.guests} guest{trip.guests === 1 ? "" : "s"}</p>
              </div>
            </div>
            {trip.notes && <p className="mt-4 text-slate-300">Notes: {trip.notes}</p>}
            {onCancelBooking && trip.id && (
              <div className="mt-5 flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-cyan-400 bg-slate-900 text-cyan-300 shadow-lg shadow-cyan-500/10 transition duration-200 hover:bg-cyan-500 hover:text-white hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  onClick={() => onCancelBooking(trip.id)}
                >
                  Cancel booking
                </Button>
              </div>
            )}
          </motion.div>
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
  const [loadingDestinations, setLoadingDestinations] = useState(true)
  const [bookings, setBookings] = useState([])

  const fetchWishlist = async (userUuid) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("wishlist")
      .select("landmark_id")
      .eq("user_id", userUuid)

    if (error) {
      toast.error("Unable to load your dashboard.")
      setWishlistIds([])
      setLoading(false)
      return
    }
    setWishlistIds(data.map((item) => item.landmark_id))
    setLoading(false)
  }

  const removeFromWishlist = async (landmarkId) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user?.id)
      .eq("landmark_id", landmarkId)

    if (error) {
      toast.error("Could not remove this item from your dashboard.")
      return
    }
    setWishlistIds((current) => current.filter((id) => id !== landmarkId))
    toast.success("Removed from your dashboard.")
  }

  const addToWishlist = async (landmarkId) => {
    const { error } = await supabase.from("wishlist").insert({
      user_id: user?.id,
      landmark_id: landmarkId,
    })
    if (error) {
      toast.error("Could not add this item to your dashboard.")
      return
    }
    setWishlistIds((current) => [...current, landmarkId])
    toast.success("Added to your dashboard.")
  }

  const toggleWishlist = async (landmarkId) => {
    if (!user?.id) {
      toast("Please log in to access your dashboard.")
      return
    }
    if (wishlistIds.includes(landmarkId)) {
      await removeFromWishlist(landmarkId)
    } else {
      await addToWishlist(landmarkId)
    }
  }

  const savedDestinations = useMemo(
    () => destinations.filter((destination) => wishlistIds.includes(destination.id)),
    [wishlistIds, destinations]
  )

  const fetchDestinationsFromDb = async () => {
    setLoadingDestinations(true)
    const { data, error } = await fetchDestinations()
    if (error) {
      toast.error("Unable to load destination details.")
      setDestinations([])
      setLoadingDestinations(false)
      return
    }
    setDestinations(data || [])
    setLoadingDestinations(false)
  }

  const fetchBookings = async (userUuid) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userUuid)
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Unable to load your booked trips.")
      setBookings([])
      return
    }
    setBookings((data || []).map((trip) => ({
      ...trip,
      checkIn: trip.check_in,
      checkOut: trip.check_out,
    })))
  }

  const handleCancelBooking = async (bookingId) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .eq("user_id", user?.id)

    if (error) {
      toast.error("Could not cancel that booking.")
      return
    }
    setBookings((current) => current.filter((booking) => booking.id !== bookingId))
    toast.success("Booking canceled.")
  }

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.id) {
        setWishlistIds([])
        setBookings([])
        setLoading(false)
        await fetchDestinationsFromDb()
        return
      }
      await fetchWishlist(user.id)
      await fetchBookings(user.id)
      await fetchDestinationsFromDb()
    }
    loadWishlist()
  }, [user])

  return (
    <section id="dashboard" className="min-h-screen bg-transparent py-20 text-white">
      <Toaster />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="text-sm uppercase tracking-widest text-cyan-400">Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Saved Destinations</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            These are the destinations you&apos;ve saved. Remove items or visit the Destinations page to add more.
          </p>
        </motion.div>

        {!user && !loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <p className="text-lg text-white">Please log in to view your dashboard.</p>
            <Link to="/login" className="mt-4 inline-flex rounded-full border border-cyan-400/40 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400">
              Log In
            </Link>
          </motion.div>
        ) : loading || loadingDestinations ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <p className="text-lg">Loading your dashboard...</p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <motion.div layout className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {savedDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    landmark={destination}
                    isFavorite={true}
                    onToggleFavorite={() => toggleWishlist(destination.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {savedDestinations.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl backdrop-blur-xl"
              >
                <p className="text-lg text-white">Your dashboard is empty.</p>
                <p className="mt-2 text-sm text-slate-400">Head back to the Destinations page to save your favorite destinations.</p>
              </motion.div>
            )}

            <motion.div 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
            >
              <h2 className="text-2xl font-semibold text-white">Booked Trips</h2>
              <p className="mt-2 text-slate-400">Your upcoming bookings are shown here for quick reference.</p>
              <BookingList bookings={bookings} onCancelBooking={handleCancelBooking} />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}