# System Walkthrough

Here's the full flow from page load to interaction:

---

## 1. Page Load (`src/index.html`)

The browser loads `index.html`, which has a single `<div id="app"></div>` and a `<script type="module" src="app.js">`. The module script kicks everything off.

---

## 2. State Initialization (`src/app.js`)

```js
let state = {
  todos: loadTodos(),  // reads localStorage, returns [] if empty
  filter: 'all',
};
```

State is a plain object — two fields, nothing else.

---

## 3. Initial Render

`render()` is called once at the bottom of `app.js`. It reads `state`, builds DOM nodes with `createElement`, and appends them to `#app`. On the very first render, it also focuses the new-todo input.

The `el()` helper is a small utility that creates elements, sets properties, and wires event listeners — it's what keeps the rendering code readable without a framework.

---

## 4. User Adds a Todo

User types in `#new-todo` and presses Enter → `handleAdd(text)` → `addTodo(state.todos, text)` (pure, returns new array) → `setState({ todos: [...] })`.

`setState` does three things in order:
1. Merges the patch into state immutably (`{ ...state, ...patch }`)
2. Calls `saveTodos()` to persist to localStorage
3. Calls `render()` to rebuild the DOM

---

## 5. Every Subsequent Action

All user actions follow the same pattern:

| Action | Handler | Pure function called |
|--------|---------|---------------------|
| Check a todo | `handleToggle(id)` | `toggleTodo(todos, id)` |
| Delete a todo | `handleRemove(id)` | `removeTodo(todos, id)` |
| Double-click label | `beginEdit(li, todo)` | — (DOM only, no state change yet) |
| Commit edit (Enter/blur) | `handleEdit(id, text)` | `editTodo(todos, id, text)` |
| Click filter button | `handleSetFilter(f)` | — (only `filter` in state changes) |
| Clear completed | `handleClearCompleted()` | `clearCompleted(todos)` |

Each calls `setState` → persist → re-render.

---

## 6. Rendering

On every render, `#app` is cleared (`app.innerHTML = ''`) and rebuilt from scratch. The visible list is derived by passing `state.todos` through `filterTodos(todos, state.filter)` — a pure function in `src/todo.js` that just returns a filtered copy. The footer item count comes from `countActive(todos)`.

---

## 7. Editing Flow (special case)

Double-clicking a label calls `beginEdit(li, todo)` which injects an `<input>` into the existing list item and focuses it — it does *not* trigger a full re-render. Only when the user commits (Enter or blur) or cancels (Escape) does `render()` run again, replacing the edit input with the normal view.

---

## 8. Persistence

`saveTodos` and `loadTodos` in `src/storage.js` are the only functions that touch `localStorage`. They're called exclusively by `app.js` — the pure functions in `todo.js` know nothing about storage.
