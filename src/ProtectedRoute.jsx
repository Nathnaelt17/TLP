import { Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext.jsx"

export default function ProtectedRoute({ children, redirectPath = "/login" }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return null
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  return children
}
