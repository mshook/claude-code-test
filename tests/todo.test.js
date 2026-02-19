const {
  createTodo,
  addTodo,
  removeTodo,
  toggleTodo,
  editTodo,
  clearCompleted,
  filterTodos,
  countRemaining,
} = require("../src/todo");

describe("createTodo", () => {
  test("creates a todo with given text and id", () => {
    const todo = createTodo("Buy milk", "1");
    expect(todo).toEqual({ id: "1", text: "Buy milk", completed: false });
  });

  test("defaults completed to false", () => {
    expect(createTodo("Task", "1").completed).toBe(false);
  });
});

describe("addTodo", () => {
  test("appends a new todo to the list", () => {
    const result = addTodo([], "First task", "1");
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("First task");
  });

  test("does not mutate the original list", () => {
    const original = [createTodo("Existing", "1")];
    const result = addTodo(original, "New", "2");
    expect(original).toHaveLength(1);
    expect(result).toHaveLength(2);
  });
});

describe("removeTodo", () => {
  test("removes the todo with the given id", () => {
    const todos = [createTodo("A", "1"), createTodo("B", "2")];
    const result = removeTodo(todos, "1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  test("returns the same items when id not found", () => {
    const todos = [createTodo("A", "1")];
    expect(removeTodo(todos, "999")).toHaveLength(1);
  });

  test("does not mutate the original list", () => {
    const todos = [createTodo("A", "1")];
    removeTodo(todos, "1");
    expect(todos).toHaveLength(1);
  });
});

describe("toggleTodo", () => {
  test("toggles completed from false to true", () => {
    const todos = [createTodo("A", "1")];
    const result = toggleTodo(todos, "1");
    expect(result[0].completed).toBe(true);
  });

  test("toggles completed from true to false", () => {
    const todos = [{ id: "1", text: "A", completed: true }];
    const result = toggleTodo(todos, "1");
    expect(result[0].completed).toBe(false);
  });

  test("only toggles the matching todo", () => {
    const todos = [createTodo("A", "1"), createTodo("B", "2")];
    const result = toggleTodo(todos, "2");
    expect(result[0].completed).toBe(false);
    expect(result[1].completed).toBe(true);
  });

  test("does not mutate original todos", () => {
    const todos = [createTodo("A", "1")];
    toggleTodo(todos, "1");
    expect(todos[0].completed).toBe(false);
  });
});

describe("editTodo", () => {
  test("updates the text of the matching todo", () => {
    const todos = [createTodo("Old text", "1")];
    const result = editTodo(todos, "1", "New text");
    expect(result[0].text).toBe("New text");
  });

  test("does not change other todos", () => {
    const todos = [createTodo("A", "1"), createTodo("B", "2")];
    const result = editTodo(todos, "1", "Changed");
    expect(result[1].text).toBe("B");
  });
});

describe("clearCompleted", () => {
  test("removes all completed todos", () => {
    const todos = [
      { id: "1", text: "A", completed: true },
      { id: "2", text: "B", completed: false },
      { id: "3", text: "C", completed: true },
    ];
    const result = clearCompleted(todos);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  test("returns all todos when none are completed", () => {
    const todos = [createTodo("A", "1"), createTodo("B", "2")];
    expect(clearCompleted(todos)).toHaveLength(2);
  });
});

describe("filterTodos", () => {
  const todos = [
    { id: "1", text: "A", completed: false },
    { id: "2", text: "B", completed: true },
    { id: "3", text: "C", completed: false },
  ];

  test("returns all todos for 'all' filter", () => {
    expect(filterTodos(todos, "all")).toHaveLength(3);
  });

  test("returns only active todos for 'active' filter", () => {
    const result = filterTodos(todos, "active");
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  test("returns only completed todos for 'completed' filter", () => {
    const result = filterTodos(todos, "completed");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  test("defaults to all for unknown filter", () => {
    expect(filterTodos(todos, "unknown")).toHaveLength(3);
  });
});

describe("countRemaining", () => {
  test("counts non-completed todos", () => {
    const todos = [
      { id: "1", text: "A", completed: false },
      { id: "2", text: "B", completed: true },
      { id: "3", text: "C", completed: false },
    ];
    expect(countRemaining(todos)).toBe(2);
  });

  test("returns 0 when all completed", () => {
    const todos = [{ id: "1", text: "A", completed: true }];
    expect(countRemaining(todos)).toBe(0);
  });

  test("returns length when none completed", () => {
    const todos = [createTodo("A", "1"), createTodo("B", "2")];
    expect(countRemaining(todos)).toBe(2);
  });
});
