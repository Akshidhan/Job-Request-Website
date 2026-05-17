const mongoose = require("mongoose");
const User = require("./User.model");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Open", "Ongoing", "Closed"],
      default: "Open",
    },
    acceptedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("JobRequest", jobRequestSchema);