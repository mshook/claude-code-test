// App entry — wires together domain, storage, and view.
// This is the only file with side effects (DOM access, event listeners).

(function () {
  "use strict";

  // State
  let todos = loadTodos();
  let currentFilter = "all";

  // DOM references
  const inputEl = document.getElementById("todo-input");
  const listContainer = document.getElementById("list-container");
  const footerContainer = document.getElementById("footer-container");

  // Render the current state to the DOM
  const render = () => {
    const visible = filterTodos(todos, currentFilter);
    listContainer.innerHTML = renderTodoList(visible);
    footerContainer.innerHTML = renderFooter(
      countRemaining(todos),
      currentFilter
    );
  };

  // Persist and re-render after every state change
  const update = (nextTodos) => {
    todos = nextTodos;
    saveTodos(todos);
    render();
  };

  // -- Event handlers --

  const handleAdd = (e) => {
    if (e.key !== "Enter") return;
    const text = inputEl.value.trim();
    if (text === "") return;
    update(addTodo(todos, text));
    inputEl.value = "";
  };

  const handleListClick = (e) => {
    const item = e.target.closest(".todo-item");
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.classList.contains("toggle")) {
      update(toggleTodo(todos, id));
    } else if (e.target.classList.contains("delete-btn")) {
      update(removeTodo(todos, id));
    }
  };

  const handleFooterClick = (e) => {
    if (e.target.classList.contains("filter-btn")) {
      currentFilter = e.target.dataset.filter;
      render();
    } else if (e.target.classList.contains("clear-completed-btn")) {
      update(clearCompleted(todos));
    }
  };

  // -- Bootstrap --
  inputEl.addEventListener("keydown", handleAdd);
  listContainer.addEventListener("click", handleListClick);
  footerContainer.addEventListener("click", handleFooterClick);

  render();
})();
