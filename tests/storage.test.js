import { describe, test, expect, beforeEach } from '@jest/globals';
import { saveTodos, loadTodos } from '../src/storage.js';

const STORAGE_KEY = 'todo-app-todos';

beforeEach(() => {
  localStorage.clear();
});

// --- saveTodos ---

describe('saveTodos', () => {
  test('persists todos to localStorage', () => {
    const todos = [{ id: '1', text: 'Buy milk', completed: false }];
    saveTodos(todos);
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(stored)).toEqual(todos);
  });

  test('overwrites previously saved todos', () => {
    saveTodos([{ id: '1', text: 'Old', completed: false }]);
    const updated = [{ id: '2', text: 'New', completed: true }];
    saveTodos(updated);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(updated);
  });

  test('saves an empty array', () => {
    saveTodos([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });
});

// --- loadTodos ---

describe('loadTodos', () => {
  test('returns an empty array when nothing is stored', () => {
    expect(loadTodos()).toEqual([]);
  });

  test('loads todos that were previously saved', () => {
    const todos = [{ id: '1', text: 'Buy milk', completed: false }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    expect(loadTodos()).toEqual(todos);
  });

  test('returns an empty array for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');
    expect(loadTodos()).toEqual([]);
  });

  test('returns an empty array when stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
    expect(loadTodos()).toEqual([]);
  });

  test('round-trips todos through save and load', () => {
    const todos = [
      { id: '1', text: 'First', completed: false, createdAt: 1000 },
      { id: '2', text: 'Second', completed: true, createdAt: 2000 },
    ];
    saveTodos(todos);
    expect(loadTodos()).toEqual(todos);
  });
});
