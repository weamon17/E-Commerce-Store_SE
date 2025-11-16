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

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/Techshop",
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api", authRoutes);
async function startServer() {
  try {
    await connectDB();
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}
startServer();
