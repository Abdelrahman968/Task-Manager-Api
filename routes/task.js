const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getUserTasks,
  searchTasks,
} = require("../controllers/taskController");

router.post("/", authMiddleware("admin, user"), createTask);
router.get("/", authMiddleware("admin, user"), getTasks);
router.get("/user/:userId", authMiddleware("admin"), getUserTasks);
router.put("/:taskId", authMiddleware("admin, user"), updateTask);
router.delete("/:taskId", authMiddleware("admin, user"), deleteTask);
// router.get("/search", authMiddleware("admin, user"), searchTasks);

module.exports = router;
