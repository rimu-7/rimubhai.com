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

// --- BLog Schema ---
const BlogSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    liveUrl: { type: String },
    repoUrl: { type: String },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: "Full-time" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

const LifeEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["milestone", "travel", "education", "personal", "learning"],
      default: "milestone",
    },
  },
  { timestamps: true }
);

const AwardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., "Best Paper Award"
    issuer: { type: String, required: true }, // e.g., "IEEE", "Jilin Govt"
    date: { type: Date, required: true },
    description: { type: String },
    link: { type: String }, // URL to certificate or paper
    type: { type: String, default: "award" }, // award, certification, publication, sports
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const About = mongoose.models.About || mongoose.model("About", AboutSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

const Experience =
  mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

const LifeEvent =
  mongoose.models.LifeEventEntry ||
  mongoose.model("LifeEventEntry", LifeEventSchema);

const Award = mongoose.models.Award || mongoose.model("Award", AwardSchema);

export { User, About, Blog, Project, Experience, LifeEvent, Award };
