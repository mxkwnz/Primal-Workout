require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

connectDB();
seedAdmin();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const adminRoutes = require("./routes/adminRoutes");
const modRoutes = require("./routes/modRoutes");
const setupRoutes = require("./routes/setupRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const scheduledRoutes = require("./routes/scheduledRoutes");
const workoutLogRoutes = require("./routes/workoutLogRoutes");
const notFound = require("./middleware/notFound");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/scheduled", scheduledRoutes);
app.use("/api/workoutlogs", workoutLogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mod", modRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Primal-Workout API is running");
});

app.use(notFound);

app.use((err, req, res, next) => {
  var statusCode = err.statusCode || 500;
  if (err.name === "ValidationError") statusCode = 400;
  if (err.name === "CastError") statusCode = 400;
  if (err.code === 11000) statusCode = 400;
  console.error(err.stack);
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server Error" : err.message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
