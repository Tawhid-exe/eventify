import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db connect
mongoose.connect("mongodb+srv://YOUR_MONGO_URI", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "API running 🚀" }));

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
