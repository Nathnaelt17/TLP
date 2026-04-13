import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { supabase } from "./supabase-client";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage("Password reset email sent. Check your inbox.");
      setEmail("");
    } catch (requestError) {
      setError(requestError.message || "Could not send reset email.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#004777] to-[#A30000] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#004777] transition-colors duration-300 hover:text-[#FF7700]"
        >
          <FaArrowLeft size={12} />
          Back to login
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-[#004777]">Reset Password</h1>
        <p className="mb-6 text-sm text-gray-500">
          Enter your email address and Supabase will send you a password reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#004777]"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#FF7700]" />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 text-gray-700 outline-none transition-all duration-300 focus:border-[#FF7700] focus:ring-4 focus:ring-[#FF7700]/10"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-[#A30000]/20 bg-red-50 px-4 py-3 text-sm font-medium text-[#A30000]">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#FF7700] to-[#A30000] py-3 text-lg font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF7700]/30"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
