// Pure todo domain functions — no side effects

export const createTodo = (text) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
});

export const addTodo = (todos, text) => {
  if (!text || !text.trim()) return todos;
  return [...todos, createTodo(text)];
};

export const removeTodo = (todos, id) =>
  todos.filter((todo) => todo.id !== id);

export const toggleTodo = (todos, id) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

export const editTodo = (todos, id, text) => {
  if (!text || !text.trim()) return todos;
  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: text.trim() } : todo
  );
};

export const filterTodos = (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const clearCompleted = (todos) =>
  todos.filter((todo) => !todo.completed);

export const countActive = (todos) =>
  todos.filter((todo) => !todo.completed).length;
