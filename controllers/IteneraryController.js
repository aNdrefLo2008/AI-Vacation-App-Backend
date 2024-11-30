const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create an itinerary
const createItinerary = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const userId = req.userId; // Assume middleware verifies token and sets req.userId

  try {
    const itinerary = await prisma.itinerary.create({
      data: { title, description, startDate, endDate, userId },
    });

    res.status(201).json({ message: "Itinerary created.", itinerary });
  } catch (err) {
    res.status(500).json({ error: "Failed to create itinerary." });
  }
};

// Get itineraries for the logged-in user
const getItineraries = async (req, res) => {
  const userId = req.userId;

  try {
    const itineraries = await prisma.itinerary.findMany({ where: { userId } });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch itineraries." });
  }
};

module.exports = { createItinerary, getItineraries };
