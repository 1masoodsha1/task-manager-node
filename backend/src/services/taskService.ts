import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import {
normalizeAndValidateTaskInput,
notFoundError,
type TaskPayload,
} from "../schemas/taskSchemas";

export class TaskService {
private readonly taskRepo = AppDataSource.getRepository(Task);

async getAllTasks(): Promise<Task[]> {
    return this.taskRepo.find({
      order: {
        id: "ASC",
      },
    });
  }

  async getTask(id: number): Promise<Task> {
    if (!Number.isInteger(id) || id <= 0) {
      throw notFoundError();
    }

    const task = await this.taskRepo.findOneBy({ id });

    if (!task) {
      throw notFoundError();
    }

    return task;
  }

  async createTask(payload: TaskPayload): Promise<Task> {
    const normalized = normalizeAndValidateTaskInput(payload);
    const task = this.taskRepo.create(normalized);
    return this.taskRepo.save(task);
  }

  async updateTask(id: number, payload: TaskPayload): Promise<Task> {
    const existing = await this.getTask(id);
    const normalized = normalizeAndValidateTaskInput(payload);

    existing.title = normalized.title;
    existing.description = normalized.description;
    existing.status = normalized.status;
    existing.dueDate = normalized.dueDate;

    return this.taskRepo.save(existing);
  }

  async deleteTask(id: number): Promise<void> {
    const existing = await this.getTask(id);
    await this.taskRepo.remove(existing);
  }
}