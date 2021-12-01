const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

const router = require("./routes/index");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const { PORT, DB_USERNAME, DB_PASSWORD, NODE_ENV } = process.env || 2005;

const connectDB = require("./databases/db");
connectDB;

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "The main application route" });
});

app.use("/api", router);

app.listen(PORT, (req, res, next) => {
  mongoose
    .connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.iij5r.mongodb.net/stackOverFlowAPI-DB`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Database connected"))
    .catch(() => console.log("Database not connected"));
  console.log(`Application running on PORT ${PORT}`);
});

// if (!NODE_ENV) {
//   app.listen(PORT, (req, res, next) => {
//     console.log(`Application running on PORT ${PORT}`);
//   });
// }

// module.exports = app;
