import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { Task } from "../models/Task.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) throw new ApiError(409, "An account with that email already exists");

  const user = await User.create(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Account created successfully",
    data: { token: generateToken(user._id), user: publicUser(user) },
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  sendSuccess(res, {
    message: "Login successful",
    data: { token: generateToken(user._id), user: publicUser(user) },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const [total, completed] = await Promise.all([
    Task.countDocuments({ userId: req.user._id }),
    Task.countDocuments({ userId: req.user._id, status: "completed" }),
  ]);
  sendSuccess(res, {
    message: "Current user retrieved",
    data: {
      user: publicUser(req.user),
      stats: { total, completed, completionPercentage: total ? Math.round((completed / total) * 100) : 0 },
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    { new: true, runValidators: true },
  );
  sendSuccess(res, { message: "Profile updated successfully", data: { user: publicUser(user) } });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = req.body.newPassword;
  await user.save();
  sendSuccess(res, { message: "Password updated successfully" });
});
