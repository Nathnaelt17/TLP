import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserAlt,
} from "react-icons/fa"
import { supabase } from "./supabase-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./context/AuthContext.jsx"

function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [dob, setDob] = useState("")
  const [password, setPassword] = useState("")
  const [signupError, setSignupError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setSignupError("")
    setIsLoading(true)

    const normalizedName = name.trim()
    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPhone = phone.replace(/\D/g, "")
    const normalizedAddress = address.trim()

    if (
      !normalizedName ||
      !normalizedUsername ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedAddress ||
      !dob ||
      !password
    ) {
      setSignupError("Please fill in all fields.")
      setIsLoading(false)
      return
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/
    const phonePattern = /^[0-9]{10}$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

    if (!emailPattern.test(normalizedEmail)) {
      setSignupError("Email must be a valid gmail.com or yahoo.com address.")
      setIsLoading(false)
      return
    }

    if (!phonePattern.test(normalizedPhone)) {
      setSignupError("Phone must be a 10-digit number.")
      setIsLoading(false)
      return
    }

    if (!passwordPattern.test(password)) {
      setSignupError(
        "Password must be at least 8 chars and include uppercase, lowercase, number, and symbol.",
      )
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: normalizedName,
            username: normalizedUsername,
            phone: normalizedPhone,
            address: normalizedAddress,
            dob,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data?.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name: normalizedName,
          username: normalizedUsername,
          email: normalizedEmail,
          phone: normalizedPhone,
          address: normalizedAddress,
          dob,
        })

        if (profileError) {
          throw profileError
        }
      }

      if (!data.session) {
        localStorage.removeItem("user")
        setSignupError(
          "Signup successful. Check your email to confirm your account before logging in.",
        )
        setIsLoading(false)
        return
      }

      const userProfile = {
        id: data.user?.id,
        name: normalizedName,
        username: normalizedUsername,
        email: normalizedEmail,
        phone: normalizedPhone,
        address: normalizedAddress,
        dob,
      }

      login(userProfile)
      navigate("/home")
    } catch (error) {
      setSignupError(error.message || "Signup failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.14),_transparent_25%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Card className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-2xl shadow-slate-950/15">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="hidden flex-col justify-between rounded-[2rem] bg-slate-950 p-10 text-white lg:flex">
                <div>
                  <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                    Travel Club
                  </span>
                  <h2 className="mt-8 text-4xl font-semibold tracking-tight">
                    Create your travel passport
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                    Sign up to access curated trips, exclusive offers, and easy booking for your next Ethiopian adventure.
                  </p>
                </div>

                <div className="mt-10 space-y-4 text-slate-300">
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Personalized destination guides
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Fast booking and secure profiles
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Local culture recommendations
                  </p>
                </div>
              </div>

              <CardContent className="p-8 sm:p-10">
                <CardHeader className="space-y-4 text-center sm:text-left">
                  <CardTitle className="text-3xl font-semibold text-slate-950">
                    Create your traveler account
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm text-slate-600">
                    Join now and explore the world with personalized trips.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSignup} className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="name">Full name</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaUserAlt className="h-4 w-4" />
                        </span>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Name"
                          className="pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaUserAlt className="h-4 w-4" />
                        </span>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Username"
                          className="pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaEnvelope className="h-4 w-4" />
                        </span>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="name@example.com"
                          className="pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone">Phone number</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaPhoneAlt className="h-4 w-4" />
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="0912345678"
                          className="pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaMapMarkerAlt className="h-4 w-4" />
                        </span>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          placeholder="123 Main St, City, Country"
                          className="pl-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="password">Password</Label>
                        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                          Secure
                        </span>
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <FaLock className="h-4 w-4" />
                        </span>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Create a strong password"
                          className="pr-11 pl-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition hover:text-slate-900"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {signupError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                      {signupError}
                    </div>
                  )}

                  <Button
                    className="w-full bg-cyan-700 text-white hover:bg-cyan-800 font-semibold shadow-md disabled:opacity-60"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </form>

                <CardFooter className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link className="font-semibold text-cyan-700 transition hover:text-cyan-900" to="/login">
                    Sign in
                  </Link>
                </CardFooter>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Signup
