require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8081;

// Middlewares
app.use(express.json());
app.use(cors());

// 🔍 Logger Middleware (Yeh ab app.listen() se PEHLE hai taake har request ko pakad sake)
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: [${req.method}] ${req.url}`);
  next();
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Server Listen (Yeh hamesha aakhir mein hota hai)
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
