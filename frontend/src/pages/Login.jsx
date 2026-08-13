import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import autoImage from "../assets/auto-rickshaw.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const validateEmail = (value) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(value)) {
      return "Please enter a valid Gmail address.";
    }

    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);
    setLoginError("");

    if (value) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError("");

    // Gmail validation
    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(
          data.message || "Invalid email or password"
        );
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setLoginError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">

      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2">

        {/* LEFT - BRANDING */}
        <div className="bg-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">

          <div className="relative z-10 space-y-6">

            <div className="flex items-center space-x-2">

              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>

              <span className="text-xl font-bold tracking-tight">
                FareMate
              </span>

            </div>

            <div className="space-y-3 pt-6">

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Travel smarter.
                <br />

                <span className="text-blue-400">
                  Know your fare.
                </span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Your reliable companion for accurate, real-time
                transportation costs across India.
              </p>

            </div>

          </div>

          {/* IMAGE */}
          <div className="relative z-10 pt-8">

            <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg">

              <img
                src={autoImage}
                alt="Indian Street Auto Rickshaws Transit"
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />

            </div>

          </div>

          {/* BACKGROUND DECORATION */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        </div>

        {/* RIGHT - LOGIN */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">

          <div className="space-y-2">

            <h3 className="text-2xl font-bold text-slate-900">
              Welcome Back
            </h3>

            <p className="text-xs text-slate-500">
              Please enter your details to sign in.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="e.g. name@gmail.com"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                  emailError
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200"
                }`}
              />

              {/* EMAIL ERROR */}
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {emailError}
                </p>
              )}

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >

                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}

                </button>

              </div>

            </div>

            {/* LOGIN ERROR */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600 font-medium">
                  {loginError}
                </p>
              </div>
            )}

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-xs">

              <label className="flex items-center space-x-2 cursor-pointer">

                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
                />

                <span className="text-slate-600 font-medium">
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot password?
              </button>

            </div>

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
            >

              <span>
                {loading ? "Signing In..." : "Sign In"}
              </span>

              {!loading && (
                <ArrowRight className="w-4 h-4" />
              )}

            </button>

          </form>

          {/* REGISTER */}
          <div className="text-center pt-2 border-t border-slate-100">

            <p className="text-xs text-slate-500">

              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 font-bold hover:underline"
              >
                Register
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;