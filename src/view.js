// View layer — pure functions that return HTML strings from state.
// Side-effect-free: these just produce markup.

const renderTodoItem = (todo) => {
  const checkedAttr = todo.completed ? " checked" : "";
  const completedClass = todo.completed ? " completed" : "";
  return `<li class="todo-item${completedClass}" data-id="${todo.id}">
      <input type="checkbox" class="toggle"${checkedAttr} />
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" aria-label="Delete">&times;</button>
    </li>`;
};

const renderTodoList = (todos) =>
  todos.length === 0
    ? '<p class="empty-message">Nothing to do yet. Add a task above!</p>'
    : `<ul class="todo-list">${todos.map(renderTodoItem).join("")}</ul>`;

const renderFooter = (remaining, filter) => {
  const btnClass = (f) => (f === filter ? "filter-btn active" : "filter-btn");
  return `<footer class="footer">
      <span class="count">${remaining} item${remaining === 1 ? "" : "s"} left</span>
      <div class="filters">
        <button class="${btnClass("all")}" data-filter="all">All</button>
        <button class="${btnClass("active")}" data-filter="active">Active</button>
        <button class="${btnClass("completed")}" data-filter="completed">Completed</button>
      </div>
      <button class="clear-completed-btn">Clear completed</button>
    </footer>`;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { renderTodoItem, renderTodoList, renderFooter };
}
