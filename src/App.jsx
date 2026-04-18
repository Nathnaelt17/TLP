import { Route, Routes, useLocation } from "react-router-dom"
import Header from "./Header.jsx"
import Login from "./Login.jsx"
import Signup from "./Signup.jsx"
import Home from "./Home.jsx"
import Destinations from "./Landmark.jsx"
import DestinationDetail from "./DestinationDetail.jsx"
import Booking from "./Booking.jsx"
import Dashboard from "./Wishlist.jsx"
import Profile from "./Profile.jsx"
import ForgotPassword from "./ForgotPassword.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AdminDashboard from "./AdminDashboard.jsx"

function App() {
  const location = useLocation()
  const backgroundImage = "url('https://resources.travellocal.com/wp/uploads/2023/09/10132016/South-Africa-landscape-un-scaled.jpg')"
  
  // Logic to determine current route
  const isDashboardRoute = location.pathname === "/dashboard"
  const isAdminRoute = location.pathname === "/admin"
  const isHomeRoute = location.pathname === "/" || location.pathname === "/home"

  // If it's the Dashboard, Home, or Admin page, we remove the top padding (pt-28)
  const contentClassName = isDashboardRoute || isHomeRoute || isAdminRoute ? "" : "pt-28"

  return (
    <div
      className="relative min-h-screen bg-slate-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/70" />
      
      <div className={`relative z-10 ${contentClassName}`}>
        {/* Hide Header if on Dashboard OR Admin page */}
        {!isDashboardRoute && !isAdminRoute ? <Header /> : null}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  )
}

export default App