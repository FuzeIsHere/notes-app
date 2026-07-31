import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from './pages/Home'
import Dashboard from "./pages/Dashboard"
import NotFound from './pages/NotFound'

import ViewNote from './pages/ViewNote'
import EditNote from './pages/EditNote'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <ViewNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id/edit"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
