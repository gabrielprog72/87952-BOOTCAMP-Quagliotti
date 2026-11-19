# Pendientes

Lista de tareas con frontend, API REST y persistencia en archivo. No depende de Base44 ni de ningún servicio externo: todo corre en tu máquina.

## Requisitos

- Node.js 18 o superior

## Cómo ejecutarlo

```bash
npm install
npm start
```

Abrí http://localhost:3000

Para desarrollo con reinicio automático:

```bash
npm run dev
```

## Estructura

```
server.js          Servidor Express + API REST + persistencia
public/index.html  Interfaz
public/app.js      Lógica del cliente (fetch a la API)
public/styles.css  Estilos
data/todos.json    Datos (se crea solo al guardar la primera tarea)
```

## API REST

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | /api/todos | Lista todas las tareas |
| POST | /api/todos | Crea una tarea: title y tag |
| PATCH | /api/todos/:id | Actualiza title, tag o completed |
| DELETE | /api/todos/:id | Elimina una tarea |
| DELETE | /api/todos?completed=true | Elimina todas las completadas |
| GET | /api/health | Estado del servidor |

Etiquetas válidas: general, trabajo, personal, estudio.

## Datos

Las tareas se guardan en data/todos.json, así que sobreviven a reinicios del servidor. Para empezar de cero, borrá ese archivo.

## Puerto

Por defecto usa el 3000. Para cambiarlo:

```bash
PORT=4000 npm start
```
