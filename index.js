const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { logger } = require("./middlewares/logEvents");
const errHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

app.use(logger);

app.use(express.json());

// Cross-Origin Resource Sharing
const whitelist = [
  "http://localhost:8000",
  "https://www.google.com",
  "https://127.0.0.1:5500",
  "https://www.google.com.eg",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://seabdelrahman968:OublQOC0osuc0aAD@cluster0.lyrwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error(err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Handler
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.send("404 Not Found");
  }
});

app.use(errHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
