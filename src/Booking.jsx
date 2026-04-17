import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { useAuth } from "./context/AuthContext.jsx"
import { destinations } from "./Landmark.jsx"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Booking() {
  const { user } = useAuth()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [bookings, setBookings] = useState([])
  const [errors, setErrors] = useState([])

  const validate = () => {
    const validationErrors = []
    if (!destination.trim()) validationErrors.push("Destination is required.")
    if (!checkIn) validationErrors.push("Check-in date is required.")
    if (!checkOut) validationErrors.push("Check-out date is required.")
    if (checkIn && checkOut && checkIn > checkOut) {
      validationErrors.push("Check-out must be after check-in.")
    }
    if (!guests || guests < 1) validationErrors.push("Number of guests must be at least 1.")
    return validationErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    const booking = {
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedBookings = [booking, ...bookings]
    setBookingData(booking)
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    setSubmitted(true)
    setErrors([])
    toast.success("Booking request saved.")
  }

  useEffect(() => {
    if (destinations.length > 0 && !destination) {
      setDestination(destinations[0].name)
    }

    const storedBookings = localStorage.getItem("bookings")
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings))
      } catch (error) {
        console.warn("Unable to parse stored bookings", error)
      }
    }
  }, [])

  if (!user) {
    return (
      <section id="booking" className="min-h-screen scroll-mt-28 bg-transparent py-24 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-12 text-center shadow-xl shadow-slate-950/30 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-white">You must log in to use this feature</h2>
            <p className="mt-4 text-slate-400">
              Please sign in to make a booking and access your wishlist.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="scroll-mt-28 bg-transparent py-24 text-white">
      <Toaster />
      <div className="mx-auto max-w-4xl px-6">
        <Card className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 backdrop-blur-xl shadow-xl shadow-slate-950/30">
          <CardContent className="p-10">
            <CardHeader className="space-y-4 text-center">
              <CardTitle>Book Your Trip</CardTitle>
              <CardDescription>
                Fill out the booking form to request your next destination. All fields are easy to complete and instantly saved locally.
              </CardDescription>
            </CardHeader>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                  <ul className="list-disc space-y-1 pl-5 leading-6">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="destination">Destination</Label>
                  <select
                    id="destination"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-xl"
                  >
                    {destinations.map((item) => (
                      <option key={item.id} value={item.name} className="bg-slate-950 text-white">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guests">Number of guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="checkIn">Check-in date</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="checkOut">Check-out date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">Optional notes</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-xl"
                  placeholder="Add any special requests or travel notes"
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Booking
              </Button>
            </form>

            {submitted && bookingData && (
              <div className="mt-10 rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-6 text-slate-50">
                <h3 className="text-xl font-semibold">Booking request confirmed</h3>
                <p className="mt-2 text-slate-200">Your booking request has been saved locally.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Destination</p>
                    <p className="mt-1 text-base font-medium">{bookingData.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Guests</p>
                    <p className="mt-1 text-base font-medium">{bookingData.guests}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Check-in</p>
                    <p className="mt-1 text-base font-medium">{bookingData.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Check-out</p>
                    <p className="mt-1 text-base font-medium">{bookingData.checkOut}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/45 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Already booked trips</h2>
              {bookings.length === 0 ? (
                <p className="mt-4 text-slate-300">No booked trips yet. Complete the form above to create your first booking.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {bookings.map((trip, index) => (
                    <div key={`${trip.destination}-${trip.checkIn}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-slate-200">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Destination</p>
                          <p className="mt-1 text-lg font-semibold text-white">{trip.destination}</p>
                        </div>
                        <div className="text-sm text-slate-400">
                          <p>{trip.checkIn} → {trip.checkOut}</p>
                          <p>{trip.guests} guest{trip.guests === 1 ? "" : "s"}</p>
                        </div>
                      </div>
                      {trip.notes && <p className="mt-4 text-slate-300">Notes: {trip.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Booking
