const express = require("express");
const { createItinerary, getItineraries } = require("../controllers/IteneraryController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to verify JWT

const router = express.Router();

// Itinerary routes
router.post("/", authMiddleware, createItinerary); // Protected route
router.get("/", authMiddleware, getItineraries);   // Protected route

module.exports = router;
