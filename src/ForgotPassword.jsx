import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft, FaEnvelope } from "react-icons/fa"
import { supabase } from "./supabase-client"
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

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      })

      if (resetError) {
        throw resetError
      }

      setMessage("Password reset email sent. Check your inbox.")
      setEmail("")
    } catch (requestError) {
      setError(requestError.message || "Could not send reset email.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-950">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.14),_transparent_35%)]" />
        <div className="relative mx-auto w-full max-w-md">
          <Card className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/95 shadow-2xl shadow-slate-950/20">
            <CardContent className="p-8 sm:p-10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-cyan-700"
                >
                  <FaArrowLeft className="h-3.5 w-3.5" /> Back to login
                </Link>
              </div>

              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl font-semibold text-slate-950">Reset Password</CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Enter your email address and Supabase will send you a password reset link.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleReset} className="mt-8 space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="reset-email">Email address</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <FaEnvelope className="h-4 w-4" />
                    </span>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="pl-11"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
