const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL_LOCAL;

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");

    module.exports = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
