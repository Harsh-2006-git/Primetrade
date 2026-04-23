const Task = require("../models/task.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const cacheService = require("../services/cache.service");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  // Invalidate cache when new data is created
  cacheService.flush();

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const { status, priority, sortBy, order, search, page = 1, limit = 10 } = req.query;

  const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const sort = {};
  if (sortBy) {
    sort[sortBy] = order === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const tasks = await Task.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "fullName email");

  const total = await Task.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      },
      "Tasks fetched successfully"
    )
  );
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate("createdBy", "fullName email");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== "admin" && task.createdBy._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to view this task");
  }

  return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  // Invalidate cache
  cacheService.flush();

  return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this task");
  }

  await Task.findByIdAndDelete(req.params.id);

  // Invalidate cache
  cacheService.flush();

  return res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
