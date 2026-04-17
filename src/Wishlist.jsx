import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"
import { DestinationCard, destinations } from "./Landmark.jsx"
import { useAuth } from "./context/AuthContext.jsx"

export default function Wishlist() {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async (userUuid) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("wishlist")
      .select("landmark_id")
      .eq("user_id", userUuid)

    if (error) {
      toast.error("Unable to load your wishlist.")
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
      toast.error("Could not remove this item from your wishlist.")
      return
    }

    setWishlistIds((current) => current.filter((id) => id !== landmarkId))
    toast.success("Removed from your wishlist.")
  }

  const addToWishlist = async (landmarkId) => {
    const { error } = await supabase.from("wishlist").insert({
      user_id: user?.id,
      landmark_id: landmarkId,
    })

    if (error) {
      toast.error("Could not add this item to your wishlist.")
      return
    }

    setWishlistIds((current) => [...current, landmarkId])
    toast.success("Added to your wishlist.")
  }

  const toggleWishlist = async (landmarkId) => {
    if (!user?.id) {
      toast("Please log in to access your wishlist.")
      return
    }

    if (wishlistIds.includes(landmarkId)) {
      await removeFromWishlist(landmarkId)
    } else {
      await addToWishlist(landmarkId)
    }
  }

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.id) {
        setWishlistIds([])
        setLoading(false)
        return
      }
      await fetchWishlist(user.id)
    }

    loadWishlist()
  }, [user])

  const savedDestinations = useMemo(
    () => destinations.filter((destination) => wishlistIds.includes(destination.id)),
    [wishlistIds]
  )

  return (
    <section id="wishlist" className="min-h-screen bg-transparent py-20 text-white">
      <Toaster />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-cyan-400">My Wishlist</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Saved Destinations</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            These are the destinations you&apos;ve wishlisted. Remove items or visit the Destinations page to add more.
          </p>
        </div>

        {!user && !loading ? (
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-lg text-white">Please log in to view your wishlist.</p>
            <Link
              to="/login"
              className="mt-4 inline-flex rounded-full border border-cyan-400/40 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Log In
            </Link>
          </div>
        ) : loading ? (
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-lg">Loading your wishlist...</p>
          </div>
        ) : savedDestinations.length === 0 ? (
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/45 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-lg text-white">Your wishlist is empty.</p>
            <p className="mt-2 text-sm text-slate-400">
              Head back to the Destinations page to save your favorite destinations.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                landmark={destination}
                isFavorite={true}
                onToggleFavorite={() => toggleWishlist(destination.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
