import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import autoImage from "../assets/auto-rickshaw.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setRegisterError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setRegisterError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Name validation
    if (!trimmedName) {
      setRegisterError("Please enter your name.");
      return;
    }

    // Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(trimmedEmail)) {
      setEmailError(
        "Please enter a valid Gmail address, e.g. example@gmail.com"
      );
      return;
    }

    // Password validation
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://https://faremate-backend.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(
          data.message || "Registration failed. Please try again."
        );
        return;
      }

      // Save JWT token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Registration successful
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setRegisterError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2">

        {/* Left - Branding */}
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

          {/* Image */}
          <div className="relative z-10 pt-8">
            <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg">
              <img
                src={autoImage}
                alt="Indian Street Auto Rickshaws Transit"
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right - Register */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">
              Create Your Account
            </h3>

            <p className="text-xs text-slate-500">
              Enter your details to create your FareMate account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setRegisterError("");
                }}
                placeholder="e.g. Alice"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Email */}
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
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white ${
                  emailError
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200 focus:ring-blue-500"
                }`}
              />

              {emailError && (
                <p className="text-red-500 text-xs mt-1.5">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
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
                    setPasswordError("");
                    setRegisterError("");
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white ${
                    passwordError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-200 focus:ring-blue-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                    setRegisterError("");
                  }}
                  placeholder="Confirm your password"
                  className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white ${
                    passwordError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-200 focus:ring-blue-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Backend Error */}
            {registerError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                {registerError}
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />

              <p className="text-slate-500 leading-relaxed">
                By creating an account, you agree to use FareMate
                responsibly and provide accurate information.
              </p>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>
                {loading ? "Creating Account..." : "Create Account"}
              </span>

              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>

          {/* Login */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-bold hover:underline"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;