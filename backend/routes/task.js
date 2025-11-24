const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
// get tasks for the login user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// create a new task
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// update task
router.put("/:id", auth, async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updatedTaskData = {};
    if (title) updatedTaskData.title = title;
    if (description) updatedTaskData.description = description;
    if (completed !== undefined) updatedTaskData.completed = completed;


    const taskAfterUpdate = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedTaskData },
      { new: true }
    );

    res.json(taskAfterUpdate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;