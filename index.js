const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute");
const itineraryRoutes = require("./routes/iteneraryRoute");
const expenseRoutes = require("./routes/expensesRoute");
const aiRoutes = require('./controllers/AIController');
const locationRoutes = require('./routes/locationRoute');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON

const cors = require("cors");
app.use(cors()); // This will allow all origins


app.use((req, res, next) => {
    next();
  });

// Routes
app.use('/api/locations', locationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use('/api/ai', aiRoutes.getAIResponse);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

