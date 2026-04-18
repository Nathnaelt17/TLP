import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Pencil, Globe, LogOut } from "lucide-react"
import { isAdminEmail } from "./lib/admin"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [destinations, setDestinations] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: "", location: "", image: "", description: "", details: "", tag: "",
  })

  useEffect(() => {
    // 1. Initial Check
    const initializeAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (isAdminEmail(user?.email)) {
        fetchDestinations()
      }
      setLoading(false)
    }

    initializeAuth()

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (isAdminEmail(currentUser?.email)) {
        fetchDestinations()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchDestinations() {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error("Failed to load destinations: " + error.message)
    } else {
      setDestinations(data || [])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !isAdminEmail(user.email)) {
      return toast.error("Unauthorized action")
    }

    const loadingToast = toast.loading(editingId ? "Updating..." : "Adding...")

    const { error } = editingId 
      ? await supabase.from("destinations").update(form).eq("id", editingId)
      : await supabase.from("destinations").insert([form])

    toast.dismiss(loadingToast)

    if (error) {
      return toast.error(error.message)
    }

    toast.success(editingId ? "Updated successfully!" : "Destination added!")
    resetForm()
    fetchDestinations()
  }

  const resetForm = () => {
    setForm({ name: "", location: "", image: "", description: "", details: "", tag: "" })
    setEditingId(null)
  }

  const handleEdit = (destination) => {
    setEditingId(destination.id)
    setForm({
      name: destination.name || "",
      location: destination.location || "",
      image: destination.image || "",
      description: destination.description || "",
      details: destination.details || "",
      tag: destination.tag || ""
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return
    
    const { error } = await supabase.from("destinations").delete().eq("id", id)
    
    if (error) {
      toast.error(error.message)
    } else {
      fetchDestinations()
      toast.success("Deleted successfully")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <Loader2 className="animate-spin" />
    </div>
  )

  // Strict check with lowercase normalization
  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white space-y-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-400 max-w-sm">
          You are signed in as <span className="text-white font-mono">{user?.email || "Guest"}</span>. 
          Please sign in with the admin account.
        </p>
        <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
            <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user.email}</p>
        </div>
        <div className="flex gap-2">
            {editingId && <Button variant="secondary" onClick={resetForm}>Cancel Edit</Button>}
            <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-white">
                <LogOut size={18} className="mr-2" /> Logout
            </Button>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-12 shadow-xl">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}
            {editingId ? "Edit Destination" : "Add New Destination"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Name" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            className="bg-white/5 border-white/10" 
            required 
          />
          <Input 
            placeholder="Location" 
            value={form.location} 
            onChange={(e) => setForm({...form, location: e.target.value})} 
            className="bg-white/5 border-white/10" 
            required 
          />
          <Input 
            placeholder="Image URL" 
            value={form.image} 
            onChange={(e) => setForm({...form, image: e.target.value})} 
            className="bg-white/5 border-white/10" 
          />
          <Input 
            placeholder="Tag (e.g. Adventure, Relax)" 
            value={form.tag} 
            onChange={(e) => setForm({...form, tag: e.target.value})} 
            className="bg-white/5 border-white/10" 
          />
          <div className="md:col-span-2">
            <Textarea 
                placeholder="Short Description" 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                className="bg-white/5 border-white/10" 
            />
          </div>
          <div className="md:col-span-2">
            <Textarea 
                placeholder="Full Details (Markdown supported)" 
                value={form.details} 
                onChange={(e) => setForm({...form, details: e.target.value})} 
                className="bg-white/5 border-white/10 h-32" 
            />
          </div>
          <Button type="submit" className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700">
            {editingId ? "Update Destination" : "Create Destination"}
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Existing Destinations ({destinations.length})</h2>
        {destinations.length === 0 ? (
            <p className="text-slate-500 italic">No destinations found. Add your first one above!</p>
        ) : (
            destinations.map((d) => (
                <div key={d.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-white/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                      {d.image ? <img src={d.image} alt="" className="object-cover h-full w-full" /> : <Globe size={20} className="text-slate-500" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{d.name}</h3>
                      <p className="text-xs text-slate-400">{d.location} • {d.tag || 'No Tag'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(d)} className="text-slate-400 hover:text-white hover:bg-white/10">
                      <Pencil size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))
        )}
      </div>
    </div>
  )
}
