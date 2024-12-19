const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createItinerary = async (req, res) => {
  const { title, description, startDate, endDate, cost, expenses } = req.body;
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

  // Validate cost
  const itineraryCost = parseInt(cost);
  if (isNaN(itineraryCost) || itineraryCost < 0) {
    return res.status(400).json({ error: "Invalid cost. It must be a positive number." });
  }

  // Validate expenses
  const parsedExpenses = Array.isArray(expenses) ? expenses : [];
  for (const expense of parsedExpenses) {
    if (!expense.title || typeof expense.title !== "string") {
      return res.status(400).json({ error: "Each expense must have a valid title." });
    }
    if (isNaN(parseFloat(expense.amount)) || parseFloat(expense.amount) < 0) {
      return res.status(400).json({ error: "Each expense must have a valid amount." });
    }
  }

  try {
    // Create the itinerary
    const itinerary = await prisma.itinerary.create({
      data: {
        title,
        description,
        startDate: accStartDate,
        endDate: accEndDate,
        userId,
        cost: itineraryCost,
        // Expenses are handled separately
      },
    });

    // Create related expenses
    const expenseData = parsedExpenses.map(expense => ({
      title: expense.title,
      amount: parseFloat(expense.amount),
      date: new Date(), // Set the current date or allow a date to be passed
      itineraryId: itinerary.id,
    }));

    if (expenseData.length > 0) {
      await prisma.expense.createMany({
        data: expenseData,
      });
    }

    res.status(201).json({ message: "Itinerary created with expenses.", itinerary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create itinerary." });
  }
};

// Get itineraries for the logged-in user
const getItineraries = async (req, res) => {
  const userId = req.userId;

  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { userId },
      include: { expenses: true }, // Include related expenses
    });
    res.json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch itineraries." });
  }
};

module.exports = { createItinerary, getItineraries };
