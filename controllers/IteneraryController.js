const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createItinerary = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const userId = req.userId; // Assume middleware verifies token and sets req.userId

  // Check if startDate and endDate are valid
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required." });
  }

  // Convert startDate and endDate from string to Date
  const accStartDate = new Date(startDate);
  const accEndDate = new Date(endDate);

  // Validate the dates
  if (isNaN(accStartDate.getTime())) {
    return res.status(400).json({ error: "Invalid start date format." });
  }

  if (isNaN(accEndDate.getTime())) {
    return res.status(400).json({ error: "Invalid end date format." });
  }

  try {
    // Create the itinerary
    const itinerary = await prisma.itinerary.create({
      data: {
        title,
        description,
        startDate: accStartDate, // Use accStartDate for the startDate field
        endDate: accEndDate,     // Use accEndDate for the endDate field
        userId,
      },
    });

    res.status(201).json({ message: "Itinerary created.", itinerary });
  } catch (err) {
    console.log(err);
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
