import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    priorityRank: {
      type: Number,
      default: 2,
      select: false,
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1, createdAt: -1 });
taskSchema.index({ userId: 1, priority: 1, deadline: 1 });

export const Task = mongoose.model("Task", taskSchema);
