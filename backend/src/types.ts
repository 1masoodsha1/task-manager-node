export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: TaskStatus;
    dueDate?: string | null;
}

export type TaskCreateOrUpdate = Omit<Task, "id">;

export interface WorkPlanTask {
    id: number;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    priority?: string | number;
    estimatedMinutes: number;
}

export interface WorkPlanResponse {
    totalMinutes: number;
    remainingMinutes: number;
    tasks: WorkPlanTask[];
}