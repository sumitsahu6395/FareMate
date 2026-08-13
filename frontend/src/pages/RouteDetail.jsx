import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format fare
  const formatFare = (fare) => {
    if (fare === undefined || fare === null || fare === "") {
      return "N/A";
    }

    const fareText = String(fare).trim();

    return fareText.startsWith("₹") ? fareText : `₹${fareText}`;
  };

  // Fare label
  const getFareLabel = () => {
    if (!route) return "Fare";

    if (route.vehicleType === "Private Auto") {
      return "Negotiable Fare";
    }

    return "Per Seat Fare";
  };

  // Fetch selected route from MongoDB
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://faremate-backend.onrender.com/api/routes/${id}`
        );

        if (!response.ok) {
          throw new Error("Route not found");
        }

        const data = await response.json();

        setRoute(data);
      } catch (error) {
        console.error("Route detail error:", error);
        setError("The route you are looking for does not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoute();
    } else {
      setLoading(false);
      setError("Invalid route ID.");
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />

          <p className="text-sm font-semibold text-slate-700">
            Loading route details...
          </p>
        </div>
      </div>
    );
  }

  // Error / route not found
  if (error || !route) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900">
            Route not found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error || "The route you are looking for does not exist."}
          </p>

          <button
            onClick={() => navigate("/routes")}
            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Back to Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back */}
        <button
          onClick={() => navigate("/routes")}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Fare Estimate
          </h1>

          <p className="text-slate-500 font-medium text-sm mt-1">
            {route.pickup} → {route.destination}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">

            {/* Fare */}
            <div className="flex justify-between items-start gap-4">

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Approximate Fare
                </span>

                <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight mt-1">
                  {formatFare(route.fare)}
                </div>
              </div>

              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                  route.isVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    : "bg-amber-50 text-amber-700 border border-amber-200/80"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />

                <span>
                  {route.isVerified
                    ? "Verified Estimate"
                    : "Estimate"}
                </span>
              </span>
            </div>

            {/* Verification */}
            <div
              className={`flex items-center space-x-2 text-xs font-semibold p-2.5 rounded-xl border ${
                route.isVerified
                  ? "text-emerald-700 bg-emerald-50/60 border-emerald-100"
                  : "text-amber-700 bg-amber-50/60 border-amber-100"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  route.isVerified
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              />

              <span>
                {route.isVerified
                  ? "Based on verified local route data and community reports"
                  : "Based on available local route data"}
              </span>
            </div>

            {/* Route Details */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 text-center">

              {/* Vehicle */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Vehicle
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {route.vehicleType || "Not specified"}
                </span>
              </div>

              {/* Distance */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Distance
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {route.distance || "Not specified"}
                </span>
              </div>

              {/* Time */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Time
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {route.time || "Not specified"}
                </span>
              </div>

            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <button
                onClick={() => navigate("/routes")}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
              >
                Search another route
              </button>

              <button
                onClick={() => navigate("/report-fare")}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-blue-700 font-bold text-sm rounded-xl border border-slate-300 shadow-sm transition-colors"
              >
                Report incorrect fare
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">

              <h3 className="text-lg font-bold text-slate-900">
                Route Details
              </h3>

              <span className="text-xs text-slate-400 font-medium">
                1 available option
              </span>

            </div>

            {/* Timeline */}
            <div className="space-y-6 pl-2 relative">

              {/* Pickup */}
              <div className="flex items-start space-x-3">

                <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {route.pickup}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Pickup Location
                  </p>
                </div>

              </div>

              {/* Connecting Line */}
              <div className="absolute left-[15px] top-[20px] bottom-[20px] w-0.5 border-l-2 border-dashed border-slate-300" />

              {/* Destination */}
              <div className="flex items-start space-x-3">

                <MapPin className="w-4 h-4 text-red-600 fill-red-100 shrink-0 mt-0.5" />

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {route.destination}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Destination
                  </p>
                </div>

              </div>

            </div>

            {/* Vehicle Rate */}
            <div className="pt-4 space-y-3">

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vehicle Fare
              </h4>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {route.vehicleType || "Vehicle"}
                  </div>

                  <div className="text-xs text-slate-500">
                    {route.time || "Time not specified"}
                  </div>
                </div>

                <div className="text-right">

                  <div className="text-base font-extrabold text-slate-900">
                    {formatFare(route.fare)}
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium">
                    {getFareLabel()}
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteDetail;