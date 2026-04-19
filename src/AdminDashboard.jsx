import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Globe,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  Map,
  Pencil,
  Plus,
  Trash2,
  Ticket,
  Menu,
  X,
} from "lucide-react"
import { isAdminEmail } from "./lib/admin"
import { useAuth } from "./context/AuthContext.jsx"
export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    details: "",
    tag: "",
  })

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error(`Failed to load destinations: ${error.message}`)
      return
    }

    setDestinations(data || [])
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (isAdminEmail(user?.email)) {
        fetchDestinations()
      }
      setLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (isAdminEmail(currentUser?.email)) {
        fetchDestinations()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
    setForm({
      name: "",
      location: "",
      image: "",
      description: "",
      details: "",
      tag: "",
    })
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
      tag: destination.tag || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return

    const { error } = await supabase.from("destinations").delete().eq("id", id)

    if (error) {
      toast.error(error.message)
      return
    }

    fetchDestinations()
    toast.success("Deleted successfully")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-[#0a0a0a] p-6 text-center text-white">
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="max-w-sm text-slate-400">
          You are signed in as <span className="font-mono text-white">{user?.email || "Guest"}</span>.
          Please sign in with the admin account.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleLogout} className="border-white/10 hover:bg-white/5">
            Sign Out
          </Button>
          <Button onClick={() => (window.location.href = "/login")} className="bg-cyan-600 hover:bg-cyan-500">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const inputStyles = "border-white/10 bg-slate-950/45 text-slate-100 backdrop-blur-xl transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-2xl"

  return (
    
    <div className="flex min-h-screen bg-transparent text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Consistent with User Dashboard */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/5 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:bg-slate-900/40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
              Tourism
            </h1>
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4">
          <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
          <SidebarLink to="/destinations" icon={<Map size={18} />} label="Destinations" />
          <SidebarLink to="/booking" icon={<Ticket size={18} />} label="Bookings" />
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink to="/admin" icon={<Pencil size={18} />} label="Admin" active />
        </nav>

        <div className="mt-auto border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-400">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500">Admin Account</p>
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="mt-3 w-full justify-start text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-sm">
            Tourism
          </h1>
          <button 
            className="text-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-6 lg:p-12">
          
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
            
            {/* Form Section */}
            <section className="space-y-6">
              {/* Header logic moved inside the section for a seamless layout */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-white">Admin Control</h1>
                  <p className="mt-1 text-slate-400">Manage your destination catalog</p>
                </div>
                {editingId && (
                  <Button 
                    variant="secondary" 
                    onClick={resetForm} 
                    className="rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                  {editingId ? <Pencil className="text-cyan-400" size={20} /> : <Plus className="text-cyan-400" size={20} />}
                  {editingId ? "Update Destination" : "New Destination"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Name</label>
                    <Input
                      placeholder="E.g. Santorini"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputStyles}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Location</label>
                    <Input
                      placeholder="E.g. Greece"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className={inputStyles}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Image URL</label>
                    <Input
                      placeholder="https://..."
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Tag</label>
                    <Input
                      placeholder="Adventure, Relax, etc."
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      className={inputStyles}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Short Description</label>
                    <Textarea
                      placeholder="A brief overview..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${inputStyles} min-h-[80px]`}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 ml-1">Full Details</label>
                    <Textarea
                      placeholder="Markdown supported content..."
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      className={`${inputStyles} h-40`}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="md:col-span-2 w-full bg-cyan-500 py-6 text-white shadow-xl shadow-cyan-500/20 transition-all hover:bg-cyan-400 hover:scale-[1.01] rounded-2xl"
                  >
                    {editingId ? "Update Destination" : "Create Destination"}
                  </Button>
                </form>
              </div>
            </section>

            {/* Library Section */}
            <section className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Library</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Destinations ({destinations.length})
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Review and manage live entries.
                </p>
              </div>

              <div className="space-y-4">
                {destinations.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-white/10 p-12 text-center text-slate-500">
                    No destinations found.
                  </div>
                ) : (
                  destinations.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/30 hover:bg-white/[0.07]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-800">
                            {d.image ? (
                              <img src={d.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Globe size={22} className="text-slate-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100">{d.name}</h3>
                            <p className="text-xs text-slate-400">
                              {d.location} • <span className="text-cyan-400/80">{d.tag || "No Tag"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(d)}
                            className="rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(d.id)}
                            className="rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        active
          ? "bg-cyan-500/10 font-medium text-cyan-400"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}