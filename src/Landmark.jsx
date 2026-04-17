import { useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Heart, HeartOff } from "lucide-react"

export const landmarks = [
  {
    id: 1,
    name: "Lalibela Rock Churches",
    location: "Amhara Region",
    image:
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?q=80&w=1200&auto=format&fit=crop",
    description:
      "A UNESCO World Heritage site carved directly into volcanic rock.",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Simien Mountains",
    location: "Gondar",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    description:
      "Dramatic cliffs, deep valleys, and rare wildlife like the Gelada baboon.",
  },
  {
    id: 3,
    name: "Danakil Depression",
    location: "Afar Region",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    description:
      "One of the hottest places on Earth with surreal colorful landscapes.",
  },
  {
    id: 4,
    name: "Blue Nile Falls",
    location: "Bahir Dar",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop",
    description:
      "A powerful waterfall known locally as 'Tis Issat' meaning 'Smoking Water'.",
    tag: "Nature",
  },
  {
    id: 5,
    name: "Harar Jugol",
    location: "Harar",
    image:
      "https://images.unsplash.com/photo-1524492449090-1d9a4c4d2e9b?q=80&w=1200&auto=format&fit=crop",
    description:
      "A historic walled city filled with culture, markets, and ancient traditions.",
  },
  {
    id: 6,
    name: "Bale Mountains",
    location: "Oromia",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    description:
      "A paradise for hikers with alpine scenery and unique wildlife.",
    tag: "Adventure",
  },
]

export function LandmarkCard({ landmark, isFavorite, onToggleFavorite, disabled }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 transition hover:shadow-xl hover:shadow-black/30">
      <div className="relative">
        <img
          src={landmark.image}
          alt={landmark.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={onToggleFavorite}
          disabled={disabled}
          aria-label={
            isFavorite
              ? `Remove ${landmark.name} from wishlist`
              : `Add ${landmark.name} to wishlist`
          }
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-md transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
            disabled
              ? "cursor-not-allowed bg-slate-600/50 text-slate-300"
              : isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          {isFavorite ? (
            <Heart className="h-4 w-4" />
          ) : (
            <HeartOff className="h-4 w-4" />
          )}
        </button>

        {landmark.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cyan-500/80 px-3 py-1 text-xs font-medium text-white">
            {landmark.tag}
          </span>
        )}
      </div>

      <CardContent className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{landmark.name}</h3>
          <p className="text-sm text-slate-400">{landmark.location}</p>
        </div>

        <p className="text-sm text-slate-300 line-clamp-3">{landmark.description}</p>
      </CardContent>
    </Card>
  )
}

export default function Landmark() {
  const [query, setQuery] = useState("")
  const [wishlistIds, setWishlistIds] = useState([])
  const [userId, setUserId] = useState(null)
  const [loadingWishlist, setLoadingWishlist] = useState(true)

  const fetchWishlist = async (userUuid) => {
    setLoadingWishlist(true)
    const { data, error } = await supabase
      .from("wishlist")
      .select("landmark_id")
      .eq("user_id", userUuid)

    if (error) {
      toast.error("Unable to load your wishlist.")
      setWishlistIds([])
      setLoadingWishlist(false)
      return
    }

    setWishlistIds(data.map((item) => item.landmark_id))
    setLoadingWishlist(false)
  }

  const addToWishlist = async (landmarkId) => {
    const { error } = await supabase.from("wishlist").insert({
      user_id: userId,
      landmark_id: landmarkId,
    })

    if (error) {
      toast.error("Could not add this destination to your wishlist.")
      return
    }

    setWishlistIds((current) => [...current, landmarkId])
    toast.success("Added to your wishlist.")
  }

  const removeFromWishlist = async (landmarkId) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("landmark_id", landmarkId)

    if (error) {
      toast.error("Could not remove this destination from your wishlist.")
      return
    }

    setWishlistIds((current) => current.filter((id) => id !== landmarkId))
    toast.success("Removed from your wishlist.")
  }

  const toggleWishlist = async (landmarkId) => {
    if (!userId) {
      toast("Please log in to save favorites.")
      return
    }

    if (wishlistIds.includes(landmarkId)) {
      await removeFromWishlist(landmarkId)
    } else {
      await addToWishlist(landmarkId)
    }
  }

  useEffect(() => {
    const loadUserAndWishlist = async () => {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user ?? null

      if (error) {
        setUserId(null)
        setLoadingWishlist(false)
        return
      }

      if (user) {
        setUserId(user.id)
        await fetchWishlist(user.id)
      } else {
        setUserId(null)
        setLoadingWishlist(false)
      }
    }

    loadUserAndWishlist()
  }, [])

  const filteredLandmarks = useMemo(() => {
    const search = query.toLowerCase().trim()
    return landmarks.filter(
      (landmark) =>
        landmark.name.toLowerCase().includes(search) ||
        landmark.location.toLowerCase().includes(search)
    )
  }, [query])

  return (
    <section className="min-h-screen bg-slate-950 py-20 text-white">
      <Toaster />

      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-cyan-400">
            Discover Ethiopia
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Explore Landmarks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Find breathtaking destinations and save your favorite places to visit later.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 flex justify-center">
          <Input
            placeholder="Search by name or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xl"
          />
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredLandmarks.map((landmark) => (
            <LandmarkCard
              key={landmark.id}
              landmark={landmark}
              isFavorite={wishlistIds.includes(landmark.id)}
              onToggleFavorite={() => toggleWishlist(landmark.id)}
              disabled={loadingWishlist && !!userId}
            />
          ))}
        </div>

        {loadingWishlist && userId && (
          <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-300 shadow-xl shadow-slate-950/20">
            Loading your wishlist...
          </div>
        )}

        {/* Empty state */}
        {filteredLandmarks.length === 0 && (
          <div className="mt-16 text-center text-slate-400">
            <p className="text-lg">No landmarks found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>
    </section>
  )
}