import autoImage from "../assets/auto-rickshaw.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ArrowUpDown,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Users,
  Map,
  ArrowRight,
  Zap,
  Navigation,
} from "lucide-react";

const popularRoutes = [
  {
    id: "1",
    pickup: "Charbagh",
    destination: "Hazratganj",
    distanceKm: 5,
    minFare: 15,
    maxFare: 20,
    isVerified: true,
  },
  {
    id: "2",
    pickup: "Polytechnic",
    destination: "Engineering College",
    distanceKm: 3.5,
    minFare: 10,
    maxFare: 15,
    isVerified: true,
  },
  {
    id: "3",
    pickup: "BBD",
    destination: "Kamta",
    distanceKm: 6,
    minFare: 10,
    maxFare: 20,
    isVerified: true,
  },
];

function Home() {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  // Only Shared Auto and E-Rickshaw
  const [selectedVehicle, setSelectedVehicle] =
    useState("Shared Auto");

  // =========================
  // SEARCH
  // =========================
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const cleanPickup = pickup.trim();
    const cleanDestination = destination.trim();

    if (!cleanPickup || !cleanDestination) {
      alert("Please enter pickup and destination");
      return;
    }

    // Send search data to Routes page
    navigate(
      `/routes?pickup=${encodeURIComponent(
        cleanPickup
      )}&destination=${encodeURIComponent(
        cleanDestination
      )}&vehicleType=${encodeURIComponent(
        selectedVehicle
      )}`
    );
  };

  // =========================
  // SWAP PICKUP / DESTINATION
  // =========================
  const handleSwap = () => {
    const temp = pickup;

    setPickup(destination);
    setDestination(temp);
  };

  // =========================
  // POPULAR ROUTE SEARCH
  // =========================
  const handlePopularRoute = (route) => {
    navigate(
      `/routes?pickup=${encodeURIComponent(
        route.pickup
      )}&destination=${encodeURIComponent(
        route.destination
      )}&vehicleType=${encodeURIComponent(
        selectedVehicle
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative pt-8 pb-16 md:py-20 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* ================= LEFT COLUMN ================= */}
            <div className="lg:col-span-6 space-y-6">

              <div>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 mb-4">
                  India's Reliable Fare Engine
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">

                  Know Your Fare.
                  <br />

                  <span className="text-blue-600">
                    Ride with Confidence.
                  </span>

                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Transparent pricing for Shared Autos,
                  E-Rickshaws, and local transit across
                  Indian cities. Stop guessing, start verifying.
                </p>

              </div>

              {/* ================= SEARCH CARD ================= */}
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100">

                {/* Vehicle Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-5 space-x-1">

                  {["Shared Auto", "E-Rickshaw"].map((vehicle) => (

                    <button
                      key={vehicle}
                      type="button"
                      onClick={() =>
                        setSelectedVehicle(vehicle)
                      }
                      className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                        selectedVehicle === vehicle
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {vehicle}
                    </button>

                  ))}

                </div>

                {/* Search Form */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="space-y-3 relative"
                >

                  {/* Pickup */}
                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">

                      <div className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center">

                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />

                      </div>

                    </div>

                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) =>
                        setPickup(e.target.value)
                      }
                      placeholder="Where from? (e.g. BBD)"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />

                  </div>

                  {/* Swap Button */}
                  <div className="relative flex justify-center">

                    <button
                      type="button"
                      onClick={handleSwap}
                      className="absolute -top-1 z-10 w-10 h-10 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Swap locations"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>

                  </div>

                  {/* Destination */}
                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">

                      <MapPin className="w-4 h-4" />

                    </div>

                    <input
                      type="text"
                      value={destination}
                      onChange={(e) =>
                        setDestination(e.target.value)
                      }
                      placeholder="Where to? (e.g. Matyari)"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />

                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Fare
                  </button>

                </form>

              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Transparency First</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Routes</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Community Powered</span>
                </div>

              </div>

            </div>

            {/* ================= RIGHT IMAGE ================= */}
            <div className="lg:col-span-6">

              <div className="relative group">

                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">

                  <img
                    src={autoImage}
                    alt="Indian Street Auto Rickshaws Transit"
                    className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />

                  {/* Floating Fare Card */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 max-w-xs">

                    <div className="flex items-center space-x-2 mb-1">

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 tracking-wider">
                        LOWEST FARE
                      </span>

                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Shared Auto
                    </div>

                    <div className="flex items-baseline space-x-2 mt-1">

                      <span className="text-2xl font-extrabold text-slate-900">
                        ₹5
                      </span>

                      <span className="text-xs text-slate-500 font-medium">
                        /seat
                      </span>

                      <span className="text-slate-300 mx-1">
                        |
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        Est. Time: 12 mins
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          POPULAR ROUTES
      ===================================================== */}
      <section className="py-12 bg-white border-y border-slate-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Popular Routes
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Frequently searched routes in your city.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/routes")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {popularRoutes.map((route) => (

              <button
                key={route.id}
                type="button"
                onClick={() =>
                  handlePopularRoute(route)
                }
                className="text-left bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all"
              >

                <div className="flex items-center justify-between mb-4">

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    {route.isVerified
                      ? "Verified"
                      : "Estimated"}
                  </span>

                  <span className="text-lg font-extrabold text-blue-600">
                    ₹{route.minFare}-{route.maxFare}
                  </span>

                </div>

                <div className="space-y-2">

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">

                    <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400" />

                    {route.pickup}

                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">

                    <MapPin className="w-4 h-4 text-blue-600" />

                    {route.destination}

                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">

                  <span>Shared Auto</span>

                  <span>
                    {route.distanceKm} km
                  </span>

                </div>

              </button>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;