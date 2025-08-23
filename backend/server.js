import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db connect
mongoose.connect(
  "mongodb+srv://tawhid:y3k2ItxCpxK5lizq@cluster.tdzonq3.mongodb.net/eventifyDB?retryWrites=true&w=majority&appName=cluster",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => 
  res.json({ status: "ok", message: "API running 🚀" })
);

app.listen(PORT, () => 
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
