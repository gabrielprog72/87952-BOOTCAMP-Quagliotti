const TAG_STYLES = {
  general: { label: "General", color: "#6D28D9", bg: "#F5F3FF" },
  trabajo: { label: "Trabajo", color: "#1D4ED8", bg: "#EFF6FF" },
  personal: { label: "Personal", color: "#047857", bg: "#ECFDF5" },
  estudio: { label: "Estudio", color: "#B45309", bg: "#FFFBEB" },
};

const state = { todos: [], filter: "all", busy: false };

const els = {
  form: document.getElementById("composer"),
  input: document.getElementById("title-input"),
  tag: document.getElementById("tag-select"),
  add: document.getElementById("add-button"),
  list: document.getElementById("list"),
  empty: document.getElementById("empty"),
  filters: Array.from(document.querySelectorAll(".filter")),
  pending: document.getElementById("pending-label"),
  clear: document.getElementById("clear-button"),
  status: document.getElementById("status-pill"),
  toast: document.getElementById("toast"),
};

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { els.toast.hidden = true; }, 3200);
}

async function request(path, options) {
  const config = Object.assign({ headers: { "Content-Type": "application/json" } }, options || {});
  const response = await fetch(path, config);
  if (!response.ok) {
    let message = "No se pudo completar la operación.";
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch (error) {
      /* respuesta sin cuerpo */
    }
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return "hace " + Math.floor(diff / 60) + " min";
  if (diff < 86400) return "hace " + Math.floor(diff / 3600) + " h";
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function visibleTodos() {
  if (state.filter === "completed") return state.todos.filter(function (todo) { return todo.completed; });
  if (state.filter === "pending") return state.todos.filter(function (todo) { return !todo.completed; });
  return state.todos;
}

function emptyMessage() {
  if (state.filter === "completed") return "Todavía no completaste ninguna tarea.";
  if (state.filter === "pending") return "No te quedan tareas pendientes.";
  return "Tu lista está vacía. Agregá la primera tarea.";
}

function buildRow(todo) {
  const style = TAG_STYLES[todo.tag] || TAG_STYLES.general;

  const row = document.createElement("li");
  row.className = "row" + (todo.completed ? " is-done" : "");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "check";
  check.checked = Boolean(todo.completed);
  check.setAttribute("aria-label", todo.completed ? "Marcar como pendiente" : "Marcar como completada");
  check.addEventListener("change", function () { toggle(todo, check.checked); });

  const body = document.createElement("div");
  body.className = "row-body";

  const title = document.createElement("div");
  title.className = "row-title";
  title.textContent = todo.title;

  const meta = document.createElement("div");
  meta.className = "row-meta";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = style.label;
  tag.style.color = style.color;
  tag.style.backgroundColor = style.bg;

  const when = document.createElement("span");
  when.className = "when";
  when.textContent = formatWhen(todo.createdAt);

  meta.append(tag, when);
  body.append(title, meta);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete";
  remove.title = "Eliminar tarea";
  remove.setAttribute("aria-label", "Eliminar tarea");
  remove.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>';
  remove.addEventListener("click", function () { removeTodo(todo); });

  row.append(check, body, remove);
  return row;
}

function render() {
  const counts = {
    all: state.todos.length,
    pending: state.todos.filter(function (todo) { return !todo.completed; }).length,
    completed: state.todos.filter(function (todo) { return todo.completed; }).length,
  };

  els.filters.forEach(function (button) {
    const key = button.dataset.filter;
    button.classList.toggle("is-active", key === state.filter);
    button.querySelector(".count").textContent = counts[key];
  });

  els.pending.textContent = counts.pending === 1 ? "1 tarea pendiente" : counts.pending + " tareas pendientes";
  els.clear.hidden = counts.completed === 0;
  els.add.disabled = state.busy;

  const items = visibleTodos();
  els.list.replaceChildren.apply(els.list, items.map(buildRow));
  els.empty.hidden = items.length > 0;
  els.empty.textContent = emptyMessage();
}

async function load() {
  try {
    state.todos = await request("/api/todos");
    els.status.textContent = "Conectado";
    els.status.className = "pill is-online";
  } catch (error) {
    els.status.textContent = "Sin conexión";
    els.status.className = "pill is-offline";
    showToast(error.message);
  }
  render();
}

async function create(title) {
  state.busy = true;
  render();
  try {
    const todo = await request("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: title, tag: els.tag.value }),
    });
    state.todos = [todo].concat(state.todos);
    els.input.value = "";
    els.status.textContent = "Conectado";
    els.status.className = "pill is-online";
  } catch (error) {
    showToast(error.message);
  } finally {
    state.busy = false;
    render();
    els.input.focus();
  }
}

async function toggle(todo, completed) {
  try {
    const updated = await request("/api/todos/" + encodeURIComponent(todo.id), {
      method: "PATCH",
      body: JSON.stringify({ completed: completed }),
    });
    state.todos = state.todos.map(function (item) { return item.id === updated.id ? updated : item; });
  } catch (error) {
    showToast(error.message);
  }
  render();
}

async function removeTodo(todo) {
  try {
    await request("/api/todos/" + encodeURIComponent(todo.id), { method: "DELETE" });
    state.todos = state.todos.filter(function (item) { return item.id !== todo.id; });
  } catch (error) {
    showToast(error.message);
  }
  render();
}

els.form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = els.input.value.trim();
  if (!title) {
    showToast("Escribí el título de la tarea.");
    els.input.focus();
    return;
  }
  create(title);
});

els.filters.forEach(function (button) {
  button.addEventListener("click", function () {
    state.filter = button.dataset.filter;
    render();
  });
});

els.clear.addEventListener("click", async function () {
  try {
    await request("/api/todos?completed=true", { method: "DELETE" });
    state.todos = state.todos.filter(function (todo) { return !todo.completed; });
  } catch (error) {
    showToast(error.message);
  }
  render();
});

load();
