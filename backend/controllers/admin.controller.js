const User = require("../models/user.model");
const Task = require("../models/task.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        statusCounts: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        priorityCounts: [
          { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });

  const result = {
    totalUsers,
    activeUsers,
    totalTasks: stats[0].totalTasks[0]?.count || 0,
    statusStats: stats[0].statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    priorityStats: stats[0].priorityCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {})
  };

  return res.status(200).json(new ApiResponse(200, result, "Dashboard stats fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("createdBy", "fullName email");
  return res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched successfully"));
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllTasks
};
