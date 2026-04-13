import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "./supabase-client";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginIdentifier = identifier.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);
      let emailToUse = loginIdentifier;

      if (!isEmail) {
        const { data: lookupData, error: lookupError } = await supabase
          .from("profiles")
          .select("email")
          .or(`username.eq.${loginIdentifier},phone.eq.${loginIdentifier}`)
          .single();

        if (lookupError) {
          if (lookupError.code === "PGRST116") {
            setError("No account found for that username or phone number.");
            return;
          }
          throw lookupError;
        }

        if (!lookupData?.email) {
          setError("No account found for that username or phone number.");
          return;
        }

        emailToUse = lookupData.email;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      const metadata = data.user?.user_metadata ?? {};
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, username, email, phone, address, dob")
        .eq("id", data.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      const userProfile = {
        id: data.user?.id,
        name: profileData?.name ?? metadata.name ?? "",
        username: profileData?.username ?? metadata.username ?? "",
        email: profileData?.email ?? data.user?.email ?? identifier.trim(),
        phone: profileData?.phone ?? metadata.phone ?? "",
        address: profileData?.address ?? metadata.address ?? "",
        dob: profileData?.dob ?? metadata.dob ?? "",
      };

      localStorage.setItem("user", JSON.stringify(userProfile));
      navigate("/home");
    } catch (loginError) {
      setError(loginError.message || "Invalid email or password.");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://resources.travellocal.com/wp/uploads/2023/09/10132016/South-Africa-landscape-un-scaled.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute w-96 h-96 bg-[#FF7700] opacity-15 rounded-full -top-48 -right-48"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#FF7700] opacity-10 rounded-full -bottom-64 -left-64"></div>
      
      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl p-1 mx-4 animate-slideUp relative z-10 border border-white/20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl bg-slate-950/95 p-10 text-white flex flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-[#FF7700]/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#FF7700] font-semibold">
                Travel Portal
              </span>
              <h2 className="mt-6 text-4xl font-bold tracking-tight">
                Login to continue your travel adventure
              </h2>
              <p className="mt-4 text-slate-300 leading-7">
                Find the best destinations, save your trips, and get personalized recommendations.
              </p>
            </div>

            <div className="mt-10 space-y-4 text-slate-300">
              <p className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Secure traveler profile
              </p>
              <p className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Fast access to exclusive tours
              </p>
              <p className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Ready for your next destination
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-950 mb-2 tracking-tight">
                Adventure Awaits
              </h1>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Sign in to plan your next trip, save favorite destinations, and manage bookings.
              </p>
              <div className="w-16 h-1 bg-[#FF7700] mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label 
              htmlFor="identifier" 
              className="block text-[#004777] font-semibold text-sm uppercase tracking-wide"
            >
              Email, Username, or Phone
            </label>
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7700] text-sm" />
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError("");
                }}
                required
                placeholder="Enter your email, username, or phone number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF7700] focus:outline-none focus:ring-4 focus:ring-[#FF7700]/10 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-[#004777] font-semibold text-sm uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7700] text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF7700] focus:outline-none focus:ring-4 focus:ring-[#FF7700]/10 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A30000] hover:text-[#FF7700] transition-colors duration-300"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a 
              href="/forgot-password" 
              className="text-sm text-[#FF7700] hover:text-[#A30000] transition-colors duration-300 font-medium"
            >
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-[#A30000] p-4 rounded-lg animate-shake">
              <p className="text-[#A30000] text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF7700] to-[#A30000] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#FF7700]/30 transform hover:-translate-y-0.5 transition-all duration-300 text-lg uppercase tracking-wide"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-[#FF7700] hover:text-[#A30000] font-semibold transition-colors duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
