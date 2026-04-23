const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
