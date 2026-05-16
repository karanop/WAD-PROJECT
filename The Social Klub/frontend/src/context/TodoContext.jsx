import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

const TODO_STORAGE_KEY = 'social_klub_todos';

export const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TODO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (e) {
      console.error('Failed to load todos from localStorage:', e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save todos to localStorage:', e);
    }
  }, [tasks]);

  const addTask = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return true;
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const value = {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    addTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    activeCount,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
