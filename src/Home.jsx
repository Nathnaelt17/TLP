import Header from "./Header.jsx"
import Landmark from "./Landmark.jsx"
import About from "./Aboutus.jsx"
import Contact from "./Contact.jsx"

function Home() {
  return (
    <main className="bg-slate-950">
      <Header/>
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-6 pt-32 pb-16 text-center text-white sm:px-8 lg:px-12"
        style={{
          backgroundImage:
            "url('https://resources.travellocal.com/wp/uploads/2023/09/10132016/South-Africa-landscape-un-scaled.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center bg-transparent px-8 py-10 sm:px-10 sm:py-12">
          <h1 className="mb-5 text-4xl font-bold sm:text-5xl">
            Discover Ethiopia
          </h1>

          <p className="mb-8 text-lg leading-8 text-slate-100 sm:text-xl">
            Explore breathtaking mountains, ancient history, and unforgettable
            adventures.
          </p>

         <button variant="primary"> <a
            href="#landmark"
            className="inline-flex rounded-full bg-transparent px-6 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            Start Exploring
          </a></button>
        </div>
      </section>
      <Landmark/>
      <About/>
      <Contact/>
    </main>
  )
}

export default Home
