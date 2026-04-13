import { Routes, Route } from "react-router-dom"
import Login from "./Login.jsx"
import Signup from "./Signup.jsx"
import Home from "./Home.jsx" 
import ForgotPassword from "./ForgotPassword.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App
