import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import chatRoutes from "./routes/chats.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);  

// Health check route
app.get("/api/health", (req, res) => 
  res.json({ status: "ok", message: "API running 🚀" })
);

// Start the server
app.listen(PORT, () => 
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
