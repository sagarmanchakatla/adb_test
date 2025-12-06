import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useTodo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/todos/`);
      const data = await response.json();
      setTodos(data);
    } catch {
      setError("Failed to load todos.");
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (description) => {
    try {
      setLoading(true);
      await fetch(`${API_BASE_URL}/todos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo_description: description }),
      });
      fetchTodos();
    } catch {
      setError("Failed to create todo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    setError,
    createTodo,
  };
};
