const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Feedback Schema
const feedbackSchema = new mongoose.Schema({
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

// Feedback Model
const Feedback = mongoose.model("Feedback", feedbackSchema, "feedbacks");

// Default route
app.get("/", (req, res) => {
    res.send("Feedback Server Running Successfully!");
});

// POST route to save feedback
app.post("/api/feedback", async (req, res) => {
    try {
        const feedbackData = req.body;

        if (!feedbackData || Object.keys(feedbackData).length === 0) {
            return res.status(400).json({
                message: "Feedback data is required"
            });
        }

        const newFeedback = await Feedback.create({
            data: feedbackData
        });

        console.log("Feedback saved:", newFeedback);

        res.status(201).json({
            message: "Feedback saved successfully!",
            feedback: newFeedback
        });

    } catch (error) {
        console.error("Feedback Error:", error.message);

        res.status(500).json({
            message: "Failed to save feedback",
            error: error.message
        });
    }
});

// GET route to retrieve feedback
app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });

        res.status(200).json(feedbacks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve feedback"
        });
    }
});

// Connect MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();
