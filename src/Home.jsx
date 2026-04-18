import { motion as Motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      id="home"
      className="flex min-h-screen items-center justify-center px-6 text-center text-white"
    >
      <Motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center justify-center px-6 sm:px-10"
      >
        <Motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mb-5 text-4xl font-bold sm:text-5xl"
        >
          Discover Ethiopia
        </Motion.h1>

        <Motion.p
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="mb-8 text-lg leading-8 text-slate-200 sm:text-xl"
        >
          Explore breathtaking mountains, ancient history, and unforgettable adventures.
        </Motion.p>

        <Motion.div variants={fadeInUp} transition={{ duration: 0.8 }}>
          <Button
            asChild
            className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-base font-medium text-slate-100 shadow-sm shadow-slate-950/20 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
          >
            <Link to="/destinations">Start Exploring</Link>
          </Button>
        </Motion.div>
      </Motion.div>
    </section>
  )
}

export default Home
