import { Activity } from "../models/Activity.js";

export const logActivity = ({ userId, task, action, metadata = {} }) =>
  Activity.create({
    userId,
    taskId: action === "deleted" ? null : task._id,
    taskTitle: task.title,
    action,
    metadata,
  });
