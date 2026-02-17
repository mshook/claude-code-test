# CLAUDE.md

## Project Overview

**claude-code-test** is a browser-based todo application with persistent storage (localStorage). Built entirely in vanilla JavaScript using a functional programming style. No frameworks, no bundler — just plain JS loaded via script tags.

## Project Structure

```
/
├── src/
│   ├── index.html    # Entry point — loads all scripts, contains styles
│   ├── app.js        # Wires together domain, storage, and view; handles DOM events (only file with side effects)
│   ├── todo.js       # Pure todo domain functions (createTodo, addTodo, removeTodo, toggleTodo, editTodo, clearCompleted, filterTodos, countRemaining)
│   ├── storage.js    # Persistence layer — loadTodos/saveTodos via localStorage
│   └── view.js       # Pure rendering functions — returns HTML strings (renderTodoItem, renderTodoList, renderFooter)
├── tests/
│   ├── todo.test.js    # 20 tests covering all domain functions
│   ├── storage.test.js # 6 tests including round-trip persistence
│   └── view.test.js    # 9 tests for HTML rendering output
├── package.json
├── CLAUDE.md
└── README.md
```

## Architecture

### Layered Design

1. **Domain (`todo.js`)** — Pure functions that operate on arrays of todo objects. No side effects. Every function takes data in and returns new data out. This is the core logic.
2. **Storage (`storage.js`)** — Reads/writes todos to localStorage. Functions accept an optional `storage` parameter (defaults to `localStorage`) for testability.
3. **View (`view.js`)** — Pure functions that take state and return HTML strings. No DOM access.
4. **App (`app.js`)** — The only file with side effects. An IIFE that holds state, wires up event listeners, and calls render on every state change.

### Todo Object Shape

```js
{ id: "string", text: "string", completed: boolean }
```

### Functional Programming Conventions

- Pure functions with explicit inputs and outputs
- No classes — plain objects and functions only
- Immutable data — never mutate; always return new copies
- Side effects isolated to `app.js`
- All modules use `if (typeof module !== "undefined")` guards for dual browser/Node compatibility

## Development Commands

```bash
npm install       # Install dependencies (Jest + jsdom)
npm test          # Run all 35 tests (Jest with jsdom environment)
npm start         # Serve the app locally (npx serve src)
```

## Testing

- **Framework**: Jest with `jest-environment-jsdom`
- **Pattern**: Test files mirror source files — `todo.test.js` tests `todo.js`, etc.
- **Storage tests** use an in-memory mock that behaves like localStorage
- **All domain/view functions are pure**, making them trivial to test — no mocking needed
- Run with: `npm test`

## Key Conventions

- **camelCase** for variables and functions
- **Lowercase** filenames (e.g., `todo.js`, `view.js`)
- Test files named `<module>.test.js` in the `tests/` directory
- CommonJS exports guarded with `typeof module !== "undefined"` for browser compatibility
- No build step — scripts are loaded directly via `<script>` tags in order

## Key Principles for AI Assistants

1. **Read before writing** — Always read existing files before proposing changes
2. **Keep it simple** — No bundlers, no frameworks; vanilla JS is intentional
3. **Functional style** — No classes, no mutation, pure functions where possible
4. **Test everything** — Every new function needs a corresponding test; run `npm test` to verify
5. **Side effects only in `app.js`** — All other modules must remain pure
6. **Browser-first** — The app runs via `index.html` in a browser with no build step
7. **Persistence** — Todos survive page reloads via localStorage
