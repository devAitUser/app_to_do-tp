import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleTaskAdded = () => {
    setRefresh(!refresh); // simple refresh toggle
  };

  return (
    <div>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList key={refresh} />
    </div>
  );
};

export default App;
