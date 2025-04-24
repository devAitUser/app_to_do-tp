import axios from "axios";

const apiClient = axios.create({
  baseURL:
    "http://34.136.232.112/api", // remplace ça par ton vrai endpoint
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await apiClient.get("/tasks");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      throw error;
    }
  },
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  },
};
