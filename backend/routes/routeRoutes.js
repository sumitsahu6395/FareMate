const express = require("express");
const Route = require("../models/Route");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

// Distance ko number mein convert karna
const getDistanceValue = (distance) => {
  if (!distance) return 0;

  const numbers = String(distance).match(/\d+(\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return 0;
  }

  if (numbers.length === 1) {
    return Number(numbers[0]);
  }

  // Example: "1-2 km" => average = 1.5
  return (
    (Number(numbers[0]) + Number(numbers[1])) / 2
  );
};

// Time ko minutes mein convert karna
const getTimeValue = (time) => {
  if (!time) return 0;

  const numbers = String(time).match(/\d+(\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return 0;
  }

  if (numbers.length === 1) {
    return Number(numbers[0]);
  }

  // Example: "5-10 min" => average = 7.5
  return (
    (Number(numbers[0]) + Number(numbers[1])) / 2
  );
};

// =====================================================
// FIND BEST ROUTE USING BFS
// =====================================================

const findBestRoute = (
  routes,
  start,
  destination,
  vehicleTypes = []
) => {
  const startNode = normalize(start);
  const destinationNode = normalize(destination);

  // Same location
  if (startNode === destinationNode) {
    return null;
  }

  // ===================================================
  // FILTER VEHICLE TYPES
  // ===================================================

  let usableRoutes = routes;

  if (
    Array.isArray(vehicleTypes) &&
    vehicleTypes.length > 0
  ) {
    usableRoutes = routes.filter((route) =>
      vehicleTypes.includes(route.vehicleType)
    );
  }

  // ===================================================
  // CREATE BIDIRECTIONAL GRAPH
  // ===================================================

  const graph = {};

  usableRoutes.forEach((route) => {
    const from = normalize(route.pickup);
    const to = normalize(route.destination);

    if (!graph[from]) {
      graph[from] = [];
    }

    if (!graph[to]) {
      graph[to] = [];
    }

    // -------------------------------------------------
    // ORIGINAL / DIRECT DIRECTION
    // -------------------------------------------------

    graph[from].push({
      route,
      from: route.pickup,
      to: route.destination,
      direction: "direct",
    });

    // -------------------------------------------------
    // REVERSE DIRECTION
    // -------------------------------------------------

    graph[to].push({
      route,
      from: route.destination,
      to: route.pickup,
      direction: "reverse",
    });
  });

  // ===================================================
  // DIRECT ROUTE FIRST
  // ===================================================

  Object.keys(graph).forEach((location) => {
    graph[location].sort((a, b) => {
      // Direct route ko reverse se pehle rakho
      if (
        a.direction === "direct" &&
        b.direction === "reverse"
      ) {
        return -1;
      }

      if (
        a.direction === "reverse" &&
        b.direction === "direct"
      ) {
        return 1;
      }

      return 0;
    });
  });

  // ===================================================
  // BFS
  //
  // BFS ka benefit:
  // Sabse kam segments/stops wala route milega.
  //
  // Example:
  //
  // BBD → Polytechnic
  //
  // vs
  //
  // BBD → Kamta → Polytechnic
  //
  // Pehla route choose hoga.
  // ===================================================

  const queue = [
    {
      location: startNode,
      path: [],
      visited: new Set([startNode]),
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    // Destination mil gaya
    if (current.location === destinationNode) {
      return current.path;
    }

    const neighbours =
      graph[current.location] || [];

    for (const edge of neighbours) {
      const nextLocation = normalize(edge.to);

      // Circular route avoid karo
      if (current.visited.has(nextLocation)) {
        continue;
      }

      const newVisited = new Set(
        current.visited
      );

      newVisited.add(nextLocation);

      const newPath = [
        ...current.path,
        {
          ...edge.route,

          // Important:
          // Reverse hone par pickup/destination swap hoga
          pickup: edge.from,
          destination: edge.to,

          // Frontend ke liye
          routeDirection: edge.direction,

          // Original database route ID
          originalRouteId: edge.route._id,
        },
      ];

      queue.push({
        location: nextLocation,
        path: newPath,
        visited: newVisited,
      });
    }
  }

  // Route nahi mila
  return null;
};

// =====================================================
// GET ALL ROUTES
// =====================================================

router.get("/", async (req, res) => {
  try {
    const {
      pickup,
      destination,
      vehicleType,
    } = req.query;

    // -----------------------------------------------
    // Agar pickup + destination nahi hai
    // to saare routes return karo
    // -----------------------------------------------

    if (!pickup || !destination) {
      const routes = await Route.find().sort({
        createdAt: -1,
      });

      return res.json(routes);
    }

    // =================================================
    // FETCH ALL ROUTES
    // =================================================

    const routes = await Route.find({
      isVerified: true,
    });

    // =================================================
    // VEHICLE TYPE FILTER
    // =================================================

    let vehicleTypes = [];

    if (vehicleType) {
      vehicleTypes = String(vehicleType)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // =================================================
    // FIND BEST ROUTE
    // =================================================

    const bestPath = findBestRoute(
      routes,
      pickup,
      destination,
      vehicleTypes
    );

    // =================================================
    // NO ROUTE FOUND
    // =================================================

    if (!bestPath || bestPath.length === 0) {
      return res.status(404).json({
        found: false,
        type: "none",
        message:
          "No route found between these locations",
        routes: [],
      });
    }

    // =================================================
    // DIRECT / REVERSE ROUTE
    // =================================================

    if (bestPath.length === 1) {
      const route = bestPath[0];

      return res.json({
        found: true,

        type:
          route.routeDirection === "reverse"
            ? "reverse"
            : "direct",

        routes: [route],

        totalDistance: getDistanceValue(
          route.distance
        ),

        totalTime: getTimeValue(
          route.time
        ),

        stops: 1,
      });
    }

    // =================================================
    // MULTIPLE ROUTE
    // =================================================

    const totalDistance = bestPath.reduce(
      (total, route) => {
        return (
          total +
          getDistanceValue(route.distance)
        );
      },
      0
    );

    const totalTime = bestPath.reduce(
      (total, route) => {
        return (
          total +
          getTimeValue(route.time)
        );
      },
      0
    );

    return res.json({
      found: true,

      type: "multi",

      routes: bestPath,

      totalDistance,

      totalTime,

      stops: bestPath.length,
    });
  } catch (error) {
    console.error(
      "Fetch routes error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch routes",
      error: error.message,
    });
  }
});

// =====================================================
// GET ONE ROUTE BY ID
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const route = await Route.findById(
      req.params.id
    );

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.json(route);
  } catch (error) {
    console.error(
      "Fetch single route error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch route",
      error: error.message,
    });
  }
});

