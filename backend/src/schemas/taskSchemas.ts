import { Task, TaskStatus } from "../entity/Task";

export type TaskPayload = {
title?: unknown;
description?: unknown;
status?: unknown;
dueDate?: unknown;
};

export class ApiError extends Error {
status: number;
body: Record<string, string>;

constructor(status: number, body: Record<string, string>) {
    const message =
      typeof body.detail === "string"
        ? body.detail
        : typeof body.dueDate === "string"
          ? body.dueDate
          : "Request failed";

    super(message);
    this.status = status;
    this.body = body;
  }
}

const allowedStatuses = new Set(Object.values(TaskStatus));

export function normalizeAndValidateTaskInput(
  input: TaskPayload
): Omit<Task, "id"> {
  const title = typeof input.title === "string" ? input.title.trim() : "";

  const rawDescription =
    typeof input.description === "string" ? input.description.trim() : "";

  const status = allowedStatuses.has(input.status as TaskStatus)
    ? (input.status as TaskStatus)
    : TaskStatus.TODO;

  let dueDate: Date | null = null;

  if (
    input.dueDate !== undefined &&
    input.dueDate !== null &&
    input.dueDate !== ""
  ) {
    const parsed =
      input.dueDate instanceof Date
        ? input.dueDate
        : new Date(String(input.dueDate));

    if (Number.isNaN(parsed.getTime())) {
      throw new ApiError(400, { detail: "Invalid due date" });
    }

    dueDate = parsed;

    if (status !== TaskStatus.DONE && dueDate.getTime() < Date.now()) {
      throw new ApiError(400, {
        dueDate: "Past due date/time is only allowed for completed tasks.",
      });
    }
  }

  if (!title) {
    throw new ApiError(400, { detail: "Title is required" });
  }

  if (title.length > 255) {
    throw new ApiError(400, {
      detail: "Title must be 255 characters or fewer",
    });
  }

  return {
    title,
    description: rawDescription ? rawDescription : null,
    status,
    dueDate,
  };
}

export function notFoundError(): ApiError {
  return new ApiError(404, { detail: "Not found" });
}