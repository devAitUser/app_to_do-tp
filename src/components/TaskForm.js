import React, { useState } from "react";
import { taskService } from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const newTask = await taskService.createTask({ title });
      setTitle("");
      if (onTaskAdded) onTaskAdded(newTask);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une tâche</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
};

export default TaskForm;
