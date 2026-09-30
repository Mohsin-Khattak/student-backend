const mongooes = require("mongoose");
const connectDB = async () => {
  try {
    const con = await mongooes.connect(
      process.env.MONGO_URI || "mongodb://localhost:8081/student-db"
    );
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
