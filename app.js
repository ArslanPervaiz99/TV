const express = require("express");
const cors = require("cors");
const path = require("path");
const channelRoutes = require("./routes/channelR");
const mongoDbUrl =
  "mongodb+srv://tv-channels:bcdHQVYUyUHCmm8t@tvchannel.fqlpab4.mongodb.net/?retryWrites=true&w=majority&appName=TVChannel";
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

// CORS middleware lagao taake frontend backend se data le sake
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
  })
);

// app.get("/", (req, res) => {
//   res.send("Hello from backend!");
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // null means no error and 2nd parameter is the destination paths
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // specify the filename for the uploaded file
  },
});

const multerOptions = {
  storage: storage,
};

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Multer setup for file uploads
app.use(multer(multerOptions).single("logoUrl"));

// Static folder (agar koi CSS/JS files hain to)
app.use(express.static(path.join(__dirname, "public")));

const { createProxyMiddleware } = require("http-proxy-middleware");

app.use("/proxy", (req, res, next) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    new URL(targetUrl);
  } catch (err) {
    return res.status(400).send("Invalid URL parameter");
  }

  // Use newer configuration format
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: () => "",
    logLevel: "silent", // Reduce logging
    onError: (err, req, res) => {
      res.status(500).send("Proxy error");
    },
  });

  proxy(req, res, next);
});

// Use your routes
app.use("/", channelRoutes);

const PORT = 5000;
mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, () => {
      console.log(`airbnb Server Running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// monog db connection link
// mongodb+srv://tv-channels:bcdHQVYUyUHCmm8t@tvchannel.fqlpab4.mongodb.net/?retryWrites=true&w=majority&appName=TVChannel
