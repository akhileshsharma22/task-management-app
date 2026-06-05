import { Activity } from "../models/Activity.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getAnalytics = asyncHandler(async (req, res) => {
  const today = startOfToday();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const base = { userId: req.user._id };

  const [total, completed, tasksCreatedThisWeek, tasksCompletedThisWeek, weeklyCreated, recentActivity] =
    await Promise.all([
      Task.countDocuments(base),
      Task.countDocuments({ ...base, status: "completed" }),
      Task.countDocuments({ ...base, createdAt: { $gte: weekStart } }),
      Task.countDocuments({ ...base, completedAt: { $gte: weekStart } }),
      Task.aggregate([
        { $match: { ...base, createdAt: { $gte: weekStart } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      ]),
      Activity.find(base).sort({ createdAt: -1 }).limit(8).lean(),
    ]);

  const byDate = Object.fromEntries(weeklyCreated.map((item) => [item._id, item.count]));
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, day: date.toLocaleDateString("en", { weekday: "short" }), created: byDate[key] || 0 };
  });

  sendSuccess(res, {
    message: "Analytics retrieved successfully",
    data: {
      stats: {
        total,
        completed,
        pending: total - completed,
        completionPercentage: total ? Math.round((completed / total) * 100) : 0,
        tasksCreatedThisWeek,
        tasksCompletedThisWeek,
      },
      statusDistribution: [
        { name: "Completed", value: completed },
        { name: "Pending", value: total - completed },
      ],
      weeklyActivity,
      recentActivity,
    },
  });
});
