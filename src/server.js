const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// Paths ko theek kar diya gaya hai:
const connectDB = require("./config/db");
const studentRoutes = require("./routes/student.routes");

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(cors());

app.use("/api/students", studentRoutes);

// Temporary test route (app.listen se pehle rakhna behtar hai)
app.get("/test", (req, res) => {
  res.send("Server bilkul theek chal raha hai!");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
// 🔍 Yeh line har request ko logs mein print kar degi!
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: [${req.method}] ${req.url}`);
  next();
});
