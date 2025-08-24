import express from "express";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name")
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("attendees", "name email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create event (Admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const { title, description, date, time, location, category, maxAttendees } = req.body;
    const event = new Event({
      title,
      description, 
      date,
      time,
      location,
      category,
      maxAttendees,
      createdBy: req.user.id
    });
    
    await event.save();
    res.json({ message: "Event created successfully ✅", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register for event (Students)
router.post("/:id/register", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ error: "Already registered" });
    }
    
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: "Event is full" });
    }
    
    event.attendees.push(req.user.id);
    await event.save();
    
    res.json({ message: "Successfully registered for event! 🎉" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Unregister from event
router.post("/:id/unregister", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
    await event.save();
    
    res.json({ message: "Successfully unregistered from event" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
