import React, { useState, useEffect } from "react";
import { taskService } from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
      } catch (err) {
        setError("Erreur lors du chargement des tâches");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste des tâches</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            {task.completed ? "  ✅" : "  ❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
