const express = require("express");
const connectDB = require("./db/connection");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const threadRoutes = require("./routes/thread.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const port = process.env.PORT || 4001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/users", userRoutes);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
