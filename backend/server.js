import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Định nghĩa __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Biến môi trường
const NODE_ENV = process.env.NODE_ENV;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MONGO_URI_FALLBACK = "mongodb://localhost:27017/Techshop";
const SESSION_SECRET_FALLBACK = "a-very-strong-secret-key-for-dev";

// === FIX 2: Sửa CORS ===
app.use(
  cors({
    origin: FRONTEND_URL, // Chỉ cho phép URL từ biến môi trường
    credentials: true,
  })
);

// Middlewares
app.use(bodyParser.json());

// === FIX 3: Sửa Session & Cookie ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || SESSION_SECRET_FALLBACK, // Dùng secret từ env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || MONGO_URI_FALLBACK,
    }),
    cookie: {
      secure: NODE_ENV === "production", // true khi deploy
      httpOnly: true,
      sameSite: NODE_ENV === "production" ? "none" : "lax", // 'none' cho cross-domain
    },
  })
);

// === CẢNH BÁO: Tạm thời vẫn dùng, nhưng file sẽ bị mất khi server restart ===
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
app.use("/api", authRoutes);

async function startServer() {
  try {
    await connectDB();

    // === FIX 1: Sửa PORT ===
    const PORT = process.env.PORT || 5000; // Dùng PORT của Render
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

startServer();