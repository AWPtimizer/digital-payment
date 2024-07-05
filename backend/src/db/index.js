const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/paytmDB`);

    console.log(`\n MongoDb Connected!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;