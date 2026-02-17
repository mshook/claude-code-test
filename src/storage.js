// Persistence layer — reads and writes todos to localStorage.

const STORAGE_KEY = "todo-app-todos";

const loadTodos = (storage = localStorage) => {
  try {
    const data = storage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos, storage = localStorage) => {
  storage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORAGE_KEY, loadTodos, saveTodos };
}
