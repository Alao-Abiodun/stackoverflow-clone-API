const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URI } = process.env;

exports.connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database not connected", error.message);
  }
};
