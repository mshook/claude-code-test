# CLAUDE.md

## Project Overview

**claude-code-test** is a browser-based todo application with persistent storage. The project emphasizes a functional programming style and requires test coverage.

## Project Status

This project is in its initial phase. Only the README with project requirements exists. All implementation — source code, dependencies, build tooling, and tests — is yet to be created.

## Requirements (from README)

- Todo app that runs in the browser
- Data must persist (e.g., localStorage, IndexedDB, or a backend)
- Functional programming style throughout
- Tests must be included

## Intended Architecture & Conventions

### Functional Programming Style

- Prefer pure functions with explicit inputs and outputs
- Avoid class-based patterns; use plain objects and functions
- Use immutable data — never mutate state directly; return new copies
- Separate side effects (DOM manipulation, storage I/O) from pure logic
- Compose small, focused functions rather than writing large monolithic ones

### Code Organization

When building out the project, follow this general structure:

```
/
├── src/              # Application source code
│   ├── index.html    # Entry point HTML
│   ├── app.js        # Main application logic / entry
│   ├── todo.js       # Pure todo domain functions (add, remove, toggle, filter)
│   └── storage.js    # Persistence layer (localStorage or similar)
├── tests/            # Test files
├── package.json      # Dependencies and scripts
└── README.md         # Project description
```

### Naming Conventions

- Use **camelCase** for variables and functions
- Use **PascalCase** for type names or constructors (if any)
- Name files in **lowercase with hyphens** (e.g., `todo-list.js`) or simple lowercase (e.g., `todo.js`)
- Test files should mirror source files: `todo.test.js` for `todo.js`

### Testing

- All pure logic functions must have corresponding tests
- Tests should cover: adding todos, removing todos, toggling completion, filtering, and persistence round-trips
- Aim for unit tests on pure functions and integration tests for storage/UI interactions

## Development Workflow

### Setup (once project is scaffolded)

```bash
npm install
```

### Common Commands (expected)

```bash
npm test          # Run test suite
npm start         # Start development server
npm run build     # Production build (if applicable)
npm run lint      # Lint source files (if configured)
```

### Git Practices

- Write clear, descriptive commit messages
- Keep commits focused on a single logical change
- The main development branch may vary; check current branch before pushing

## Key Principles for AI Assistants

1. **Read before writing** — Always read existing files before proposing changes
2. **Keep it simple** — Only add what is needed; avoid over-engineering
3. **Functional style** — No classes, no mutation, pure functions where possible
4. **Test everything** — Every new function should have a corresponding test
5. **Persist data** — Ensure todos survive page reloads
6. **Browser-first** — The app must work in a browser environment
7. **Minimal dependencies** — Prefer standard web APIs; only add libraries when they provide clear value
