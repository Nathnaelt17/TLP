import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Booking() {
  return (
    <section id="booking" className="bg-slate-950 py-24 text-center text-white">
      <div className="mx-auto max-w-4xl px-6">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-xl">
          <CardContent className="p-10">
            <CardHeader className="space-y-4">
              <CardTitle>Booking</CardTitle>
              <CardDescription>
                View your travel reservations, manage upcoming trips, and start new booking requests for Ethiopian adventures.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Booking
