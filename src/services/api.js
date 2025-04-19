import axios from "axios";

const apiClient = axios.create({
  baseURL:
    "https://5000-gbrah-gitpodandroidstu-x0c3qydpzif.ws-eu118.gitpod.io/api", // remplace ça par ton vrai endpoint
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
