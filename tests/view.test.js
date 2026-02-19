const {
  renderTodoItem,
  renderTodoList,
  renderFooter,
} = require("../src/view");

describe("renderTodoItem", () => {
  test("renders an active todo without completed class", () => {
    const html = renderTodoItem({ id: "1", text: "Test", completed: false });
    expect(html).toContain('data-id="1"');
    expect(html).toContain("Test");
    expect(html).not.toContain("completed");
    expect(html).not.toContain("checked");
  });

  test("renders a completed todo with completed class and checked attr", () => {
    const html = renderTodoItem({ id: "2", text: "Done", completed: true });
    expect(html).toContain("completed");
    expect(html).toContain("checked");
  });
});

describe("renderTodoList", () => {
  test("renders empty message when list is empty", () => {
    const html = renderTodoList([]);
    expect(html).toContain("Nothing to do yet");
  });

  test("renders a ul with items when list is non-empty", () => {
    const todos = [
      { id: "1", text: "A", completed: false },
      { id: "2", text: "B", completed: true },
    ];
    const html = renderTodoList(todos);
    expect(html).toContain("<ul");
    expect(html).toContain("A");
    expect(html).toContain("B");
  });
});

describe("renderFooter", () => {
  test("shows correct remaining count", () => {
    const html = renderFooter(3, "all");
    expect(html).toContain("3 items left");
  });

  test("uses singular form for 1 item", () => {
    const html = renderFooter(1, "all");
    expect(html).toContain("1 item left");
    expect(html).not.toContain("items");
  });

  test("highlights the active filter button", () => {
    const html = renderFooter(0, "completed");
    expect(html).toContain('class="filter-btn active" data-filter="completed"');
    expect(html).toContain('class="filter-btn" data-filter="all"');
  });
});
