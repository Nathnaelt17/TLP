import { useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"
import { LandmarkCard, landmarks } from "./Landmark.jsx"
import Header from "./Header.jsx"

export default function Wishlist() {
  const [userId, setUserId] = useState(null)
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
      .eq("user_id", userId)
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
      user_id: userId,
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
    if (!userId) {
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
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user ?? null

      if (error) {
        setUserId(null)
        setLoading(false)
        return
      }

      if (user) {
        setUserId(user.id)
        await fetchWishlist(user.id)
      } else {
        setUserId(null)
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const savedLandmarks = useMemo(
    () => landmarks.filter((landmark) => wishlistIds.includes(landmark.id)),
    [wishlistIds]
  )

  return (
    
    <section id="wishlist" className="min-h-screen bg-slate-950 py-20 text-white">
      <Toaster />
      

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-cyan-400">
            My Wishlist
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Saved Destinations</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            These are the landmarks you've wishlisted. Remove items or visit the Landmarks page to add more.
          </p>
        </div>

        {!userId && !loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20">
            <p className="text-lg text-white">Please log in to view your wishlist.</p>
          </div>
        ) : loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20">
            <p className="text-lg">Loading your wishlist...</p>
          </div>
        ) : savedLandmarks.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/20">
            <p className="text-lg text-white">Your wishlist is empty.</p>
            <p className="mt-2 text-sm text-slate-400">
              Head back to the Landmarks page to save your favorite destinations.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedLandmarks.map((landmark) => (
              <LandmarkCard
                key={landmark.id}
                landmark={landmark}
                isFavorite={true}
                onToggleFavorite={() => toggleWishlist(landmark.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
