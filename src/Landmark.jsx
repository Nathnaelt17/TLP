import { useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "sonner"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { fetchDestinations } from "@/lib/destinations"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, HeartOff, Search } from "lucide-react"
import { AnimatePresence, motion as Motion } from "framer-motion"

export function DestinationCard({
  landmark,
  isFavorite,
  onToggleFavorite,
  disabled,
  onCardClick,
}) {
  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={onCardClick}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 backdrop-blur-xl transition hover:shadow-xl hover:shadow-cyan-500/10"
      >
        <div className="relative">
          <img
            src={landmark.image}
            alt={landmark.name}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
          />

          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) onToggleFavorite()
            }}
            className={`absolute right-3 top-3 rounded-full p-2 transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
            } ${disabled && !isFavorite ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <Motion.div
              animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isFavorite ? (
                <Heart className="h-4 w-4 fill-current" />
              ) : (
                <HeartOff className="h-4 w-4" />
              )}
            </Motion.div>
          </button>
        </div>

        <CardContent className="p-4">
          <h3 className="text-white font-semibold">{landmark.name}</h3>
          <p className="text-sm text-slate-400">{landmark.location}</p>
          <p className="text-sm text-slate-300 mt-2 line-clamp-2">
            {landmark.description}
          </p>
        </CardContent>
      </Card>
    </Motion.div>
  )
}

export default function Destinations() {
  const [query, setQuery] = useState("")
  const [destinations, setDestinations] = useState([])
  const [wishlistIds, setWishlistIds] = useState([])
  const [userId, setUserId] = useState(null)
  const [loadingDestinations, setLoadingDestinations] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const navigate = useNavigate()

  const fetchWishlist = async (userUuid) => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("landmark_id")
      .eq("user_id", userUuid)

    if (error) {
      toast.error("Unable to load saved destinations.")
      setWishlistIds([])
      return
    }

    setWishlistIds(data.map((item) => item.landmark_id))
  }

  const loadDestinations = async () => {
    setLoadingDestinations(true)
    setFetchError(null)

    const response = await fetchDestinations()
    const { data, error, formattedError } = response

    if (error) {
      const message = formattedError || error.message || "Unable to load destinations."
      console.error("Destination fetch error:", response)
      toast.error(message)
      setFetchError(message)
      setDestinations([])
      setLoadingDestinations(false)
      return
    }

    setDestinations(data || [])
    setLoadingDestinations(false)
  }

  useEffect(() => {
    const loadUser = async () => {
      await loadDestinations()

      const { data } = await supabase.auth.getUser()
      const userId = data?.user?.id || null
      setUserId(userId)

      if (userId) {
        await fetchWishlist(userId)
      } else {
        setWishlistIds([])
      }
    }
    loadUser()
  }, [])

  const toggleWishlist = async (id) => {
    if (!userId) return toast("Please log in first")

    if (wishlistIds.includes(id)) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("landmark_id", id)

      if (error) {
        toast.error("Could not remove saved destination.")
        return
      }

      setWishlistIds((p) => p.filter((x) => x !== id))
    } else {
      const { error } = await supabase.from("wishlist").insert({
        user_id: userId,
        landmark_id: id,
      })

      if (error) {
        toast.error("Could not save destination.")
        return
      }

      setWishlistIds((p) => [...p, id])
    }
  }

  const filtered = useMemo(() => {
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase())
    )
  }, [destinations, query])

  return (
    <div className="min-h-screen text-white p-10">
      <Toaster />

      <Motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-6"
      >
        Explore Destinations
      </Motion.h1>

      <Motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 max-w-2xl"
      >
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <Input
          type="search"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[2rem] border border-white/15 bg-slate-900/90 px-14 py-4 text-base text-slate-100 shadow-xl shadow-black/20 outline-none transition duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
        />
      </Motion.div>

      <AnimatePresence mode="wait">
        {loadingDestinations ? (
          <Motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-12 text-center text-slate-300 shadow-xl backdrop-blur-xl"
          >
            Loading destinations...
          </Motion.div>
        ) : fetchError ? (
          <Motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[2rem] border border-red-500/20 bg-slate-950/45 p-12 text-center text-slate-300 shadow-xl backdrop-blur-xl"
          >
            <p className="text-xl font-semibold text-white">Unable to load destinations</p>
            <p className="mt-3 text-slate-400">{fetchError}</p>
          </Motion.div>
        ) : (
          <Motion.div 
            key="grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((d) => (
                <DestinationCard
                  key={d.id}
                  landmark={d}
                  isFavorite={wishlistIds.includes(d.id)}
                  onToggleFavorite={() => toggleWishlist(d.id)}
                  disabled={!userId}
                  onCardClick={() => navigate(`/destination/${d.id}`)}
                />
              ))}
            </AnimatePresence>
          </Motion.div>
        )}
      </AnimatePresence>

      {!loadingDestinations && !fetchError && filtered.length === 0 && destinations.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/45 p-12 text-center text-slate-300 shadow-xl backdrop-blur-xl"
        >
          <p className="text-xl font-semibold text-white">No matches found.</p>
          <p className="mt-3 text-slate-400">Try adjusting your search terms.</p>
        </motion.div>
      )}
    </div>
  )
}
