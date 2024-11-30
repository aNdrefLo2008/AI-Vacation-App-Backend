const express = require("express");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expensesController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure user is authenticated

const router = express.Router();

// Create a new expense
router.post("/", authMiddleware, createExpense);

// Get all expenses for a specific itinerary
router.get("/:itineraryId", authMiddleware, getExpenses);

// Update an expense
router.put("/:id", authMiddleware, updateExpense);

// Delete an expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
