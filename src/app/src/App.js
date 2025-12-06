import { useState } from "react";
import { useTodo } from "./hooks/useTodo";
import "./App.css";

function App() {
  const { todos, loading, error, setError, createTodo } = useTodo();
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      createTodo(newTodo);
      setNewTodo("");
    }
  };

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo Application</h1>
      </header>

      <main className="App-main">
        <div className="todo-list-section">
          <h2>List of TODOs</h2>

          {loading && todos.length === 0 && <p>Loading todos...</p>}

          {error && <div className="error-message">{error}</div>}

          {todos.length === 0 && !loading ? (
            <p>No todos yet. Create your first todo!</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo._id} className="todo-item">
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="todo-form-section">
          <h2>Create a ToDo</h2>
          <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-group">
              <label htmlFor="todo">ToDo: </label>
              <input
                type="text"
                id="todo"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Enter your todo item"
                disabled={loading}
              />
            </div>
            <div className="form-submit">
              <button type="submit" disabled={loading || !newTodo.trim()}>
                {loading ? "Adding..." : "Add ToDo!"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
