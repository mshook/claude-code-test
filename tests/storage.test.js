const { STORAGE_KEY, loadTodos, saveTodos } = require("../src/storage");

// A minimal in-memory mock that behaves like localStorage.
const createMockStorage = (initial = {}) => {
  const store = { ...initial };
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    _store: store,
  };
};

describe("loadTodos", () => {
  test("returns an empty array when storage is empty", () => {
    const storage = createMockStorage();
    expect(loadTodos(storage)).toEqual([]);
  });

  test("parses and returns stored todos", () => {
    const todos = [{ id: "1", text: "A", completed: false }];
    const storage = createMockStorage({
      [STORAGE_KEY]: JSON.stringify(todos),
    });
    expect(loadTodos(storage)).toEqual(todos);
  });

  test("returns empty array on corrupt data", () => {
    const storage = createMockStorage({ [STORAGE_KEY]: "not-json!!!" });
    expect(loadTodos(storage)).toEqual([]);
  });
});

describe("saveTodos", () => {
  test("stores todos as JSON", () => {
    const storage = createMockStorage();
    const todos = [{ id: "1", text: "Buy milk", completed: false }];
    saveTodos(todos, storage);
    expect(JSON.parse(storage._store[STORAGE_KEY])).toEqual(todos);
  });

  test("overwrites previous value", () => {
    const storage = createMockStorage({
      [STORAGE_KEY]: JSON.stringify([{ id: "old" }]),
    });
    saveTodos([], storage);
    expect(JSON.parse(storage._store[STORAGE_KEY])).toEqual([]);
  });
});

describe("round-trip", () => {
  test("save then load returns the same data", () => {
    const storage = createMockStorage();
    const todos = [
      { id: "1", text: "A", completed: false },
      { id: "2", text: "B", completed: true },
    ];
    saveTodos(todos, storage);
    expect(loadTodos(storage)).toEqual(todos);
  });
});
