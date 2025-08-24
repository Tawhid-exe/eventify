import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["workshop", "seminar", "competition", "cultural", "sports", "other"],
    default: "other"
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  attendees: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  maxAttendees: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model("Event", EventSchema);
