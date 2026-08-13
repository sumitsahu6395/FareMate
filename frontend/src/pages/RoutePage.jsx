import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  ArrowUpDown,
  Filter,
  ChevronRight,
  RefreshCw,
  Navigation,
  MapPin,
} from "lucide-react";

const recentSearches = [
  {
    pickup: "Charbagh",
    destination: "Hazratganj",
  },
  {
    pickup: "BBD",
    destination: "Kamta",
  },
];

function RoutePage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  // =====================================================
  // STATES
  // =====================================================

  const [routes, setRoutes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pickupInput, setPickupInput] = useState(
    searchParams.get("pickup") || ""
  );

  const [destInput, setDestInput] = useState(
    searchParams.get("destination") || ""
  );

  const initialVehicle =
    searchParams.get("vehicleType");

  const [filters, setFilters] = useState({
    vehicleTypes:
      initialVehicle === "E-Rickshaw"
        ? ["E-Rickshaw"]
        : ["Shared Auto", "E-Rickshaw"],

    maxFare: 200,

    distanceRange: "any",

    verifiedOnly: true,

    searchQueryPickup:
      searchParams.get("pickup") || "",

    searchQueryDestination:
      searchParams.get("destination") || "",
  });

  // =====================================================
  // FETCH ALL ROUTES
  // =====================================================

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/routes"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch routes"
          );
        }

        const data = await response.json();

        setRoutes(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Route fetch error:",
          err
        );

        setError(
          "Unable to load routes. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // =====================================================
  // UPDATE SEARCH FROM URL
  // =====================================================

  useEffect(() => {
    const pickup =
      searchParams.get("pickup") || "";

    const destination =
      searchParams.get("destination") || "";

    const vehicleType =
      searchParams.get("vehicleType") || "";

    setPickupInput(pickup);

    setDestInput(destination);

    setFilters((prev) => ({
      ...prev,

      vehicleTypes:
        vehicleType === "E-Rickshaw"
          ? ["E-Rickshaw"]
          : [
              "Shared Auto",
              "E-Rickshaw",
            ],

      searchQueryPickup: pickup,

      searchQueryDestination:
        destination,
    }));
  }, [searchParams]);

  // =====================================================
  // NORMALIZE LOCATION
  // =====================================================

  const normalizeLocation = (value) => {
    if (!value) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .trim()
      .replace(
        /[.,/#!$%^&*;:{}=\-_`~()]/g,
        ""
      )
      .replace(/\s+/g, "");
  };

  // =====================================================
  // LOCATION MATCH
  // =====================================================

  const locationMatches = (
    searchValue,
    routeValue
  ) => {
    const search =
      normalizeLocation(searchValue);

    const route =
      normalizeLocation(routeValue);

    if (!search) {
      return true;
    }

    return (
      route.includes(search) ||
      search.includes(route)
    );
  };

  // =====================================================
  // FARE HELPERS
  // =====================================================

  const getMinFare = (fare) => {
    if (!fare) {
      return 0;
    }

    const numbers =
      String(fare).match(/\d+/g);

    if (
      !numbers ||
      numbers.length === 0
    ) {
      return 0;
    }

    return Math.min(
      ...numbers.map(Number)
    );
  };

  const getMaxFare = (fare) => {
    if (!fare) {
      return 0;
    }

    const numbers =
      String(fare).match(/\d+/g);

    if (
      !numbers ||
      numbers.length === 0
    ) {
      return 0;
    }

    return Math.max(
      ...numbers.map(Number)
    );
  };

  // =====================================================
  // DISTANCE HELPER
  // =====================================================

  const getDistance = (distance) => {
    if (!distance) {
      return 0;
    }

    const numbers =
      String(distance).match(
        /\d+(?:\.\d+)?/g
      );

    if (
      !numbers ||
      numbers.length === 0
    ) {
      return 0;
    }

    if (numbers.length === 1) {
      return Number(numbers[0]);
    }

    return (
      (Number(numbers[0]) +
        Number(numbers[1])) /
      2
    );
  };

  // =====================================================
  // TIME HELPER
  // =====================================================

  const getTime = (time) => {
    if (!time) {
      return 0;
    }

    const numbers =
      String(time).match(
        /\d+(?:\.\d+)?/g
      );

    if (
      !numbers ||
      numbers.length === 0
    ) {
      return 0;
    }

    if (numbers.length === 1) {
      return Number(numbers[0]);
    }

    return (
      (Number(numbers[0]) +
        Number(numbers[1])) /
      2
    );
  };

  // =====================================================
  // SEARCH HANDLER
  // =====================================================

  const handleSearch = () => {
    const pickup =
      pickupInput.trim();

    const destination =
      destInput.trim();

    if (!pickup || !destination) {
      return;
    }

    setSearchParams({
      pickup,
      destination,
      vehicleType:
        filters.vehicleTypes.length === 1
          ? filters.vehicleTypes[0]
          : "",
    });
  };

  // =====================================================
  // SWAP LOCATIONS
  // =====================================================

  const handleSwap = () => {
    const oldPickup = pickupInput;

    setPickupInput(destInput);
    setDestInput(oldPickup);

    if (
      destInput.trim() &&
      oldPickup.trim()
    ) {
      setSearchParams({
        pickup: destInput.trim(),
        destination:
          oldPickup.trim(),
        vehicleType:
          filters.vehicleTypes.length === 1
            ? filters.vehicleTypes[0]
            : "",
      });
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setFilters({
      vehicleTypes: [
        "Shared Auto",
        "E-Rickshaw",
      ],

      maxFare: 200,

      distanceRange: "any",

      verifiedOnly: true,

      searchQueryPickup: "",

      searchQueryDestination: "",
    });

    setPickupInput("");

    setDestInput("");

    setSearchParams({});
  };

  // =====================================================
  // DIRECT + REVERSE SEARCH
  // =====================================================

  const searchedRoutes = useMemo(() => {
    const pickup =
      filters.searchQueryPickup.trim();

    const destination =
      filters.searchQueryDestination.trim();

    // -----------------------------------------------
    // NO SEARCH
    // -----------------------------------------------

    if (!pickup && !destination) {
      return routes;
    }

    // -----------------------------------------------
    // ONLY ONE LOCATION
    // -----------------------------------------------

    if (!pickup || !destination) {
      return routes.filter((route) => {
        return (
          locationMatches(
            pickup,
            route.pickup
          ) ||
          locationMatches(
            destination,
            route.destination
          )
        );
      });
    }

    const directRoutes = [];

    const reverseRoutes = [];

    routes.forEach((route) => {
      // =============================================
      // DIRECT
      // =============================================

      const isDirect =
        locationMatches(
          pickup,
          route.pickup
        ) &&
        locationMatches(
          destination,
          route.destination
        );

      if (isDirect) {
        directRoutes.push({
          ...route,

          routeDirection: "direct",

          originalRouteId:
            route._id,
        });

        return;
      }

      // =============================================
      // REVERSE
      // =============================================

      const isReverse =
        locationMatches(
          pickup,
          route.destination
        ) &&
        locationMatches(
          destination,
          route.pickup
        );

      if (isReverse) {
        reverseRoutes.push({
          ...route,

          pickup:
            route.destination,

          destination:
            route.pickup,

          routeDirection:
            "reverse",

          originalRouteId:
            route._id,
        });
      }
    });

    return [
      ...directRoutes,
      ...reverseRoutes,
    ];
  }, [
    routes,
    filters.searchQueryPickup,
    filters.searchQueryDestination,
  ]);

  // =====================================================
  // DIRECT / REVERSE FLAGS
  // =====================================================

  const hasDirectRoute =
    searchedRoutes.some(
      (route) =>
        route.routeDirection ===
        "direct"
    );

  const hasReverseRoute =
    searchedRoutes.some(
      (route) =>
        route.routeDirection ===
        "reverse"
    );

  // =====================================================
  // DIJKSTRA MULTI ROUTE
  //
  // IMPORTANT:
  //
  // Database:
  //
  // Polytechnic → BBD
  //
  // Graph:
  //
  // Polytechnic → BBD
  // BBD → Polytechnic   ← reverse edge
  //
  // Isliye BBD → Kapoorthala mein
  // BBD → Polytechnic possible hai.
  // =====================================================

  const findBestMultiRoute = (
    allRoutes,
    start,
    destination
  ) => {
    const startNode =
      normalizeLocation(start);

    const destinationNode =
      normalizeLocation(destination);

    if (
      !startNode ||
      !destinationNode
    ) {
      return null;
    }

    // ===============================================
    // CREATE BIDIRECTIONAL GRAPH
    // ===============================================

    const graph = {};

    allRoutes.forEach((route) => {
      const from =
        normalizeLocation(
          route.pickup
        );

      const to =
        normalizeLocation(
          route.destination
        );

      if (!from || !to) {
        return;
      }

      if (!graph[from]) {
        graph[from] = [];
      }

      if (!graph[to]) {
        graph[to] = [];
      }

      const distance =
        getDistance(
          route.distance
        );

      // =============================================
      // ORIGINAL EDGE
      // =============================================

      graph[from].push({
        route: {
          ...route,

          pickup: route.pickup,

          destination:
            route.destination,

          routeDirection:
            "direct",

          originalRouteId:
            route._id,
        },

        destination: to,

        weight: distance,
      });

      // =============================================
      // REVERSE EDGE
      // =============================================

      graph[to].push({
        route: {
          ...route,

          pickup:
            route.destination,

          destination:
            route.pickup,

          routeDirection:
            "reverse",

          originalRouteId:
            route._id,
        },

        destination: from,

        weight: distance,
      });
    });

    // ===============================================
    // DIJKSTRA SETUP
    // ===============================================

    const distances = {};

    const previous = {};

    const visited = new Set();

    Object.keys(graph).forEach(
      (node) => {
        distances[node] =
          Infinity;

        previous[node] = null;
      }
    );

    if (
      !(
        startNode in
        distances
      )
    ) {
      distances[startNode] =
        Infinity;

      previous[startNode] =
        null;
    }

    if (
      !(
        destinationNode in
        distances
      )
    ) {
      distances[
        destinationNode
      ] = Infinity;

      previous[
        destinationNode
      ] = null;
    }

    distances[startNode] = 0;

    // ===============================================
    // DIJKSTRA LOOP
    // ===============================================

    while (true) {
      let currentNode = null;

      let smallestDistance =
        Infinity;

      Object.keys(
        distances
      ).forEach((node) => {
        if (
          !visited.has(node) &&
          distances[node] <
            smallestDistance
        ) {
          smallestDistance =
            distances[node];

          currentNode = node;
        }
      });

      if (
        currentNode === null
      ) {
        break;
      }

      if (
        currentNode ===
        destinationNode
      ) {
        break;
      }

      visited.add(currentNode);

      const neighbours =
        graph[currentNode] ||
        [];

      neighbours.forEach(
        (neighbour) => {
          const nextNode =
            neighbour.destination;

          if (
            visited.has(nextNode)
          ) {
            return;
          }

          const newDistance =
            distances[
              currentNode
            ] +
            neighbour.weight;

          if (
            newDistance <
            distances[nextNode]
          ) {
            distances[
              nextNode
            ] = newDistance;

            previous[
              nextNode
            ] = {
              node: currentNode,

              route:
                neighbour.route,
            };
          }
        }
      );
    }

    // ===============================================
    // NO ROUTE
    // ===============================================

    if (
      distances[
        destinationNode
      ] === Infinity
    ) {
      return null;
    }

    // ===============================================
    // REBUILD PATH
    // ===============================================

    const path = [];

    let current =
      destinationNode;

    while (
      current !== startNode
    ) {
      const previousNode =
        previous[current];

      if (!previousNode) {
        return null;
      }

      path.unshift(
        previousNode.route
      );

      current =
        previousNode.node;
    }

    if (path.length <= 1) {
      return null;
    }

    // ===============================================
    // TOTAL DISTANCE
    // ===============================================

    const totalDistance =
      path.reduce(
        (total, route) => {
          return (
            total +
            getDistance(
              route.distance
            )
          );
        },
        0
      );

    // ===============================================
    // TOTAL TIME
    // ===============================================

    const totalTime =
      path.reduce(
        (total, route) => {
          return (
            total +
            getTime(
              route.time
            )
          );
        },
        0
      );

    return {
      found: true,

      type: "multi",

      routes: path,

      totalDistance,

      totalTime,

      stops: path.length,
    };
  };

  // =====================================================
  // MULTI ROUTE RESULT
  // =====================================================

  const multiRoute = useMemo(() => {
    const pickup =
      filters.searchQueryPickup.trim();

    const destination =
      filters.searchQueryDestination.trim();

    if (
      !pickup ||
      !destination
    ) {
      return null;
    }

    if (
      normalizeLocation(pickup) ===
      normalizeLocation(destination)
    ) {
      return null;
    }

    // -----------------------------------------------
    // DIRECT / REVERSE EXISTS
    // -----------------------------------------------

    if (
      hasDirectRoute ||
      hasReverseRoute
    ) {
      return null;
    }

    // -----------------------------------------------
    // FILTER ROUTES FOR VEHICLE
    // -----------------------------------------------

    const usableRoutes =
      routes.filter((route) => {
        if (
          filters.vehicleTypes.length >
            0 &&
          !filters.vehicleTypes.includes(
            route.vehicleType
          )
        ) {
          return false;
        }

        if (
          filters.verifiedOnly &&
          route.isVerified === false
        ) {
          return false;
        }

        return true;
      });

    return findBestMultiRoute(
      usableRoutes,
      pickup,
      destination
    );
  }, [
    routes,
    filters,
    hasDirectRoute,
    hasReverseRoute,
  ]);

  // =====================================================
  // FILTER NORMAL ROUTES
  // =====================================================

  const filteredRoutes = useMemo(() => {
    return searchedRoutes.filter(
      (route) => {
        // ---------------------------------------------
        // VEHICLE
        // ---------------------------------------------

        if (
          filters.vehicleTypes
            .length > 0 &&
          !filters.vehicleTypes.includes(
            route.vehicleType
          )
        ) {
          return false;
        }

        // ---------------------------------------------
        // VERIFIED
        // ---------------------------------------------

        if (
          filters.verifiedOnly &&
          route.isVerified === false
        ) {
          return false;
        }

        // ---------------------------------------------
        // FARE
        // ---------------------------------------------

        const minFare =
          getMinFare(
            route.fare
          );

        if (
          minFare >
          filters.maxFare
        ) {
          return false;
        }

        // ---------------------------------------------
        // DISTANCE
        // ---------------------------------------------

        const distance =
          getDistance(
            route.distance
          );

        if (
          filters.distanceRange ===
            "< 3 km" &&
          distance >= 3
        ) {
          return false;
        }

        if (
          filters.distanceRange ===
            "3 - 7 km" &&
          (
            distance < 3 ||
            distance > 7
          )
        ) {
          return false;
        }

        if (
          filters.distanceRange ===
            "> 7 km" &&
          distance <= 7
        ) {
          return false;
        }

        return true;
      }
    );
  }, [
    searchedRoutes,
    filters,
  ]);

  // =====================================================
  // POPULAR ROUTES
  // =====================================================

  const popularRoutes = routes
    .filter(
      (route) =>
        route.isVerified
    )
    .slice(0, 2);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />

          <p className="text-sm font-semibold text-slate-700">
            Loading routes...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load routes
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          SEARCH BAR
      ================================================= */}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row gap-3">

            {/* PICKUP */}

            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={pickupInput}
                onChange={(e) =>
                  setPickupInput(
                    e.target.value
                  )
                }
                placeholder="Pickup location"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* SWAP */}

            <button
              type="button"
              onClick={handleSwap}
              className="w-11 h-11 lg:w-12 lg:h-auto self-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500"
              title="Swap"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* DESTINATION */}

            <div className="flex-1 relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />

              <input
                type="text"
                value={destInput}
                onChange={(e) =>
                  setDestInput(
                    e.target.value
                  )
                }
                placeholder="Destination"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* SEARCH */}

            <button
              type="button"
              onClick={handleSearch}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />

              <span>Search</span>
            </button>

          </div>

          {/* RECENT SEARCHES */}

          <div className="mt-4 flex flex-wrap items-center gap-2">

            <span className="text-xs font-semibold text-slate-400">
              Recent:
            </span>

            {recentSearches.map(
              (item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setPickupInput(
                      item.pickup
                    );

                    setDestInput(
                      item.destination
                    );

                    setSearchParams({
                      pickup:
                        item.pickup,

                      destination:
                        item.destination,
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
                >
                  {item.pickup} →{" "}
                  {item.destination}
                </button>
              )
            )}

            {(filters.searchQueryPickup ||
              filters.searchQueryDestination) && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className="text-xs font-semibold text-red-500 hover:underline ml-1"
              >
                Clear
              </button>
            )}

          </div>

        </div>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside className="bg-white rounded-2xl border border-slate-200 p-5 h-fit shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />

                <h3 className="font-bold text-slate-900">
                  Filters
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      vehicleTypes: [
                        "Shared Auto",
                        "E-Rickshaw",
                      ],

                      maxFare: 200,

                      distanceRange:
                        "any",

                      verifiedOnly:
                        true,
                    })
                  )
                }
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset
              </button>

            </div>

            {/* VEHICLE */}

            <div className="mb-6">

              <p className="text-xs font-bold text-slate-700 mb-3">
                Vehicle Type
              </p>

              <div className="space-y-2">

                {[
                  "Shared Auto",
                  "E-Rickshaw",
                  "Private Auto",
                ].map(
                  (vehicle) => (
                    <label
                      key={vehicle}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.vehicleTypes.includes(
                          vehicle
                        )}
                        onChange={() => {
                          setFilters(
                            (prev) => {
                              const exists =
                                prev.vehicleTypes.includes(
                                  vehicle
                                );

                              return {
                                ...prev,

                                vehicleTypes:
                                  exists
                                    ? prev.vehicleTypes.filter(
                                        (
                                          item
                                        ) =>
                                          item !==
                                          vehicle
                                      )
                                    : [
                                        ...prev.vehicleTypes,
                                        vehicle,
                                      ],
                              };
                            }
                          );
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />

                      <span className="text-xs font-medium text-slate-600">
                        {vehicle}
                      </span>
                    </label>
                  )
                )}

              </div>
            </div>

            {/* MAX FARE */}

            <div className="mb-6">

              <div className="flex items-center justify-between mb-3">

                <p className="text-xs font-bold text-slate-700">
                  Maximum Fare
                </p>

                <span className="text-xs font-bold text-blue-600">
                  ₹{filters.maxFare}
                </span>

              </div>

              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={
                  filters.maxFare
                }
                onChange={(e) =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      maxFare: Number(
                        e.target.value
                      ),
                    })
                  )
                }
                className="w-full accent-blue-600"
              />

            </div>

            {/* DISTANCE */}

            <div className="mb-6">

              <p className="text-xs font-bold text-slate-700 mb-3">
                Distance
              </p>

              <select
                value={
                  filters.distanceRange
                }
                onChange={(e) =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      distanceRange:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">
                  Any distance
                </option>

                <option value="< 3 km">
                  Less than 3 km
                </option>

                <option value="3 - 7 km">
                  3 - 7 km
                </option>

                <option value="> 7 km">
                  More than 7 km
                </option>
              </select>

            </div>

            {/* VERIFIED */}

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                checked={
                  filters.verifiedOnly
                }
                onChange={(e) =>
                  setFilters(
                    (prev) => ({
                      ...prev,

                      verifiedOnly:
                        e.target.checked,
                    })
                  )
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />

              <span className="text-xs font-semibold text-slate-600">
                Verified routes only
              </span>

            </label>

          </aside>

          {/* =================================================
              ROUTES
          ================================================= */}

          <main>

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Available Routes
                </h1>

                <p className="text-xs text-slate-500 mt-1">
                  Find the best local auto and
                  e-rickshaw fare.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                {filteredRoutes.length} route
                {filteredRoutes.length !==
                1
                  ? "s"
                  : ""} found
              </div>

            </div>

            {/* =================================================
                MULTI ROUTE RESULT
            ================================================= */}

            {multiRoute &&
              multiRoute.routes &&
              multiRoute.routes.length >
                1 && (

              <div className="mb-6">

                <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">

                  {/* HEADER */}

                  <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">

                    <div className="flex items-center justify-between">

                      <div>

                        <h2 className="text-base font-extrabold text-slate-900">
                          Best connecting route
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                          Multiple route segments
                          found for your journey.
                        </p>

                      </div>

                      <div className="text-right">

                        <div className="text-lg font-extrabold text-blue-600">
                          {multiRoute.totalDistance}
                          {" "}
                          km
                        </div>

                        <div className="text-[10px] text-slate-500">
                          approx. distance
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* SEGMENTS */}

                  <div className="p-5">

                    <div className="space-y-0">

                      {multiRoute.routes.map(
                        (
                          route,
                          index
                        ) => {

                          const minFare =
                            getMinFare(
                              route.fare
                            );

                          const maxFare =
                            getMaxFare(
                              route.fare
                            );

                          return (
                            <div
                              key={
                                `${route.originalRouteId}-${index}`
                              }
                              className="relative"
                            >

                              {/* CONNECTOR */}

                              {index <
                                multiRoute
                                  .routes
                                  .length -
                                  1 && (
                                <div className="absolute left-[7px] top-7 bottom-0 w-px bg-blue-200" />
                              )}

                              <div className="flex gap-4 pb-5">

                                <div className="relative z-10 w-4 h-4 mt-1 rounded-full bg-blue-600 border-4 border-blue-100 shrink-0" />

                                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4">

                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                    <div>

                                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <span>
                                          {
                                            route.pickup
                                          }
                                        </span>

                                        <ChevronRight className="w-4 h-4 text-slate-400" />

                                        <span>
                                          {
                                            route.destination
                                          }
                                        </span>
                                      </div>

                                      <div className="text-xs text-slate-500 mt-1">
                                        {
                                          route.vehicleType
                                        }
                                        {" • "}
                                        {
                                          route.distance
                                        }
                                        {" • "}
                                        {
                                          route.time
                                        }
                                      </div>

                                    </div>

                                    <div className="text-right">

                                      <div className="text-base font-extrabold text-blue-600">
                                        ₹
                                        {
                                          minFare
                                        }

                                        {maxFare >
                                          minFare
                                          ? `-${maxFare}`
                                          : ""}
                                      </div>

                                      <div className="text-[10px] text-slate-400">
                                        segment fare
                                      </div>

                                    </div>

                                  </div>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* TOTAL */}

                    <div className="mt-2 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>

                        <p className="text-xs font-bold text-slate-700">
                          Total journey
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          {multiRoute.stops} connected
                          segments
                        </p>

                      </div>

                      <div className="text-right">

                        <div className="text-sm font-bold text-slate-900">
                          Approx.{" "}
                          {
                            multiRoute.totalDistance
                          }{" "}
                          km
                        </div>

                        <div className="text-xs text-slate-500">
                          Approx.{" "}
                          {
                            multiRoute.totalTime
                          }{" "}
                          min
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                NO MULTI ROUTE
            ================================================= */}

            {filters.searchQueryPickup &&
              filters.searchQueryDestination &&
              !hasDirectRoute &&
              !hasReverseRoute &&
              !multiRoute && (

              <div className="mb-6">

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">

                  <p className="text-xs font-bold text-amber-700">
                    No route found
                  </p>

                  <p className="text-xs text-amber-700 mt-1">
                    We could not find a direct,
                    reverse, or connecting route
                    between these locations.
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                DIRECT / REVERSE ROUTES
            ================================================= */}

            {filteredRoutes.length >
              0 && (

              <div className="space-y-4">

                {filteredRoutes.map(
                  (route) => {

                    const minFare =
                      getMinFare(
                        route.fare
                      );

                    const maxFare =
                      getMaxFare(
                        route.fare
                      );

                    return (
                      <div
                        key={
                          route._id
                        }
                        onClick={() =>
                          navigate(
                            `/routes/${route.originalRouteId || route._id}`
                          )
                        }
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer p-5 group"
                      >

                        {/* TOP */}

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                          <div className="flex-1">

                            <div className="flex items-center gap-2 mb-3">

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                  route.isVerified
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {route.isVerified
                                  ? "VERIFIED FARE"
                                  : "ESTIMATED"}
                              </span>

                              {route.routeDirection ===
                                "reverse" && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700">
                                  REVERSE
                                </span>
                              )}

                            </div>

                            {/* ROUTE */}

                            <div className="space-y-2">

                              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">

                                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 shrink-0" />

                                <span>
                                  {
                                    route.pickup
                                  }
                                </span>

                              </div>

                              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">

                                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />

                                <span>
                                  {
                                    route.destination
                                  }
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* FARE */}

                          <div className="text-right">

                            <div className="text-xl font-extrabold text-blue-600">

                              ₹
                              {minFare}

                              {maxFare >
                              minFare
                                ? `-${maxFare}`
                                : ""}

                            </div>

                            <div className="text-[10px] text-slate-400">
                              fare
                            </div>

                          </div>

                        </div>

                        {/* BOTTOM */}

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">

                          <div className="text-xs text-slate-500 font-medium">

                            <span>
                              {
                                route.vehicleType
                              }
                            </span>

                            <span className="mx-1.5">
                              •
                            </span>

                            <span>
                              {
                                route.distance
                              }
                            </span>

                            <span className="mx-1.5">
                              •
                            </span>

                            <span>
                              {
                                route.time
                              }
                            </span>

                          </div>

                          <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center">

                            View Details

                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />

                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

            {/* =================================================
                NO NORMAL ROUTES
            ================================================= */}

            {filteredRoutes.length ===
              0 &&
              !multiRoute &&
              !(
                filters.searchQueryPickup &&
                filters.searchQueryDestination
              ) && (

              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                <h3 className="text-lg font-bold text-slate-900">
                  No routes found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your filters.
                </p>

              </div>
            )}

            {/* =================================================
                POPULAR ROUTES
            ================================================= */}

            {!filters.searchQueryPickup &&
              !filters.searchQueryDestination &&
              popularRoutes.length >
                0 && (

              <div className="mt-8">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h2 className="text-lg font-extrabold text-slate-900">
                      Popular Routes
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Frequently searched local routes.
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {popularRoutes.map(
                    (route) => (
                      <div
                        key={
                          route._id
                        }
                        onClick={() =>
                          navigate(
                            `/routes/${route._id}`
                          )
                        }
                        className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all"
                      >

                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">

                          <span>
                            {
                              route.pickup
                            }
                          </span>

                          <ChevronRight className="w-4 h-4 text-slate-400" />

                          <span>
                            {
                              route.destination
                            }
                          </span>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-xs text-slate-500">
                            {
                              route.vehicleType
                            }
                            {" • "}
                            {
                              route.distance
                            }
                          </span>

                          <span className="text-base font-extrabold text-blue-600">
                            ₹
                            {
                              route.fare
                            }
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* =================================================
                LOAD MORE
            ================================================= */}

            <div className="pt-8 flex justify-center">

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Loaded all verified local routes."
                  )
                }
                className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-2 border border-blue-100 shadow-sm"
              >

                <RefreshCw className="w-3.5 h-3.5" />

                <span>
                  Load More Routes
                </span>

              </button>

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default RoutePage;