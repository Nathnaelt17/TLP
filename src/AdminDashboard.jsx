import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const ADMIN_EMAIL = "Nathnaeltm17@gmail.com" 

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [destinations, setDestinations] = useState([])

  const [form, setForm] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    details: "",
    tag: "",
  })

  async function fetchDestinations() {
    const { data } = await supabase.from("destinations").select("*")
    setDestinations(data || [])
  }

  useEffect(() => {
    const loadDashboard = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      await fetchDestinations()
    }

    loadDashboard()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast("You must be logged in")
      return
    }

    const { error } = await supabase.from("destinations").insert([form])

    if (error) {
      toast.error("Failed to add destination")
      return
    }

    toast.success("Destination added!")
    setForm({
      name: "",
      location: "",
      image: "",
      description: "",
      details: "",
      tag: "",
    })

    fetchDestinations()
  }

  const handleDelete = async (id) => {
    await supabase.from("destinations").delete().eq("id", id)
    fetchDestinations()
  }

  
  if (!user) {
    return <p className="text-white p-10">Please log in.</p>
  }

  if (user.email !== ADMIN_EMAIL) {
    return <p className="text-white p-10">Access denied.</p>
  }

  return (
    <div className="min-h-screen text-white p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <Input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <Input placeholder="Location" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })} />

        <Input placeholder="Image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })} />

        <Textarea placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <Textarea placeholder="Full Details"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })} />

        <Input placeholder="Tag"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })} />

        <Button type="submit">Add Destination</Button>
      </form>

      <div className="space-y-4">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="p-4 border border-white/10 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{d.name}</h2>
              <p className="text-sm text-slate-400">{d.location}</p>
            </div>

            <Button
              variant="destructive"
              onClick={() => handleDelete(d.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
