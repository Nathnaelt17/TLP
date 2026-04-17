import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaLock, FaUserAlt } from "react-icons/fa"
import { supabase } from "./supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Login() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const loginIdentifier = identifier.trim()
      const normalizedIdentifier = loginIdentifier.toLowerCase()
      const normalizedPhone = loginIdentifier.replace(/\D/g, "")
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)
      const isPhone = /^[\d\s()+-]+$/.test(loginIdentifier) && normalizedPhone.length === 10
      let emailToUse = normalizedIdentifier

      if (!isEmail) {
        const lookupColumn = isPhone ? "phone" : "username"
        const lookupValue = isPhone ? normalizedPhone : loginIdentifier
        const { data: lookupData, error: lookupError } = await supabase
          .from("profiles")
          .select("email")
          .eq(lookupColumn, lookupValue)
          .maybeSingle()

        if (lookupError) {
          console.error("Profile lookup error:", lookupError)
          throw lookupError
        }

        if (!lookupData?.email) {
          setError(`No account found for that ${isPhone ? "phone number" : "username"}.`)
          return
        }

        emailToUse = lookupData.email.trim().toLowerCase()
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      })

      if (signInError) {
        if (signInError.status === 400 || signInError.status === 401) {
          setError("Invalid login credentials. Please check your identifier and password.")
          return
        }
        throw signInError
      }

      const metadata = data.user?.user_metadata ?? {}
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, username, email, phone, address, dob")
        .eq("id", data.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }

      const userProfile = {
        id: data.user?.id,
        name: profileData?.name ?? metadata.name ?? "",
        username: profileData?.username ?? metadata.username ?? "",
        email: profileData?.email ?? data.user?.email ?? loginIdentifier,
        phone: profileData?.phone ?? metadata.phone ?? "",
        address: profileData?.address ?? metadata.address ?? "",
        dob: profileData?.dob ?? metadata.dob ?? "",
      }

      localStorage.setItem("user", JSON.stringify(userProfile))
      navigate("/home")
    } catch (loginError) {
      if (loginError?.status !== 400) {
        console.error("Login error:", loginError)
      }
      setError(loginError?.message || "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-950">
      <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_right,_rgba(248,113,113,0.12),_transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Card className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-2xl shadow-slate-950/20">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

              {/* LEFT SIDE */}
              <div className="hidden rounded-[2rem] bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">
                    Travel Portal
                  </span>
                  <h2 className="mt-8 text-4xl font-semibold tracking-tight">
                    Your next trip starts here.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
                    Securely sign in to manage trips, save favorite destinations, and access exclusive rewards.
                  </p>
                </div>

                <div className="mt-10 space-y-4 text-slate-300">
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Secure traveler profile
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Fast booking history
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Clean, modern dashboard UI
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <CardContent className="p-8 sm:p-10">
                <CardHeader className="space-y-4 text-center sm:text-left">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 sm:mx-0">
                    <FaUserAlt className="h-5 w-5" />
                  </div>

                  <CardTitle className="text-3xl font-semibold text-slate-950">
                    Adventure Awaits
                  </CardTitle>

                  <CardDescription className="max-w-xl text-sm text-slate-600">
                    Sign in to plan your next trip, save favorite destinations, and manage bookings with one modern portal.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                  {/* IDENTIFIER */}
                  <div className="space-y-3">
                    <Label htmlFor="identifier">Email, username, or phone</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <FaUserAlt className="h-4 w-4" />
                      </span>
                      <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value)
                          if (error) setError("")
                        }}
                        required
                        placeholder="Enter your email, username, or phone"
                        className="pl-11"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-cyan-700 transition hover:text-cyan-900"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <FaLock className="h-4 w-4" />
                      </span>

                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (error) setError("")
                        }}
                        required
                        placeholder="Enter your password"
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

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                      {error}
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
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                <CardFooter className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-semibold text-cyan-700 transition hover:text-cyan-900"
                    to="/signup"
                  >
                    Create account
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

export default Login
