import { useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "sonner"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, HeartOff, Search } from "lucide-react"

export const destinations = [
  {
    id: 1,
    name: "Lalibela Rock-Hewn Churches",
    location: "Amhara Region, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/Bete_Giyorgis_Lalibela.jpg",
    description:
      "Famous 12th-century rock-carved churches and UNESCO World Heritage Site.",
    details:
      "Lalibela is one of the holiest cities in Ethiopia, known for its 11 medieval monolithic churches carved directly into rock. Built during the Zagwe dynasty, it remains an active pilgrimage site for Ethiopian Orthodox Christians.",
    highlights: ["UNESCO World Heritage Site", "11 rock-hewn churches"],
    tag: "Heritage",
  },
  {
    id: 2,
    name: "Simien Mountains National Park",
    location: "Amhara Region, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Simiens_Cliffs.jpg",
    description:
      "Dramatic cliffs and rare wildlife in Ethiopia’s highest peaks.",
    details:
      "The Simien Mountains feature dramatic escarpments, deep valleys, and rare species such as the Ethiopian wolf and Gelada baboon.",
    highlights: ["Ethiopian wolf", "High-altitude trekking"],
    tag: "Adventure",
  },
  {
    id: 3,
    name: "Danakil Depression",
    location: "Afar Region, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Dallol_Ethiopia.jpg",
    description: "One of the hottest and most extreme places on Earth.",
    details:
      "The Danakil Depression contains lava lakes, salt flats, and colorful acid springs in one of the most hostile environments on Earth.",
    highlights: ["Erta Ale volcano", "Dallol hot springs"],
    tag: "Extreme",
  },
  {
    id: 4,
    name: "Blue Nile Falls",
    location: "Bahir Dar, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Blue_Nile_Falls.jpg",
    description: "Powerful waterfall on the Blue Nile River.",
    details:
      "Blue Nile Falls (Tis Issat) is a dramatic waterfall that becomes especially powerful during the rainy season.",
    highlights: ["Lake Tana nearby", "Seasonal waterfall"],
    tag: "Nature",
  },
  {
    id: 5,
    name: "Harar Jugol",
    location: "Harari Region, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/Harar_walls.jpg",
    description: "Ancient walled city with deep cultural heritage.",
    details:
      "Harar is one of the oldest Islamic cities in Africa, known for its narrow alleyways, markets, and hyena feeding tradition.",
    highlights: ["UNESCO site", "Old walled city"],
    tag: "Culture",
  },
  {
    id: 6,
    name: "Bale Mountains",
    location: "Oromia Region, Ethiopia",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Bale_Mountains.jpg",
    description: "High-altitude park with unique wildlife.",
    details:
      "The Bale Mountains offer afro-alpine scenery and are home to the endangered Ethiopian wolf.",
    highlights: ["Sanetti Plateau", "Wildlife trekking"],
    tag: "Wildlife",
  },
]

export function DestinationCard({
  landmark,
  isFavorite,
  onToggleFavorite,
  disabled,
  onCardClick,
}) {
  return (
    <Card
      onClick={onCardClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={landmark.image}
          alt={landmark.name}
          className="h-56 w-full object-cover transition group-hover:scale-105"
        />

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) onToggleFavorite()
          }}
          className={`absolute right-3 top-3 rounded-full p-2 ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/20 text-white"
          }`}
        >
          {isFavorite ? (
            <Heart className="h-4 w-4" />
          ) : (
            <HeartOff className="h-4 w-4" />
          )}
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
  )
}

export default function Destinations() {
  const [query, setQuery] = useState("")
  const [wishlistIds, setWishlistIds] = useState([])
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data?.user?.id || null)
    }
    loadUser()
  }, [])

  const toggleWishlist = async (id) => {
    if (!userId) return toast("Please log in first")

    if (wishlistIds.includes(id)) {
      setWishlistIds((p) => p.filter((x) => x !== id))
    } else {
      setWishlistIds((p) => [...p, id])
    }
  }

  const filtered = useMemo(() => {
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div className="min-h-screen text-white p-10">
      <Toaster />

      <h1 className="text-4xl font-bold mb-6">Explore Destinations</h1>

      <div className="relative mb-8 max-w-2xl">
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
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}