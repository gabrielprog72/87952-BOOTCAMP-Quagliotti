const path = require("node:path");
const fs = require("node:fs");
const { randomUUID } = require("node:crypto");
const express = require("express");

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "todos.json");
const TAGS = ["general", "trabajo", "personal", "estudio"];
const MAX_TITLE = 140;

function readDb() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeDb(todos) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(todos, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GET /api/todos -> todas las tareas, las mas nuevas primero
app.get("/api/todos", (req, res) => {
  const todos = readDb().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(todos);
});

// POST /api/todos -> crear una tarea
app.post("/api/todos", (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  if (!title) return res.status(400).json({ error: "El titulo es obligatorio." });
  if (title.length > MAX_TITLE) {
    return res.status(400).json({ error: "El titulo no puede superar " + MAX_TITLE + " caracteres." });
  }

  const todo = {
    id: randomUUID(),
    title: title,
    tag: TAGS.includes(req.body?.tag) ? req.body.tag : "general",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const todos = readDb();
  todos.push(todo);
  writeDb(todos);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id -> cambiar estado, titulo o etiqueta
app.patch("/api/todos/:id", (req, res) => {
  const todos = readDb();
  const todo = todos.find((item) => item.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Tarea no encontrada." });

  if (typeof req.body?.completed === "boolean") todo.completed = req.body.completed;
  if (typeof req.body?.title === "string" && req.body.title.trim()) {
    todo.title = req.body.title.trim().slice(0, MAX_TITLE);
  }
  if (TAGS.includes(req.body?.tag)) todo.tag = req.body.tag;

  writeDb(todos);
  res.json(todo);
});

// DELETE /api/todos?completed=true -> borrar todas las completadas
app.delete("/api/todos", (req, res) => {
  if (req.query.completed !== "true") {
    return res.status(400).json({ error: "Usa ?completed=true para limpiar las completadas." });
  }
  const todos = readDb();
  const pending = todos.filter((item) => !item.completed);
  writeDb(pending);
  res.json({ removed: todos.length - pending.length });
});

// DELETE /api/todos/:id -> borrar una tarea
app.delete("/api/todos/:id", (req, res) => {
  const todos = readDb();
  const remaining = todos.filter((item) => item.id !== req.params.id);
  if (remaining.length === todos.length) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }
  writeDb(remaining);
  res.status(204).end();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", total: readDb().length });
});

app.listen(PORT, () => {
  console.log("Servidor listo en http://localhost:" + PORT);
  console.log("Datos en " + DATA_FILE);
});
