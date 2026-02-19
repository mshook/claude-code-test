import {
  addTodo,
  removeTodo,
  toggleTodo,
  editTodo,
  filterTodos,
  clearCompleted,
  countActive,
} from './todo.js';
import { saveTodos, loadTodos } from './storage.js';

// --- State ---

let state = {
  todos: loadTodos(),
  filter: 'all',
};

const setState = (patch) => {
  state = { ...state, ...patch };
  if ('todos' in patch) saveTodos(state.todos);
  render();
};

// --- Action handlers ---

const handleAdd = (text) => setState({ todos: addTodo(state.todos, text) });
const handleRemove = (id) => setState({ todos: removeTodo(state.todos, id) });
const handleToggle = (id) => setState({ todos: toggleTodo(state.todos, id) });
const handleEdit = (id, text) => setState({ todos: editTodo(state.todos, id, text) });
const handleSetFilter = (filter) => setState({ filter });
const handleClearCompleted = () => setState({ todos: clearCompleted(state.todos) });

// --- DOM helpers ---

// Create an element with attributes and children.
// Attribute keys starting with 'on' are registered as event listeners.
const el = (tag, attrs = {}, ...children) => {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k.startsWith('on')) {
      element.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'className') {
      element.className = v;
    } else if (k === 'checked') {
      element.checked = v;
    } else if (k === 'placeholder' || k === 'type' || k === 'value' || k === 'id') {
      element[k] = v;
    } else {
      element.setAttribute(k, v);
    }
  });
  children.forEach((child) => {
    if (child == null) return;
    element.append(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return element;
};

// --- Components ---

const beginEdit = (li, todo) => {
  li.classList.add('editing');
  const label = li.querySelector('label');
  label.hidden = true;

  const input = el('input', { type: 'text', className: 'edit-input', value: todo.text });

  const commit = () => {
    const text = input.value.trim();
    if (text && text !== todo.text) handleEdit(todo.id, text);
    else render();
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') render();
  });

  li.append(input);
  input.focus();
  input.select();
};

const TodoItem = (todo) => {
  const li = el('li', {
    className: `todo-item${todo.completed ? ' completed' : ''}`,
    'data-id': todo.id,
  });

  const checkbox = el('input', {
    type: 'checkbox',
    className: 'toggle',
    checked: todo.completed,
    onChange: () => handleToggle(todo.id),
    'aria-label': `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`,
  });

  const label = el('label', {});
  label.textContent = todo.text;
  label.addEventListener('dblclick', () => beginEdit(li, todo));

  const deleteBtn = el('button', {
    className: 'delete-btn',
    onClick: () => handleRemove(todo.id),
    'aria-label': `Delete "${todo.text}"`,
  }, '×');

  li.append(checkbox, label, deleteBtn);
  return li;
};

// --- Render ---

let firstRender = true;

const render = () => {
  const app = document.getElementById('app');
  if (!app) return;

  const { todos, filter } = state;
  const visible = filterTodos(todos, filter);
  const active = countActive(todos);
  const hasCompleted = todos.some((t) => t.completed);

  const newTodoInput = el('input', {
    type: 'text',
    id: 'new-todo',
    placeholder: 'What needs to be done?',
    'aria-label': 'New todo',
  });

  newTodoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && newTodoInput.value.trim()) {
      handleAdd(newTodoInput.value.trim());
      newTodoInput.value = '';
    }
  });

  const header = el('header', { className: 'todo-header' },
    el('h1', {}, 'todos'),
    newTodoInput,
  );

  const list = el('ul', { className: 'todo-list', role: 'list' });
  visible.forEach((todo) => list.append(TodoItem(todo)));

  const filterBtns = ['all', 'active', 'completed'].map((f) =>
    el('button', {
      className: `filter-btn${filter === f ? ' active' : ''}`,
      onClick: () => handleSetFilter(f),
      'aria-pressed': filter === f ? 'true' : 'false',
    }, f[0].toUpperCase() + f.slice(1))
  );

  const footerChildren = [
    el('span', { className: 'todo-count' }, `${active} item${active !== 1 ? 's' : ''} left`),
    el('nav', { className: 'filters', 'aria-label': 'Filter todos' }, ...filterBtns),
  ];

  if (hasCompleted) {
    footerChildren.push(
      el('button', { className: 'clear-completed', onClick: handleClearCompleted }, 'Clear completed')
    );
  }

  const footer = el('footer', { className: 'todo-footer' }, ...footerChildren);

  app.innerHTML = '';
  app.append(header);
  if (todos.length > 0) app.append(list, footer);

  if (firstRender) {
    newTodoInput.focus();
    firstRender = false;
  }
};

render();
