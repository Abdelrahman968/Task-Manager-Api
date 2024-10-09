const Task = require("../models/Task");

createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = new Task({ title, description, status, user: req.user._id });
    await task.save();
    res
      .status(201)
      .json({ message: "Task Created successfully", content: task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ user: req.user._id });
    }
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

getUserTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      { title, description, status, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// with ChatGPT
// Search for tasks by title or description
// searchTasks = async (req, res) => {
//   const { keyword } = req.query;
//   try {
//     if (!req.user) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const filter = req.user.role === "admin" ? {} : { user: req.user._id };

//     const tasks = await Task.find({
//       ...filter,
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } },
//       ],
//     });

//     if (tasks.length === 0) {
//       return res.status(404).json({ message: "No tasks found" });
//     }

//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getUserTasks,
  //   searchTasks,
};
