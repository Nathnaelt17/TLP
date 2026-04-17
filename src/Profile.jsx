import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { supabase } from "./supabase-client"
import { useAuth } from "./context/AuthContext.jsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Profile() {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("name,username,email,phone,address,dob")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Failed to load profile:", error)
        toast.error("Unable to load profile details.")
        setFormData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          dob: user.dob || "",
        })
        setLoading(false)
        return
      }

      setFormData({
        name: data.name || user.name || "",
        username: data.username || user.username || "",
        email: data.email || user.email || "",
        phone: data.phone || user.phone || "",
        address: data.address || user.address || "",
        dob: data.dob || user.dob || "",
      })
      setLoading(false)
    }

    loadProfile()
  }, [user, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    const updates = {
      name: formData.name,
      username: formData.username,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (error) {
      toast.error("Unable to save profile information.")
      setSaving(false)
      return
    }

    login({ ...user, ...updates, email: formData.email })
    toast.success("Profile updated successfully.")
    setSaving(false)
  }

  return (
    <main className="min-h-screen bg-transparent py-20 text-white">
      <Toaster />
      <section className="mx-auto max-w-4xl px-6">
        <Card className="border border-slate-800 bg-slate-950/80 shadow-xl shadow-slate-950/30">
          <CardHeader className="space-y-2 p-8 text-center sm:text-left">
            <CardTitle className="text-3xl font-semibold text-white">Profile</CardTitle>
            <p className="text-sm text-slate-400">
              View and update your account details. Your email address is read-only here.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {loading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300">
                Loading profile...
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={formData.email} readOnly />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/home")}
                    className="w-full sm:w-auto"
                  >
                    Back to home
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
