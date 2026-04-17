import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import * as tasksService from "../services/tasksService.js";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = tasksService.subscribeTasks(user.uid, (items) => {
      setTasks(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const create = useCallback(
    (data) => tasksService.createTask(user.uid, data),
    [user]
  );

  const update = useCallback(
    (id, data) => tasksService.updateTask(user.uid, id, data),
    [user]
  );

  const remove = useCallback(
    (id) => tasksService.deleteTask(user.uid, id),
    [user]
  );

  return { tasks, loading, create, update, remove };
}