import { Router } from "express";
import { TaskService } from "../services/taskService";

const router = Router();
const taskService = new TaskService();

router.get("/", async (_req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await taskService.getTask(id);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await taskService.createTask(req.body);
    res
      .status(201)
      .location(`/api/tasks/${created.id}/`)
      .json(created);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await taskService.updateTask(id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;