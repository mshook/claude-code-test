// Pure todo domain functions — no side effects, no mutation.

const createTodo = (text, id = Date.now().toString()) => ({
  id,
  text,
  completed: false,
});

const addTodo = (todos, text, id) => [...todos, createTodo(text, id)];

const removeTodo = (todos, id) => todos.filter((todo) => todo.id !== id);

const toggleTodo = (todos, id) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

const editTodo = (todos, id, text) =>
  todos.map((todo) => (todo.id === id ? { ...todo, text } : todo));

const clearCompleted = (todos) => todos.filter((todo) => !todo.completed);

const filterTodos = (todos, filter) => {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

const countRemaining = (todos) =>
  todos.filter((todo) => !todo.completed).length;

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTodo,
    addTodo,
    removeTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    filterTodos,
    countRemaining,
  };
}
