const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create an expense
const createExpense = async (req, res) => {
  const { title, amount, date, itineraryId } = req.body;

  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        date: new Date(date),
        itineraryId,
      },
    });

    res.status(201).json({ message: "Expense created successfully.", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense." });
  }
};

// Get all expenses for a specific itinerary
const getExpenses = async (req, res) => {
  const { itineraryId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { itineraryId: parseInt(itineraryId, 10) },
    });

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, date } = req.body;

  try {
    const expense = await prisma.expense.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        amount,
        date: new Date(date),
      },
    });

    res.status(200).json({ message: "Expense updated successfully.", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update expense." });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.expense.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense." });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
