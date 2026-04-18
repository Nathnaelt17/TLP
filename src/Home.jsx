import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion" // 1. Import Framer Motion

function Home() {
  // Animation variants for cleaner code
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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

       
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }} // Adds a delay between each child
          className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center bg-transparent px-6 py-10 sm:px-10 sm:py-12"
        >
          <motion.h1 
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-5 text-4xl font-bold sm:text-5xl"
          >
            Discover Ethiopia
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-8 text-lg leading-8 text-slate-200 sm:text-xl"
          >
            Explore breathtaking mountains, ancient history, and unforgettable
            adventures.
          </motion.p>

          <motion.div variants={fadeInUp} transition={{ duration: 0.8 }}>
            <Button
              asChild
              className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-base font-medium text-slate-100 shadow-sm shadow-slate-950/20 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
            >
              <Link to="/destinations">Start Exploring</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}

export default Home