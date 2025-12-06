import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import rideRoute from "./routes/ride.routes.js";

// =======================
// ENV CONFIG
// =======================
dotenv.config();

console.log("✅ Environment variables loaded:");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("ORIGIN:", process.env.ORIGIN);
console.log("SERVER:", process.env.SERVER);

// =======================
// APP INIT
// =======================
const app = express();
const PORT = process.env.PORT || 8080;

// =======================
// DB CONNECT
// =======================
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// =======================
// MIDDLEWARES
// =======================
const allowedOrigins = [
  process.env.ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://car-pooling-mwly.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

// =======================
// PREFLIGHT OPTIONS
// =======================
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.sendStatus(200);
});

// =======================
// ROUTES
// =======================
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  if (err.message === "Not allowed by CORS") {
    console.error("❌ CORS Error - Origin not allowed:", req.headers.origin);
    return res.status(403).json({
      success: false,
      status: 403,
      error: "CORS policy violation",
    });
  }

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    error: errorMessage,
  });
});

// =======================
// FILE UPLOAD CONFIG
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME;

let storage;
let uploadPath;

if (isProduction) {
  storage = multer.memoryStorage();
  uploadPath = null;
} else {
  storage = multer.diskStorage({
    destination: path.join(__dirname, "upload/images"),
    filename: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  uploadPath = path.join(__dirname, "upload/images");

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (error) {
    console.log("Upload directory creation skipped:", error.message);
  }
}

const upload = multer({ storage });

// Static images (LOCAL ONLY)
if (!isProduction && uploadPath) {
  app.use("/images", express.static(uploadPath));
  app.use("/upload/images", express.static(uploadPath));
}

// Upload API
app.post("/upload", upload.single("product"), (req, res) => {
  if (isProduction) {
    return res.status(503).json({
      success: false,
      message: "File upload not available in production environment",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.json({
    success: 1,
    image_url: `${process.env.SERVER}/images/${req.file.filename}`,
  });
});

// =======================
// SERVER START (LOCAL ONLY)
// =======================
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Local Backend running on PORT: ${PORT}`);
    });
  });
} else {
  // ✅ Vercel / Production: Only DB connect
  connectDB();
}

// =======================
// ✅ REQUIRED FOR VERCEL
// =======================
export default app;
