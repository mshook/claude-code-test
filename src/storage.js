// Persistence layer — all localStorage side effects isolated here

const STORAGE_KEY = 'todo-app-todos';

export const saveTodos = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (_) {
    // Ignore storage errors (e.g. private browsing quota exceeded)
  }
};

export const loadTodos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};
