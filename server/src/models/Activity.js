import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "status_changed"],
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

activitySchema.index({ userId: 1, createdAt: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
