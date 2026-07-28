import { useEffect, useState } from "react";
import "./App.css";
import type { Task, TaskCreateOrUpdate } from "./types";
import { createTask, deleteTask, fetchTasks, updateTask } from "./api";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const handleCreateOrUpdate = async (taskInput: TaskCreateOrUpdate) => {
    setError(null);

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskInput);
        setTasks((prev) =>
          prev.map((task) => (task.id === updated.id ? updated : task))
        );
        setEditingTask(null);
      } else {
        const created = await createTask(taskInput);
        setTasks((prev) => [...prev, created]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save task";
      setError(message);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(message);
    }
  };

  const handleRefresh = () => {
    void loadTasks();
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Task Manager</h1>
        <p className="subtitle">Manage tasks.</p>
      </header>

      <main className="layout">
        <div className="layout-column">
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleCreateOrUpdate}
            onCancelEdit={handleCancelEdit}
          />

          {error ? <div className="alert-error">{error}</div> : null}
        </div>

        <div className="layout-column">
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
}