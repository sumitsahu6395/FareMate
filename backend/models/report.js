const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
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

    vehicleType: {
      type: String,
      enum: ["Shared Auto", "E-Rickshaw", "Private Auto"],
      required: true,
    },

    farePaid: {
      type: Number,
      required: true,
      min: 1,
    },

    travelDate: {
      type: String,
      required: true,
    },

    distance: {
      type: String,
      default: "Not specified",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);