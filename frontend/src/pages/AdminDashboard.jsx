import { useEffect, useState } from "react";

import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ShieldCheck,
  MapPin,
  Car,
  IndianRupee,
  CalendarDays,
  Ruler,
  FileText,
  Pencil,
  Trash2,
  Save,
  X,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

function AdminDashboard() {
  // ==========================================
  // REPORT STATES
  // ==========================================

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // ROUTE STATES
  // ==========================================

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  // Search
  const [routeSearch, setRouteSearch] = useState("");

  // Pagination
  const [routePage, setRoutePage] = useState(1);

  const routesPerPage = 20;

  // Edit
  const [editingRouteId, setEditingRouteId] = useState(null);

  const [editFare, setEditFare] = useState("");
  const [editDistance, setEditDistance] = useState("");
  const [editTime, setEditTime] = useState("");

  const [routeError, setRouteError] = useState("");
  const [routeActionLoading, setRouteActionLoading] =
    useState("");

  // ==========================================
  // ADMIN TOKEN
  // ==========================================

  const token = localStorage.getItem("adminToken");

  const handleAdminLogout = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
};

  // ==========================================
  // FETCH PENDING REPORTS
  // ==========================================

  const fetchPendingReports = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await fetch(
        "https://faremate-backend.onrender.com/api/reports/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reports"
        );
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error("Fetch reports error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ALL ROUTES
  // SEARCH
  // ==========================================

  const fetchRoutes = async (search = "") => {
    try {
      setRoutesLoading(true);
      setRouteError("");

      const response = await fetch(
        "https://faremate-backend.onrender.com/api/routes"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch routes"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid routes response format"
        );
      }

      const searchText = search
        .trim()
        .toLowerCase();

      const filteredRoutes = searchText
        ? data.filter((route) => {
            const pickup = String(
              route.pickup || ""
            ).toLowerCase();

            const destination = String(
              route.destination || ""
            ).toLowerCase();

            const vehicleType = String(
              route.vehicleType || ""
            ).toLowerCase();

            const city = String(
              route.city || ""
            ).toLowerCase();

            return (
              pickup.includes(searchText) ||
              destination.includes(searchText) ||
              vehicleType.includes(searchText) ||
              city.includes(searchText)
            );
          })
        : data;

      setRoutes(filteredRoutes);

      console.log(
        "TOTAL ROUTES:",
        data.length
      );

      console.log(
        "SEARCHED ROUTES:",
        filteredRoutes.length
      );
    } catch (error) {
      console.error(
        "Fetch routes error:",
        error
      );

      setRouteError(error.message);
      setRoutes([]);
    } finally {
      setRoutesLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchPendingReports();
    fetchRoutes("");
  }, []);

  // ==========================================
  // PAGINATION CALCULATIONS
  // ==========================================

  const totalRoutes = routes.length;

  const totalPages = Math.max(
    Math.ceil(
      totalRoutes / routesPerPage
    ),
    1
  );

  const startIndex =
    (routePage - 1) * routesPerPage;

  const endIndex =
    startIndex + routesPerPage;

  const currentRoutes = routes.slice(
    startIndex,
    endIndex
  );

  // ==========================================
  // APPROVE / REJECT REPORT
  // ==========================================

  const handleAction = async (
    reportId,
    action
  ) => {
    try {
      setActionLoading(reportId);
      setError("");

      const response = await fetch(
        `https://faremate-backend.onrender.com/api/reports/${reportId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${action} report`
        );
      }

      // Remove processed report
      setReports((currentReports) =>
        currentReports.filter(
          (report) =>
            report._id !== reportId
        )
      );

      // Refresh routes after approval
      if (action === "approve") {
        await fetchRoutes(routeSearch);
        setRoutePage(1);
      }
    } catch (error) {
      console.error(
        `${action} report error:`,
        error
      );

      setError(error.message);
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const startEdit = (route) => {
    setEditingRouteId(route._id);

    setEditFare(route.fare || "");

    setEditDistance(
      route.distance || ""
    );

    setEditTime(route.time || "");

    setRouteError("");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setEditingRouteId(null);

    setEditFare("");
    setEditDistance("");
    setEditTime("");

    setRouteError("");
  };

  // ==========================================
  // UPDATE ROUTE
  // ==========================================

  const handleUpdateRoute = async (
    routeId
  ) => {
    if (!editFare.trim()) {
      setRouteError(
        "Please enter fare."
      );
      return;
    }

    if (!editDistance.trim()) {
      setRouteError(
        "Please enter distance."
      );
      return;
    }

    if (!editTime.trim()) {
      setRouteError(
        "Please enter travel time."
      );
      return;
    }

    try {
      setRouteActionLoading(routeId);
      setRouteError("");

      const response = await fetch(
        `https://faremate-backend.onrender.com/api/routes/${routeId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            fare: editFare.trim(),

            distance:
              editDistance.trim(),

            time: editTime.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update route"
        );
      }

      // Update current route
      setRoutes((currentRoutes) =>
        currentRoutes.map((route) =>
          route._id === routeId
            ? data.route
            : route
        )
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Update route error:",
        error
      );

      setRouteError(error.message);
    } finally {
      setRouteActionLoading("");
    }
  };

  // ==========================================
  // DELETE ROUTE
  // ==========================================

  const handleDeleteRoute = async (
    routeId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this route?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setRouteActionLoading(routeId);
      setRouteError("");

      const response = await fetch(
        `https://faremate-backend.onrender.com/api/routes/${routeId}`,
        {
          method: "DELETE",
          headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete route"
        );
      }

      const updatedRoutes =
        routes.filter(
          (route) =>
            route._id !== routeId
        );

      setRoutes(updatedRoutes);

      // If current page becomes empty
      const newTotalPages = Math.max(
        Math.ceil(
          updatedRoutes.length /
            routesPerPage
        ),
        1
      );

      if (
        routePage > newTotalPages
      ) {
        setRoutePage(
          newTotalPages
        );
      }
    } catch (error) {
      console.error(
        "Delete route error:",
        error
      );

      setRouteError(error.message);
    } finally {
      setRouteActionLoading("");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleRouteSearch = async () => {
    setRoutePage(1);

    await fetchRoutes(
      routeSearch
    );
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch = async () => {
    setRouteSearch("");
    setRoutePage(1);

    await fetchRoutes("");
  };

  // ==========================================
  // PREVIOUS PAGE
  // ==========================================

  const handlePreviousPage = () => {
    if (routePage <= 1) {
      return;
    }

    setRoutePage(
      (currentPage) =>
        currentPage - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // NEXT PAGE
  // ==========================================

  const handleNextPage = () => {
    if (
      routePage >= totalPages
    ) {
      return;
    }

    setRoutePage(
      (currentPage) =>
        currentPage + 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // PAGE NUMBER
  // ==========================================

  const handlePageChange = (
    page
  ) => {
    setRoutePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  const getPageNumbers = () => {
    const pages = [];

    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (routePage > 3) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      routePage - 1
    );

    const end = Math.min(
      totalPages - 1,
      routePage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (
      routePage <
      totalPages - 2
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // ==========================================
  // ADMIN TOKEN CHECK
  // ==========================================

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-slate-900">
            Admin Login Required
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please login as an administrator
            to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

  <div>
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-7 h-7 text-blue-600" />

      <h1 className="text-3xl font-extrabold text-slate-900">
        Admin Dashboard
      </h1>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Review reports and manage routes.
    </p>
  </div>

  {/* RIGHT SIDE BUTTONS */}
  <div className="flex items-center gap-2">

    <button
      onClick={() => {
        fetchPendingReports();
        fetchRoutes();
      }}
      disabled={loading || routesLoading}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
    >
      <RefreshCw
        className={`w-4 h-4 ${
          loading || routesLoading ? "animate-spin" : ""
        }`}
      />
      Refresh
    </button>

    <button
      onClick={handleAdminLogout}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 hover:bg-red-100 transition"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>

  </div>

</div>
      

        {/* ==========================================
            REPORT ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ==========================================
            PENDING REPORT STATS
        ========================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Reports
          </div>

          <div className="text-4xl font-extrabold text-blue-600 mt-1">
            {reports.length}
          </div>
        </div>

        {/* ==========================================
            REPORT LOADING
        ========================================== */}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <RefreshCw className="w-7 h-7 text-blue-600 animate-spin mx-auto" />

            <p className="text-sm font-semibold text-slate-600 mt-3">
              Loading pending reports...
            </p>
          </div>
        )}

        {/* ==========================================
            EMPTY REPORT
        ========================================== */}

        {!loading &&
          reports.length === 0 &&
          !error && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />

              <h2 className="text-xl font-bold text-slate-900 mt-4">
                No Pending Reports
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                All fare reports have been reviewed.
              </p>

            </div>
          )}

        {/* ==========================================
            REPORTS
        ========================================== */}

        {!loading &&
          reports.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {reports.map(
                (report) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >

                    {/* Header */}

                    <div className="p-5 border-b border-slate-100">

                      <div className="flex items-start gap-2">

                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="font-bold text-slate-900">
                            {report.pickup}
                          </h2>

                          <span className="text-slate-400">
                            →
                          </span>

                          <h2 className="font-bold text-slate-900">
                            {report.destination}
                          </h2>

                        </div>
                      </div>

                      <span className="inline-flex mt-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                        Pending Review
                      </span>

                    </div>

                    {/* Details */}

                    <div className="p-5 grid grid-cols-2 gap-4">

                      <div className="flex items-center gap-3">

                        <Car className="w-4 h-4 text-slate-400" />

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Vehicle
                          </div>

                          <div className="text-sm font-bold text-slate-900">
                            {report.vehicleType}
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <IndianRupee className="w-4 h-4 text-slate-400" />

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Fare
                          </div>

                          <div className="text-sm font-bold text-slate-900">
                            ₹{report.farePaid}
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <Ruler className="w-4 h-4 text-slate-400" />

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Distance
                          </div>

                          <div className="text-sm font-bold text-slate-900">
                            {report.distance ||
                              "Not specified"}
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <CalendarDays className="w-4 h-4 text-slate-400" />

                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">
                            Travel Date
                          </div>

                          <div className="text-sm font-bold text-slate-900">
                            {report.travelDate}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Notes */}

                    {report.notes && (
                      <div className="mx-5 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">

                        <div className="flex items-center gap-2 mb-1">

                          <FileText className="w-4 h-4 text-slate-400" />

                          <span className="text-xs font-bold text-slate-500">
                            Notes
                          </span>

                        </div>

                        <p className="text-sm text-slate-700">
                          {report.notes}
                        </p>

                      </div>
                    )}

                    {/* Actions */}

                    <div className="p-5 border-t border-slate-100 grid grid-cols-2 gap-3">

                      <button
                        onClick={() =>
                          handleAction(
                            report._id,
                            "approve"
                          )
                        }
                        disabled={
                          actionLoading ===
                          report._id
                        }
                        className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />

                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleAction(
                            report._id,
                            "reject"
                          )
                        }
                        disabled={
                          actionLoading ===
                          report._id
                        }
                        className="py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />

                        Reject
                      </button>

                    </div>
                  </div>
                )
              )}

            </div>
          )}

        {/* ==========================================
            MANAGE ROUTES
        ========================================== */}

        <div className="mt-12">

          {/* Manage Routes Header */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Manage Routes
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search, edit or delete routes.
              </p>
            </div>

            {/* Total Routes */}

            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl">

              <span className="text-xs font-bold text-slate-400">
                Total Routes
              </span>

              <span className="ml-2 text-lg font-extrabold text-blue-600">
                {totalRoutes}
              </span>

            </div>

          </div>

          {/* ==========================================
              SEARCH
          ========================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">

            <div className="flex flex-col md:flex-row gap-3">

              <div className="relative flex-1">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  value={routeSearch}
                  onChange={(e) =>
                    setRouteSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleRouteSearch();
                    }
                  }}
                  placeholder="Search pickup, destination, vehicle or city..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              <button
                onClick={
                  handleRouteSearch
                }
                disabled={routesLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
              >
                <Search className="w-4 h-4" />

                Search
              </button>

              {routeSearch && (
                <button
                  onClick={
                    handleClearSearch
                  }
                  disabled={
                    routesLoading
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />

                  Clear
                </button>
              )}

            </div>

            {/* Search result info */}

            <div className="mt-3 text-xs text-slate-500">

              {routeSearch ? (
                <>
                  Search results for{" "}
                  <span className="font-bold text-slate-700">
                    "{routeSearch}"
                  </span>
                  :{" "}
                  <span className="font-bold text-blue-600">
                    {totalRoutes}
                  </span>{" "}
                  routes
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {totalRoutes}
                  </span>{" "}
                  routes
                </>
              )}

            </div>

          </div>

          {/* Route Error */}

          {routeError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {routeError}
            </div>
          )}

          {/* ==========================================
              ROUTES LOADING
          ========================================== */}

          {routesLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

              <RefreshCw className="w-7 h-7 text-blue-600 animate-spin mx-auto" />

              <p className="text-sm font-semibold text-slate-600 mt-3">
                Loading routes...
              </p>

            </div>
          )}

          {/* ==========================================
              NO ROUTES
          ========================================== */}

          {!routesLoading &&
            totalRoutes === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />

                <h3 className="text-lg font-bold text-slate-900 mt-3">
                  No Routes Found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {routeSearch
                    ? "No routes match your search."
                    : "There are no routes available yet."}
                </p>

              </div>
            )}

          {/* ==========================================
              ROUTE LIST
          ========================================== */}

          {!routesLoading &&
            currentRoutes.length > 0 && (
              <div className="space-y-4">

                {currentRoutes.map(
                  (route) => (
                    <div
                      key={route._id}
                      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                    >

                      {/* Route Information */}

                      <div className="p-5">

                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                          {/* Route */}

                          <div className="flex-1 min-w-0">

                            <div className="flex items-start gap-2">

                              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="font-bold text-slate-900 break-words">
                                  {route.pickup}
                                </span>

                                <span className="text-slate-400">
                                  →
                                </span>

                                <span className="font-bold text-slate-900 break-words">
                                  {route.destination}
                                </span>

                              </div>

                            </div>

                            {/* Badges */}

                            <div className="flex flex-wrap items-center gap-3 mt-3">

                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">

                                <Car className="w-3.5 h-3.5" />

                                {route.vehicleType}
                              </span>

                              <span className="text-xs text-slate-500">
                                {route.city ||
                                  "Lucknow"}
                              </span>

                              {route.isVerified && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                  Verified
                                </span>
                              )}

                            </div>

                          </div>

                          {/* ==================================
                              FARE
                          ================================== */}

                          <div className="w-full xl:w-[150px]">

                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">

                              <IndianRupee className="w-4 h-4" />

                              Fare

                            </div>

                            {editingRouteId ===
                            route._id ? (
                              <input
                                type="text"
                                value={editFare}
                                onChange={(e) =>
                                  setEditFare(
                                    e.target.value
                                  )
                                }
                                placeholder="₹15 - ₹20"
                                className="mt-1 w-full px-3 py-2 border border-blue-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-lg font-extrabold text-slate-900 mt-1">
                                {route.fare}
                              </div>
                            )}

                          </div>

                          {/* ==================================
                              DISTANCE
                          ================================== */}

                          <div className="w-full xl:w-[150px]">

                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">

                              <Ruler className="w-4 h-4" />

                              Distance

                            </div>

                            {editingRouteId ===
                            route._id ? (
                              <input
                                type="text"
                                value={
                                  editDistance
                                }
                                onChange={(e) =>
                                  setEditDistance(
                                    e.target.value
                                  )
                                }
                                placeholder="5 - 6 km"
                                className="mt-1 w-full px-3 py-2 border border-blue-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-lg font-extrabold text-slate-900 mt-1">
                                {route.distance}
                              </div>
                            )}

                          </div>

                          {/* ==================================
                              TIME
                          ================================== */}

                          <div className="w-full xl:w-[150px]">

                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">

                              <Clock className="w-4 h-4" />

                              Time

                            </div>

                            {editingRouteId ===
                            route._id ? (
                              <input
                                type="text"
                                value={editTime}
                                onChange={(e) =>
                                  setEditTime(
                                    e.target.value
                                  )
                                }
                                placeholder="20 - 30 min"
                                className="mt-1 w-full px-3 py-2 border border-blue-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="text-lg font-extrabold text-slate-900 mt-1">
                                {route.time}
                              </div>
                            )}

                          </div>

                          {/* ==================================
                              ACTIONS
                          ================================== */}

                          <div className="flex items-center gap-2 flex-wrap">

                            {editingRouteId ===
                            route._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateRoute(
                                      route._id
                                    )
                                  }
                                  disabled={
                                    routeActionLoading ===
                                    route._id
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
                                >
                                  <Save className="w-4 h-4" />

                                  Save
                                </button>

                                <button
                                  onClick={
                                    cancelEdit
                                  }
                                  disabled={
                                    routeActionLoading ===
                                    route._id
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />

                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    startEdit(
                                      route
                                    )
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold transition"
                                >
                                  <Pencil className="w-4 h-4" />

                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteRoute(
                                      route._id
                                    )
                                  }
                                  disabled={
                                    routeActionLoading ===
                                    route._id
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-bold transition disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />

                                  Delete
                                </button>
                              </>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          {/* ==========================================
              PAGINATION
          ========================================== */}

          {!routesLoading &&
            totalRoutes > 0 && (
              <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* Showing */}

                  <div className="text-sm text-slate-500">

                    Showing{" "}

                    <span className="font-bold text-slate-800">
                      {startIndex + 1}
                    </span>

                    {" - "}

                    <span className="font-bold text-slate-800">
                      {Math.min(
                        endIndex,
                        totalRoutes
                      )}
                    </span>

                    {" of "}

                    <span className="font-bold text-blue-600">
                      {totalRoutes}
                    </span>

                    {" routes"}

                  </div>

                  {/* Pagination */}

                  <div className="flex items-center justify-center gap-1 flex-wrap">

                    {/* Previous */}

                    <button
                      onClick={
                        handlePreviousPage
                      }
                      disabled={
                        routePage === 1 ||
                        routesLoading
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />

                      Previous
                    </button>

                    {/* Page Numbers */}

                    {getPageNumbers().map(
                      (page, index) => {
                        if (
                          page === "..."
                        ) {
                          return (
                            <span
                              key={`dots-${index}`}
                              className="px-2 py-2 text-slate-400 font-bold"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() =>
                              handlePageChange(
                                page
                              )
                            }
                            className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-bold transition ${
                              routePage ===
                              page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}

                    {/* Next */}

                    <button
                      onClick={
                        handleNextPage
                      }
                      disabled={
                        routePage ===
                          totalPages ||
                        routesLoading
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next

                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </div>
            )}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;