import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Bookmark,
  Navigation,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    routesSearched: 0,
    fareReportsCount: 0,
    savedRouteIds: [],
  });

  const [loading, setLoading] = useState(true);

  const [recentSearches, setRecentSearches] = useState([]);
  const [fareReports, setFareReports] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      // Token nahi hai
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://faremate-backend.onrender.com/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // Token invalid/expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        // Backend se actual user
        setUser((prev) => ({
          ...prev,
          name: data.user?.name || "User",
        }));

        // Optional: localStorage user ko bhi update kar do
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Profile fetch error:", error);

        // Server/backend unavailable
        setUser((prev) => ({
          ...prev,
          name: "User",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
              Welcome back, {user.name}!
            </h1>

            <p className="text-slate-500 font-medium text-sm mt-1">
              Here is a summary of your recent mobility activity.
            </p>
          </div>

          <div className="flex items-center space-x-3">

            <button
              onClick={() => navigate("/routes")}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Fare</span>
            </button>

            <button
              onClick={() => navigate("/report-fare")}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Report Fare</span>
            </button>

          </div>
        </div>


        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Routes Searched */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">

            <div className="flex justify-between items-start">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Routes Searched
              </span>

              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>

            </div>

            <div className="text-4xl font-extrabold text-slate-900">
              {user.routesSearched}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Start searching routes
            </div>

          </div>


          {/* Fare Reports */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">

            <div className="flex justify-between items-start">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Fare Reports
              </span>

              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>

            </div>

            <div className="text-4xl font-extrabold text-slate-900">
              {user.fareReportsCount}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              No reports submitted yet
            </div>

          </div>


          {/* Saved Routes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">

            <div className="flex justify-between items-start">

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saved Routes
              </span>

              <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>

            </div>

            <div className="text-4xl font-extrabold text-slate-900">
              {user.savedRouteIds.length}
            </div>

            <button
              onClick={() => navigate("/routes")}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span>Explore routes</span>
              <ChevronRight className="w-3 h-3" />
            </button>

          </div>

        </div>


        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Recent Searches */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="text-base font-bold text-slate-900">
                Recent Searches
              </h3>

              <button
                onClick={() => navigate("/routes")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All
              </button>

            </div>


            {recentSearches.length === 0 ? (

              <div className="py-10 text-center">

                <Navigation className="w-8 h-8 text-slate-300 mx-auto mb-3" />

                <p className="text-sm font-semibold text-slate-600">
                  No recent searches
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Search for a route to see your activity here.
                </p>

                <button
                  onClick={() => navigate("/routes")}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Search Route
                </button>

              </div>

            ) : (

              <div className="space-y-3 mt-4">

                {recentSearches.map((item, index) => (

                  <div
                    key={index}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >

                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {item.pickup} → {item.destination}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {item.time}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-blue-600">
                        {item.fare}
                      </div>
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* Fare Reports */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="text-base font-bold text-slate-900">
                Your Fare Reports
              </h3>

              <button
                onClick={() => navigate("/report-fare")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Report Fare
              </button>

            </div>


            {fareReports.length === 0 ? (

              <div className="py-10 text-center">

                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />

                <p className="text-sm font-semibold text-slate-600">
                  No fare reports yet
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Your submitted fare reports will appear here.
                </p>

                <button
                  onClick={() => navigate("/report-fare")}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  Report a Fare
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto mt-4">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="pb-3">Route & Date</th>
                      <th className="pb-3">Fare Paid</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {fareReports.map((report) => (

                      <tr key={report.id}>

                        <td className="py-3.5">
                          <div className="font-bold text-slate-900">
                            {report.pickup} → {report.destination}
                          </div>

                          <div className="text-[11px] text-slate-400">
                            {report.travelDate}
                          </div>
                        </td>

                        <td className="py-3.5 font-bold">
                          ₹{report.farePaid}
                        </td>

                        <td className="py-3.5 text-right">

                          {report.status === "VERIFIED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              VERIFIED
                            </span>
                          )}

                          {report.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              <Clock className="w-3 h-3" />
                              PENDING
                            </span>
                          )}

                          {report.status === "FLAGGED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                              <AlertTriangle className="w-3 h-3" />
                              FLAGGED
                            </span>
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;