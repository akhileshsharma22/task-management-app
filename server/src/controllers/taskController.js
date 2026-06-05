import { Task } from "../models/Task.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { logActivity } from "../utils/logActivity.js";

const sortOptions = {
  latest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  completed: { status: 1, updatedAt: -1 },
  pending: { status: -1, updatedAt: -1 },
  priority: { priorityRank: -1, deadline: 1, createdAt: -1 },
};
const priorityRanks = { low: 1, medium: 2, high: 3 };

export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, sort, page, limit } = req.validatedQuery;
  const query = { userId: req.user._id };

  if (status !== "all") query.status = status;
  if (priority !== "all") query.priority = priority;
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
      { priority: { $regex: escaped, $options: "i" } },
      { status: { $regex: escaped, $options: "i" } },
    ];
  }

  const [tasks, total, pending, completed] = await Promise.all([
    Task.find(query)
      .sort(sortOptions[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(query),
    Task.countDocuments({ userId: req.user._id, status: "pending" }),
    Task.countDocuments({ userId: req.user._id, status: "completed" }),
  ]);

  const taskTotal = pending + completed;
  sendSuccess(res, {
    message: "Tasks retrieved successfully",
    data: {
      tasks,
      stats: {
        total: taskTotal,
        pending,
        completed,
        completionPercentage: taskTotal ? Math.round((completed / taskTotal) * 100) : 0,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    },
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const payload = { ...req.body, priorityRank: priorityRanks[req.body.priority], deadline: req.body.deadline || null, userId: req.user._id };
  if (payload.status === "completed") payload.completedAt = new Date();
  const task = await Task.create(payload);
  await logActivity({ userId: req.user._id, task, action: "created" });
  sendSuccess(res, { statusCode: 201, message: "Task created successfully", data: { task } });
});

export const updateTask = asyncHandler(async (req, res) => {
  const existingTask = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!existingTask) throw new ApiError(404, "Task not found");

  const statusChanged = req.body.status && req.body.status !== existingTask.status;
  const payload = { ...req.body };
  if (payload.priority) payload.priorityRank = priorityRanks[payload.priority];
  if (payload.deadline === "") payload.deadline = null;
  if (statusChanged) payload.completedAt = payload.status === "completed" ? new Date() : null;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    payload,
    { new: true, runValidators: true },
  );
  await logActivity({
    userId: req.user._id,
    task,
    action: statusChanged ? "status_changed" : "updated",
    metadata: statusChanged ? { from: existingTask.status, to: task.status } : {},
  });
  sendSuccess(res, { message: "Task updated successfully", data: { task } });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new ApiError(404, "Task not found");
  await logActivity({ userId: req.user._id, task, action: "deleted" });
  sendSuccess(res, { message: "Task deleted successfully", data: { id: task._id } });
});
