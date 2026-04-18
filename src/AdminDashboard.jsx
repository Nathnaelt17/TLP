import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Pencil, Globe } from "lucide-react"

const ADMIN_EMAIL = "nathnaeltmk@gmail.com"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Added loading state
  const [destinations, setDestinations] = useState([])
  const [editingId, setEditingId] = useState(null) // Tracking edit mode

  const [form, setForm] = useState({
    name: "", location: "", image: "", description: "", details: "", tag: "",
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user?.email === ADMIN_EMAIL) fetchDestinations()
      setLoading(false)
    }
    checkUser()
  }, [])

  async function fetchDestinations() {
    const { data } = await supabase.from("destinations").select("*").order('created_at', { ascending: false })
    setDestinations(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error("Unauthorized")

    const loadingToast = toast.loading(editingId ? "Updating..." : "Adding...")

    const { error } = editingId 
      ? await supabase.from("destinations").update(form).eq("id", editingId)
      : await supabase.from("destinations").insert([form])

    toast.dismiss(loadingToast)

    if (error) return toast.error(error.message)

    toast.success(editingId ? "Updated!" : "Destination added!")
    resetForm()
    fetchDestinations()
  }

  const resetForm = () => {
    setForm({ name: "", location: "", image: "", description: "", details: "", tag: "" })
    setEditingId(null)
  }

  const handleEdit = (destination) => {
    setEditingId(destination.id)
    setForm(destination)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return
    await supabase.from("destinations").delete().eq("id", id)
    fetchDestinations()
    toast.success("Deleted successfully")
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-white">
      <Loader2 className="animate-spin" />
    </div>
  )

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-400">Please sign in with an admin account.</p>
        <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your travel destinations</p>
        </div>
        {editingId && <Button variant="outline" onClick={resetForm}>Cancel Edit</Button>}
      </div>

      {/* Form Section */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-12">
        <h2 className="text-lg font-medium mb-4">{editingId ? "Edit Destination" : "Add New Destination"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-transparent" required />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="bg-transparent" required />
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="bg-transparent" />
          <Input placeholder="Tag (e.g. Adventure, Relax)" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} className="bg-transparent" />
          <div className="md:col-span-2">
            <Textarea placeholder="Short Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="bg-transparent" />
          </div>
          <div className="md:col-span-2">
            <Textarea placeholder="Full Details (Markdown supported)" value={form.details} onChange={(e) => setForm({...form, details: e.target.value})} className="bg-transparent h-32" />
          </div>
          <Button type="submit" className="md:col-span-2 w-full">
            {editingId ? "Update Destination" : "Create Destination"}
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold mb-2">Existing Destinations ({destinations.length})</h2>
        {destinations.map((d) => (
          <div key={d.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-white/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                {d.image ? <img src={d.image} alt="" className="object-cover h-full w-full" /> : <Globe size={20} />}
              </div>
              <div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-xs text-slate-400">{d.location} • {d.tag}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => handleEdit(d)} className="text-slate-400 hover:text-white">
                <Pencil size={18} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}