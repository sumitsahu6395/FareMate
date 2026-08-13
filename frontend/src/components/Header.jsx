import fareMateLogo from "../assets/faremate-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check whether user is logged in
  const token = localStorage.getItem("token");

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Go to login page
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-left group"
          >
            <img
              src={fareMateLogo}
              alt="FareMate"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">

            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600 bg-blue-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/routes"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/routes")
                  ? "text-blue-600 bg-blue-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Routes
            </Link>

            <Link
              to="/report-fare"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/report-fare")
                  ? "text-blue-600 bg-blue-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Report Fare
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-blue-600 bg-blue-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              About
            </Link>

          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">

            {token ? (
              <>
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;