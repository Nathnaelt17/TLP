import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Landmark() {
  return (
    <section id="landmark" className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-6xl px-6">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-xl">
          <CardContent className="p-10 text-center">
            <CardHeader className="space-y-4">
              <CardTitle>Explore Landmark Destinations</CardTitle>
              <CardDescription>
                Discover iconic sites, scenic landscapes, and rich cultural
                experiences across Ethiopia.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Landmark