// =====================================================
// ADD A ROUTE
// =====================================================

router.post("/", async (req, res) => {
  try {
    const route = await Route.create(
      req.body
    );

    res.status(201).json(route);
  } catch (error) {
    console.error(
      "Create route error:",
      error
    );

    res.status(400).json({
      message: "Failed to create route",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE A ROUTE
// ADMIN ONLY
// =====================================================

router.patch(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const {
        fare,
        distance,
        time,
      } = req.body;

      // Validation
      if (
        !fare ||
        !distance ||
        !time
      ) {
        return res.status(400).json({
          message:
            "Fare, distance and time are required",
        });
      }

      const route =
        await Route.findByIdAndUpdate(
          req.params.id,

          {
            fare: fare.trim(),
            distance: distance.trim(),
            time: time.trim(),
          },

          {
            new: true,
            runValidators: true,
          }
        );

      if (!route) {
        return res.status(404).json({
          message: "Route not found",
        });
      }

      res.json({
        message:
          "Route updated successfully",

        route,
      });
    } catch (error) {
      console.error(
        "Update route error:",
        error
      );

      res.status(400).json({
        message:
          "Failed to update route",

        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE A ROUTE
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const route =
        await Route.findByIdAndDelete(
          req.params.id
        );

      if (!route) {
        return res.status(404).json({
          message: "Route not found",
        });
      }

      res.json({
        message:
          "Route deleted successfully",

        route,
      });
    } catch (error) {
      console.error(
        "Delete route error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete route",

        error: error.message,
      });
    }
  }
);

module.exports = router;