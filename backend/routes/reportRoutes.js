const express = require("express");
const Report = require("../models/Report");
const Route = require("../models/Route");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Submit a new fare report
router.post("/", async (req, res) => {
  try {
    const report = await Report.create(req.body);

    res.status(201).json({
      message: "Fare report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Report creation error:", error);

    res.status(400).json({
      message: "Failed to submit fare report",
      error: error.message,
    });
  }
});


// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});


// Get all pending reports - Admin only
router.get("/pending", adminAuth, async (req, res) => {
  try {
    const reports = await Report.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Pending reports error:", error);

    res.status(500).json({
      message: "Failed to fetch pending reports",
      error: error.message,
    });
  }
});


// Approve a report - Admin only
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.status !== "pending") {
      return res.status(400).json({
        message: `Report is already ${report.status}`,
      });
    }

    // Normalize pickup and destination
        const pickup = report.pickup.trim();
        const destination = report.destination.trim();

        // Check duplicate route (case-insensitive)
        const existingRoute = await Route.findOne({
          pickup: { $regex: `^${pickup}$`, $options: "i" },
          destination: { $regex: `^${destination}$`, $options: "i" },
          vehicleType: report.vehicleType,
          city: "Lucknow",
        });

        if (existingRoute) {
          return res.status(400).json({
            message: "Duplicate route already exists",
            route: existingRoute,
          });
        }

// Create new route
      const route = await Route.create({
        pickup: pickup,
        destination: destination,
        fare: String(report.farePaid),
        distance: report.distance,
        time: "Not specified",
        vehicleType: report.vehicleType,
        city: "Lucknow",
        isVerified: true,
      });

    // Duplicate route found
    if (existingRoute) {
      return res.status(400).json({
        message: "Duplicate route already exists",
        route: existingRoute,
      });
    }


    // Update report status
    report.status = "approved";
    await report.save();

    res.json({
      message: "Report approved and route created successfully",
      report,
      route,
    });

  } catch (error) {
    console.error("Approve report error:", error);

    res.status(500).json({
      message: "Failed to approve report",
      error: error.message,
    });
  }
});


// Reject a report - Admin only
router.patch("/:id/reject", adminAuth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.status !== "pending") {
      return res.status(400).json({
        message: `Report is already ${report.status}`,
      });
    }

    report.status = "rejected";
    await report.save();

    res.json({
      message: "Report rejected successfully",
      report,
    });

  } catch (error) {
    console.error("Reject report error:", error);

    res.status(500).json({
      message: "Failed to reject report",
      error: error.message,
    });
  }
});


module.exports = router;