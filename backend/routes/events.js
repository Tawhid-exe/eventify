// backend/routes/events.js
import express from "express";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";

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
      createdBy: req.user.id,
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

    // simple check (good enough for hackathon)
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

    event.attendees = event.attendees.filter((id) => id.toString() !== req.user.id);
    await event.save();

    res.json({ message: "Successfully unregistered from event" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete event (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update event (Admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🎖️ Certificate (PDF) for registered attendees
router.get("/:id/certificate", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name");
    if (!event) return res.status(404).json({ error: "Event not found" });

    // robust check here so certificate works reliably
    const isAttendee = event.attendees.some((a) => a.toString() === req.user.id);
    if (!isAttendee) {
      return res.status(403).json({ error: "Not registered for this event" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filename = `${event.title?.replace(/\s+/g, "_") || "event"}_certificate.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Simple, visible certificate
    doc.fontSize(28).text("🎉 Eventify Certificate", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(16).text("This certifies that", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(22).text("<< Your Name >>", { align: "center" }); // keep simple for hackathon
    doc.moveDown(1);

    doc.fontSize(16).text("has attended the event", { align: "center" });
    doc.moveDown(0.5);

    doc.fontSize(22).text(event.title || "Untitled Event", { align: "center" });
    doc.moveDown(1.5);

    const dateStr = new Date(event.date).toDateString();
    doc.fontSize(14).text(`Date: ${dateStr}`, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(14).text(`Location: ${event.location}`, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text(`Organizer: ${event.createdBy?.name || "Admin"}`, {
      align: "center",
    });

    doc.end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
