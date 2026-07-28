import { DataSource } from "typeorm";
import { Task, TaskStatus } from "./entity/Task";

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Task);
  const existingCount = await repo.count();

  if (existingCount > 0) {
    return;
  }

  const now = new Date();

  const tasks = repo.create([
    {
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruit, and rice.",
      status: TaskStatus.TODO,
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    },
    {
      title: "Do laundry",
      description: "Wash clothes and fold them in the evening.",
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date(now.getTime() + 8 * 60 * 60 * 1000),
    },
    {
      title: "Clean the room",
      description: "Vacuum the floor and organize the desk.",
      status: TaskStatus.TODO,
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Pay electricity bill",
      description: "Check the online account and make the payment.",
      status: TaskStatus.TODO,
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  await repo.save(tasks);
}