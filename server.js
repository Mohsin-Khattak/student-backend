const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./student-backend/src/config/db");
const studentRoutes = require("./student-backend/src/routes/student.routes");

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(cors());

app.use("/api/students", studentRoutes);
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

// Temporary test route
app.get("/test", (req, res) => {
  res.send("Server bilkul theek chal raha hai!");
});
