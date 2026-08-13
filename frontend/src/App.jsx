import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import RoutePage from "./pages/RoutePage";
import Community from "./pages/Community";
import RouteDetail from "./pages/RouteDetail";
import ReportFare from "./pages/ReportFare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />

        <Route path="/routes" element={<RoutePage />} />

        <Route path="/routes/:id" element={<RouteDetail />} />

        <Route path="/report-fare" element={<ReportFare />} />

        <Route path="/community" element={<Community />} />

        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute> }/>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;