import Header from "./Header.jsx"
import Landmark from "./Landmark.jsx"
import About from "./Aboutus.jsx"
import Contact from "./Contact.jsx"
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
      <Header />
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
            className="rounded-full bg-cyan-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500"
          >
            <a href="#landmark">Start Exploring</a>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <Card className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-800 bg-slate-950/95 text-white shadow-xl">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Track progress and recent activity for your Vite app.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-200">
            Your design system is ready. Start building your next component.
          </CardContent>
          <CardFooter className="border-t border-slate-800 pt-4 text-sm text-slate-400">
            Built with a modern component system for rapid UI iteration.
          </CardFooter>
        </Card>
      </section>

      <Landmark />
      <About />
      <Contact />
    </main>
  )
}

export default Home
