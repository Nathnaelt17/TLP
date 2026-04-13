import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function About() {
  return (
    <section id="about" className="bg-slate-950 py-24 text-center text-white">
      <div className="mx-auto max-w-4xl px-6">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-xl">
          <CardContent className="p-10">
            <CardHeader className="space-y-4">
              <CardTitle>About Us</CardTitle>
              <CardDescription>
                We help travelers find unforgettable journeys through stunning
                landscapes, local culture, and authentic experiences.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default About
