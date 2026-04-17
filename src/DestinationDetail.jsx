import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { destinations } from "./Landmark.jsx"

export default function DestinationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const destination = destinations.find((d) => d.id === Number(id))

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Destination not found</h1>
          <Button
            className="mt-4 inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition duration-200 hover:bg-cyan-400"
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* HERO */}
      <div className="relative h-[60vh]">
        <img
          src={destination.image}
          className="w-full h-full object-cover"
          alt={destination.name}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-10">
          <p className="text-cyan-400">{destination.location}</p>
          <h1 className="text-5xl font-bold">{destination.name}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-8 space-y-10">

        <Button
          className="inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition duration-200 hover:bg-cyan-400"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        {/* OVERVIEW */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Overview</h2>
          <p className="text-slate-300 leading-7">
            {destination.details}
          </p>
        </section>

        {/* HIGHLIGHTS */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Highlights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {destination.highlights?.map((h, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 border border-white/10 rounded-xl"
              >
                {h}
              </div>
            ))}
          </div>
        </section>

       
        
      </div>
    </div>
  )
}