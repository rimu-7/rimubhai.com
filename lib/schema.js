// models/User.js
import mongoose from "mongoose";

// --- User Schema ---
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

// --- About Schema ---

const AboutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // ✅ ADD THIS: The missing content field
    content: {
      type: String,
      required: true, 
    },
    onGoing: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// Prevent overwrite errors
// Prevent model recompilation error in Next.js
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const About = mongoose.models.About || mongoose.model("About", AboutSchema);

export { User, About };
