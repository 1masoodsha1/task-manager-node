import type { Task, TaskCreateOrUpdate } from "./types";

const API_BASE_URL = (
import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.detail === "string") {
      return record.detail;
    }

    if (typeof record.dueDate === "string") {
      return record.dueDate;
    }

    if (Array.isArray(record.dueDate)) {
      return record.dueDate.join(", ");
    }
  }

  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw new Error(getErrorMessage(data, "Request failed"));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function fetchTasks(): Promise<Task[]> {
  return request<Task[]>("/api/tasks/");
}

export function fetchTask(id: number): Promise<Task> {
  return request<Task>(`/api/tasks/${id}/`);
}

export function createTask(task: TaskCreateOrUpdate): Promise<Task> {
  return request<Task>("/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export function updateTask(
  id: number,
  task: TaskCreateOrUpdate
): Promise<Task> {
  return request<Task>(`/api/tasks/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export function deleteTask(id: number): Promise<void> {
  return request<void>(`/api/tasks/${id}/`, {
    method: "DELETE",
  });
}