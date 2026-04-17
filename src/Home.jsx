import Landmark from "./Landmark.jsx"
import Booking from "./Booking.jsx"
import Wishlist from "./Wishlist.jsx"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Home() {
  return (
    <main className="bg-slate-950">
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-6 pt-32 pb-16 text-center text-white sm:px-8 lg:px-12"
        style={{
          backgroundImage:
            "url('https://resources.travellocal.com/wp/uploads/2023/09/10132016/South-Africa-landscape-un-scaled.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center bg-transparent px-8 py-10 sm:px-10 sm:py-12">
          <h1 className="mb-5 text-4xl font-bold sm:text-5xl">
            Discover Ethiopia
          </h1>

          <p className="mb-8 text-lg leading-8 text-slate-200 sm:text-xl">
            Explore breathtaking mountains, ancient history, and unforgettable
            adventures.
          </p>

          <Button
          asChild
            className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-base font-medium text-slate-100 shadow-sm shadow-slate-950/20 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
          >
            <a href="#landmark">Start Exploring</a>
          </Button>
        </div>
      </section>

      <Landmark />
      <Booking />
      <Wishlist />
    </main>
  )
}

export default Home
