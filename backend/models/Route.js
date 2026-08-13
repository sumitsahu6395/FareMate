const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    pickup: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    fare: {
      type: String,
      required: true,
    },

    distance: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["Shared Auto", "E-Rickshaw", "Private Auto"],
      default: "Shared Auto",
    },

    city: {
      type: String,
      default: "Lucknow",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Route", routeSchema);