import express from "express"
import dotenv from "dotenv"
dotenv.config()

console.log('Environment variables loaded:')
console.log('MONGO:', process.env.MONGO)
console.log('ORIGIN:', process.env.ORIGIN)
console.log('SERVER:', process.env.SERVER)
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.routes.js"
import rideRoute from "./routes/ride.routes.js"
import { fileURLToPath } from "url"

const app = express()
const PORT = 8080;

const connectDB = (url) => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.MONGO)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error));
};


//middlewares


app.use(cors({
  origin: process.env.ORIGIN,  // Set specific frontend origin
  credentials: true, // Allow credentials (cookies, authentication headers)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));


app.use(cookieParser())
app.use(express.json())

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);


app.use((err, req, res, next)=>{
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: err.status,
    error: errorMessage
  })
})



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File upload configuration - use memory storage for deployment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

let storage;
let uploadPath;

if (isProduction) {
  // Use memory storage for serverless environments
  storage = multer.memoryStorage();
  uploadPath = null;
} else {
  // Use disk storage for local development
  storage = multer.diskStorage({
    destination: path.join(__dirname, 'upload/images'),
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  });
  uploadPath = path.join(__dirname, 'upload/images');
  
  // Create upload directory only in development
  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (error) {
    console.log('Upload directory creation skipped:', error.message);
  }
}

const upload = multer({storage:storage});

//Creating Upload Endpoints for images
if (!isProduction && uploadPath) {
  app.use('/images', express.static(uploadPath));
  app.use('/upload/images', express.static(uploadPath));
}

app.post("/upload", upload.single('product'), (req, res) => {
  if (isProduction) {
    // For production, you'd typically upload to cloud storage
    // For now, return a placeholder or handle differently
    return res.status(503).json({
      success: false,
      message: "File upload not available in production environment"
    });
  }
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }
  
  res.json({
    success: 1,
    image_url: `${process.env.SERVER}/images/${req.file.filename}`
  });
});


// export default upload;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('temp/my-upload', express.static(path.join(__dirname, 'temp/my-upload')));

app.listen(PORT, () => {
  connectDB()
  console.log(`Connected to backend on PORT: ${PORT}`)
})
