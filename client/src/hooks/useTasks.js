import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "../lib/api";

const emptyStats = { total: 0, pending: 0, completed: 0, completionPercentage: 0 };

export function useTasks(filters) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 8 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [mutationVersion, setMutationVersion] = useState(0);

  const loadTasks = useCallback(async ({ silent = false } = {}) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const response = await api.get("/tasks", { params: { ...filters, limit: 8 } });
      setTasks(response.data.data.tasks);
      setStats(response.data.data.stats);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const createTask = async (values) => {
    const temporary = { ...values, deadline: values.deadline || null, _id: `temp-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTasks((current) => [temporary, ...current].slice(0, 8));
    try {
      const response = await api.post("/tasks", values);
      setTasks((current) => current.map((task) => task._id === temporary._id ? response.data.data.task : task));
      toast.success("Task created");
      setMutationVersion((value) => value + 1);
      loadTasks({ silent: true });
      return true;
    } catch (error) {
      setTasks((current) => current.filter((task) => task._id !== temporary._id));
      toast.error(errorMessage(error));
      return false;
    }
  };

  const updateTask = async (task, changes, successMessage = "Task updated") => {
    const previous = task;
    const optimistic = { ...task, ...changes, updatedAt: new Date().toISOString() };
    setBusyId(task._id);
    setTasks((current) => current.map((item) => item._id === task._id ? optimistic : item));
    try {
      const response = await api.patch(`/tasks/${task._id}`, changes);
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.data.task : item));
      toast.success(successMessage);
      setMutationVersion((value) => value + 1);
      loadTasks({ silent: true });
      return true;
    } catch (error) {
      setTasks((current) => current.map((item) => item._id === task._id ? previous : item));
      toast.error(errorMessage(error));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const deleteTask = async (task) => {
    const previous = tasks;
    setBusyId(task._id);
    setTasks((current) => current.filter((item) => item._id !== task._id));
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      setMutationVersion((value) => value + 1);
      loadTasks({ silent: true });
      return true;
    } catch (error) {
      setTasks(previous);
      toast.error(errorMessage(error));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  return { tasks, stats, pagination, loading, refreshing, busyId, mutationVersion, createTask, updateTask, deleteTask };
}
