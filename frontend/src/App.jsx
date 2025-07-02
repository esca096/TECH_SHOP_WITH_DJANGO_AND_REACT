import Ract from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import AuthPage from "./pages/AuthPage"
import { useAuthentication } from "./auth"
import RedirectGoogleAuth from "./components/GoogleRedirectHandler"
import Dashboard from "./components/Dashboard"
import AdminProductList from "./components/AdminProductList"
import { ToastContainer } from "react-toastify"
import AdminProductEdit from "./components/AdminProductEdit"

function App() {
  
  const { isAuthorized } = useAuthentication()
  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to='/dashboard' /> : <AuthPage initialMethod='login' />
  }
  const ProtectedRegister = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='register' />
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <ToastContainer /> {/* ToastContainer is used to display toast notifications */}
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="/dashboard" element={isAuthorized? <Dashboard /> : <Navigate to='/login' />} />
          <Route path="/api/products" element={<AdminProductList />} />
          <Route path="/api/products/:id" element={<AdminProductEdit />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
