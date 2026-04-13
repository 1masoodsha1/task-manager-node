import "./TaskList.css";
import type { Task } from "../types";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void> | void;
  onRefresh: () => void;
};

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "DONE") {
    return false;
  }

  return new Date(task.dueDate).getTime() < new Date().getTime();
}

function formatDueDate(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onRefresh,
}: TaskListProps) {
  return (
    <div className="task-list">
      <div className="list-header">
        <h3>Tasks</h3>
        <button type="button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : tasks.length === 0 ? (
        <div>No tasks yet</div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="row">
                <div className="main">
                  <strong>{task.title}</strong>

                  <div className="meta">
                    <span className="status">{task.status}</span>

                    {isOverdue(task) ? (
                      <span className="overdue-badge"> • OVERDUE</span>
                    ) : null}

                    {task.dueDate ? (
                      <span> • due {formatDueDate(task.dueDate)}</span>
                    ) : null}
                  </div>

                  {task.description ? (
                    <div className="desc">{task.description}</div>
                  ) : null}
                </div>

                <div className="actions">
                  <button type="button" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete task?")) {
                        void onDelete(task.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}