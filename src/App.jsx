import { Routes, Route } from "react-router-dom"
import Header from "./Header.jsx"
import Login from "./Login.jsx"
import Signup from "./Signup.jsx"
import Home from "./Home.jsx"
import Wishlist from "./Wishlist.jsx"
import ForgotPassword from "./ForgotPassword.jsx"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
