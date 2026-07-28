import { useEffect, useState } from "react";
import "./TaskForm.css";
import type { Task, TaskCreateOrUpdate, TaskStatus } from "../../types";

type TaskFormProps = {
  initialTask: Task | null;
  onSubmit: (task: TaskCreateOrUpdate) => Promise<void> | void;
  onCancelEdit: () => void;
};

type FormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
};

const defaultForm: FormValues = {
  title: "",
  description: "",
  status: "TODO",
  dueDate: "",
};

function toDateTimeLocalValue(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function TaskForm({
  initialTask,
  onSubmit,
  onCancelEdit,
}: TaskFormProps) {
  const [form, setForm] = useState<FormValues>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title ?? "",
        description: initialTask.description ?? "",
        status: initialTask.status ?? "TODO",
        dueDate: toDateTimeLocalValue(initialTask.dueDate),
      });
      return;
    }

    setForm(defaultForm);
  }, [initialTask]);

  const hasTitleError = !form.title.trim();

  const hasPastDueDateError =
    !!form.dueDate &&
    form.status !== "DONE" &&
    new Date(form.dueDate).getTime() < new Date().getTime();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (hasTitleError || hasPastDueDateError) {
      return;
    }

    const payload: TaskCreateOrUpdate = {
      title: form.title.trim(),
      description: form.description.trim() ? form.description.trim() : null,
      status: form.status,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);

      if (!initialTask) {
        setForm(defaultForm);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    onCancelEdit();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />
        {hasTitleError ? <div className="error">Title is required</div> : null}
      </div>

      <div className="task-form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="task-form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      <div className="task-form-group">
        <label htmlFor="dueDate">Due date &amp; time</label>
        <input
          id="dueDate"
          name="dueDate"
          type="datetime-local"
          value={form.dueDate}
          onChange={handleChange}
        />
        {hasPastDueDateError ? (
          <div className="error">
            Past due date/time is only allowed for completed tasks.
          </div>
        ) : null}
      </div>

      <div className="buttons">
        <button
          type="submit"
          disabled={submitting || hasTitleError || hasPastDueDateError}
        >
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}