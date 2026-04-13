import { useState } from "react"
import { Link,useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { supabase } from "./supabase-client";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !phone || !address || !dob || !password) {
      setSignupError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    const phonePattern = /^[0-9]{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!emailPattern.test(email)) {
      setSignupError("Email must be a valid gmail.com or yahoo.com address.");
      return;
    }

    if (!phonePattern.test(phone)) {
      setSignupError("Phone must be a 10-digit number.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setSignupError("Password must be at least 8 chars and include uppercase, lowercase, number, and symbol.");
      return;
    }

   try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          phone,
          address,
          dob,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.session) {
      localStorage.removeItem("user");
      setSignupError("Signup successful. Check your email to confirm your account before logging in.");
      return;
    }

    const userProfile = {
      id: data.user?.id,
      name,
      username,
      email,
      phone,
      address,
      dob,
    };

    localStorage.setItem("user", JSON.stringify(userProfile));

    navigate("/home");
  } catch (error) {
    setSignupError(error.message || "Signup failed.");
  } 
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .signup {
          height: 100vh;
          width: 100vw;
          background-image: url('https://resources.travellocal.com/wp/uploads/2023/09/10132016/South-Africa-landscape-un-scaled.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Decorative overlay */
        .signup::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.74);
        }

        .signup::after {
          content: '';
          position: absolute;
          width: 420px;
          height: 420px;
          background: rgba(255, 119, 0, 0.08);
          border-radius: 50%;
          bottom: -180px;
          left: -160px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(18px);
          border-radius: 32px;
          box-shadow: 0 35px 90px -30px rgba(15, 23, 42, 0.45);
          width: 100%;
          max-width: 1100px;
          height: auto;
          max-height: 85vh;
          padding: 2.5rem 3rem;
          animation: slideUp 0.5s ease-out;
          position: relative;
          z-index: 1;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        /* Custom scrollbar - minimal */
        .auth-card::-webkit-scrollbar {
          width: 5px;
        }

        .auth-card::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .auth-card::-webkit-scrollbar-thumb {
          background: #FF7700;
          border-radius: 10px;
        }

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

        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-card h1 {
          color: #004777;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        /* Form Layout */
        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          color: #004777;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-row {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #FF7700;
          font-size: 0.9rem;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .input-row input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
          background: white;
        }

        .input-row input:focus {
          border-color: #FF7700;
          box-shadow: 0 0 0 3px rgba(255, 119, 0, 0.1);
        }

        .input-row input:focus + .input-icon {
          color: #A30000;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #A30000;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #FF7700;
        }

        /* Error Message */
        .form-error {
          background: linear-gradient(135deg, #A30000 0%, #ff3333 100%);
          color: white;
          padding: 0.75rem;
          border-radius: 12px;
          margin: 1rem 0;
          text-align: center;
          font-size: 0.85rem;
          animation: shake 0.3s ease-out;
          font-weight: 500;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Submit Button */
        .submit-btn {
          background: linear-gradient(135deg, #FF7700 0%, #A30000 100%);
          color: white;
          border: none;
          padding: 0.875rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(255, 119, 0, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .footer p {
          color: #666;
          font-size: 0.85rem;
        }

        .footer a {
          color: #FF7700;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .footer a:hover {
          color: #A30000;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .auth-card {
            padding: 1.5rem;
            max-height: 90vh;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-group.full-width {
            grid-column: span 1;
          }

          .auth-card h1 {
            font-size: 1.75rem;
          }

          .input-row input {
            padding: 0.7rem 1rem 0.7rem 2.3rem;
            font-size: 0.85rem;
          }
        }

        @media (min-width: 1600px) {
          .auth-card {
            max-width: 1200px;
            padding: 3rem 3.5rem;
          }

          .auth-card h1 {
            font-size: 2.5rem;
          }

          .form-grid {
            gap: 1.5rem;
          }

          .input-row input {
            padding: 0.875rem 1rem 0.875rem 2.75rem;
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="signup">
        <div className="auth-card">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="rounded-3xl bg-slate-950/95 p-8 text-white flex flex-col justify-between">
              <div>
                <span className="inline-flex rounded-full bg-[#FF7700]/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#FF7700] font-semibold">
                  Travel Club
                </span>
                <h1 className="mt-6 text-4xl font-bold">Create your travel passport</h1>
                <p className="mt-4 text-slate-300 leading-7">
                  Sign up to access curated trips, exclusive offers, and easy booking for your next Ethiopian adventure.
                </p>
              </div>
              <div className="mt-10 space-y-4 text-slate-300">
                <p className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Personalized destination guides</p>
                <p className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Fast booking and secure profiles</p>
                <p className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#FF7700]" /> Local culture recommendations</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="header-section">
                <h1>Create Your Traveler Account</h1>
                <p className="subtitle">Join now and explore the world with personalized trips.</p>
              </div>

              <form noValidate onSubmit={handleSignup} className="auth-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-row">
                  <FaUserAlt className="input-icon" />
                  <input 
                    type="text" 
                    value={name} 
                    id="name" 
                    name="name" 
                    placeholder="Name" 
                    pattern="[A-Za-z]{3,100}" 
                    required 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-row">
                  <FaUserAlt className="input-icon" />
                  <input 
                    type="text" 
                    value={username} 
                    id="username" 
                    name="username" 
                    placeholder="Username" 
                    required 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-row">
                  <FaEnvelope className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    id="email" 
                    name="email" 
                    placeholder="name@example.com" 
                    required 
                    pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$" 
                    title="Use a valid gmail.com or yahoo.com address" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-row">
                  <FaPhoneAlt className="input-icon" />
                  <input 
                    type="tel" 
                    value={phone} 
                    id="phone" 
                    name="phone" 
                    placeholder="0912345678" 
                    pattern="[0-9]{10}" 
                    title="Must contain a 10 digit number" 
                    required 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <div className="input-row">
                  <FaMapMarkerAlt className="input-icon" />
                  <input 
                    type="text" 
                    value={address} 
                    id="address" 
                    name="address" 
                    placeholder="123 Main St, City, Country" 
                    required 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <div className="input-row">
                  <FaCalendarAlt className="input-icon" />
                  <input 
                    type="date" 
                    value={dob} 
                    id="dob" 
                    name="dob" 
                    required 
                    onChange={(e) => setDob(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-row">
                  <FaLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    id="password" 
                    name="password" 
                    placeholder="Create a strong password" 
                    required 
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$" 
                    title="At least 8 characters, including uppercase, lowercase, number, and special character" 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {signupError && <p className="form-error">{signupError}</p>}
            
            <button type="submit" className="submit-btn">
              Sign Up <FaArrowRight size={14} />
            </button>

            <div className="footer">
              <p>Already have an account?{""} <Link to="/login">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </>
  );
}

export default Signup;
