import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import taskRouter from "./controllers/taskController";
import { errorHandler } from "./middleware/errorHandler";
import { seedDatabase } from "./seed";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const allowedOrigins = [
"http://localhost:4200",
"http://127.0.0.1:4200",
"http://localhost:5173",
"http://127.0.0.1:5173",
];

async function main() {
  await AppDataSource.initialize();
  await seedDatabase(AppDataSource);

  const app = express();

  app.use(
    cors({
      origin: allowedOrigins,
    })
  );

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "Task Manager API",
      version: "v1",
      framework: "Node.js + TypeScript",
    });
  });

  app.use("/api/tasks", taskRouter);

  app.use((_req, res) => {
    res.status(404).json({ detail: "Not found" });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});