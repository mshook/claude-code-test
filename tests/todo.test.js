import { describe, test, expect } from '@jest/globals';
import {
  createTodo,
  addTodo,
  removeTodo,
  toggleTodo,
  editTodo,
  filterTodos,
  clearCompleted,
  countActive,
} from '../src/todo.js';

// --- createTodo ---

describe('createTodo', () => {
  test('creates a todo with the given text', () => {
    const todo = createTodo('Buy milk');
    expect(todo.text).toBe('Buy milk');
  });

  test('trims whitespace from text', () => {
    const todo = createTodo('  Buy milk  ');
    expect(todo.text).toBe('Buy milk');
  });

  test('defaults completed to false', () => {
    const todo = createTodo('Task');
    expect(todo.completed).toBe(false);
  });

  test('generates a unique id', () => {
    const a = createTodo('A');
    const b = createTodo('B');
    expect(a.id).toBeDefined();
    expect(a.id).not.toBe(b.id);
  });

  test('records a createdAt timestamp', () => {
    const before = Date.now();
    const todo = createTodo('Task');
    const after = Date.now();
    expect(todo.createdAt).toBeGreaterThanOrEqual(before);
    expect(todo.createdAt).toBeLessThanOrEqual(after);
  });
});

// --- addTodo ---

describe('addTodo', () => {
  test('adds a todo to an empty list', () => {
    const result = addTodo([], 'Buy milk');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Buy milk');
  });

  test('appends to an existing list', () => {
    const initial = addTodo([], 'First');
    const result = addTodo(initial, 'Second');
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('Second');
  });

  test('returns the original list unchanged for empty text', () => {
    const todos = addTodo([], 'Existing');
    expect(addTodo(todos, '')).toStrictEqual(todos);
    expect(addTodo(todos, '   ')).toStrictEqual(todos);
  });

  test('does not mutate the original array', () => {
    const original = [];
    addTodo(original, 'New');
    expect(original).toHaveLength(0);
  });
});

// --- removeTodo ---

describe('removeTodo', () => {
  test('removes a todo by id', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    const result = removeTodo(todos, id);
    expect(result).toHaveLength(0);
  });

  test('leaves other todos intact', () => {
    let todos = addTodo([], 'First');
    todos = addTodo(todos, 'Second');
    const idToRemove = todos[0].id;
    const result = removeTodo(todos, idToRemove);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Second');
  });

  test('returns the same list if id does not exist', () => {
    const todos = addTodo([], 'Task');
    const result = removeTodo(todos, 'nonexistent-id');
    expect(result).toHaveLength(1);
  });

  test('does not mutate the original array', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    removeTodo(todos, id);
    expect(todos).toHaveLength(1);
  });
});

// --- toggleTodo ---

describe('toggleTodo', () => {
  test('marks an incomplete todo as completed', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    const result = toggleTodo(todos, id);
    expect(result[0].completed).toBe(true);
  });

  test('marks a completed todo as incomplete', () => {
    let todos = addTodo([], 'Task');
    const id = todos[0].id;
    todos = toggleTodo(todos, id);       // now completed
    const result = toggleTodo(todos, id); // back to incomplete
    expect(result[0].completed).toBe(false);
  });

  test('only toggles the targeted todo', () => {
    let todos = addTodo([], 'First');
    todos = addTodo(todos, 'Second');
    const result = toggleTodo(todos, todos[0].id);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(false);
  });

  test('does not mutate the original array', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    toggleTodo(todos, id);
    expect(todos[0].completed).toBe(false);
  });
});

// --- editTodo ---

describe('editTodo', () => {
  test('updates the text of the targeted todo', () => {
    const todos = addTodo([], 'Old text');
    const id = todos[0].id;
    const result = editTodo(todos, id, 'New text');
    expect(result[0].text).toBe('New text');
  });

  test('trims the new text', () => {
    const todos = addTodo([], 'Old text');
    const id = todos[0].id;
    const result = editTodo(todos, id, '  New text  ');
    expect(result[0].text).toBe('New text');
  });

  test('returns unchanged list for empty text', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    expect(editTodo(todos, id, '')).toStrictEqual(todos);
    expect(editTodo(todos, id, '   ')).toStrictEqual(todos);
  });

  test('does not mutate the original array', () => {
    const todos = addTodo([], 'Task');
    const id = todos[0].id;
    editTodo(todos, id, 'New text');
    expect(todos[0].text).toBe('Task');
  });
});

// --- filterTodos ---

describe('filterTodos', () => {
  const makeTodos = () => {
    let todos = addTodo([], 'Active task');
    todos = addTodo(todos, 'Completed task');
    return toggleTodo(todos, todos[1].id); // complete the second
  };

  test('"all" returns every todo', () => {
    const todos = makeTodos();
    expect(filterTodos(todos, 'all')).toHaveLength(2);
  });

  test('"active" returns only incomplete todos', () => {
    const todos = makeTodos();
    const result = filterTodos(todos, 'active');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(false);
  });

  test('"completed" returns only completed todos', () => {
    const todos = makeTodos();
    const result = filterTodos(todos, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  test('unknown filter falls back to "all"', () => {
    const todos = makeTodos();
    expect(filterTodos(todos, 'unknown')).toHaveLength(2);
  });

  test('does not mutate the original array', () => {
    const todos = makeTodos();
    filterTodos(todos, 'active');
    expect(todos).toHaveLength(2);
  });
});

// --- clearCompleted ---

describe('clearCompleted', () => {
  test('removes all completed todos', () => {
    let todos = addTodo([], 'Active');
    todos = addTodo(todos, 'Done');
    todos = toggleTodo(todos, todos[1].id);
    const result = clearCompleted(todos);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Active');
  });

  test('returns unchanged list when nothing is completed', () => {
    const todos = addTodo([], 'Active');
    expect(clearCompleted(todos)).toHaveLength(1);
  });

  test('returns empty list when all todos are completed', () => {
    let todos = addTodo([], 'Done');
    todos = toggleTodo(todos, todos[0].id);
    expect(clearCompleted(todos)).toHaveLength(0);
  });
});

// --- countActive ---

describe('countActive', () => {
  test('returns 0 for an empty list', () => {
    expect(countActive([])).toBe(0);
  });

  test('counts only incomplete todos', () => {
    let todos = addTodo([], 'A');
    todos = addTodo(todos, 'B');
    todos = addTodo(todos, 'C');
    todos = toggleTodo(todos, todos[0].id); // complete A
    expect(countActive(todos)).toBe(2);
  });

  test('returns 0 when all are completed', () => {
    let todos = addTodo([], 'A');
    todos = toggleTodo(todos, todos[0].id);
    expect(countActive(todos)).toBe(0);
  });
});
