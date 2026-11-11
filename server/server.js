
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Feedback Schema
const feedbackSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model(
  "Feedback",
  feedbackSchema,
  "feedbacks"
);

// Home Route
app.get("/", (req, res) => {
  res.send("Feedback Server Running Successfully!");
});

// Save Feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const feedbackData = req.body;

    if (
      !feedbackData ||
      typeof feedbackData !== "object" ||
      Array.isArray(feedbackData) ||
      Object.keys(feedbackData).length === 0
    ) {
      return res.status(400).json({
        message: "Feedback data is required"
      });
    }

    const newFeedback = await Feedback.create({
      data: feedbackData
    });

    res.status(201).json({
      message: "Feedback submitted successfully!",
      feedback: newFeedback
    });

  } catch (error) {
    console.error("Feedback Error:", error);

    res.status(500).json({
      message: "Failed to save feedback",
      error: error.message
    });
  }
});

// Retrieve Feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({
      createdAt: -1
    });

    res.status(200).json(feedbacks);

  } catch (error) {
    console.error("Retrieval Error:", error);

    res.status(500).json({
      message: "Failed to retrieve feedback"
    });
  }
});

// Connect MongoDB and Start Server
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas Connected Successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
