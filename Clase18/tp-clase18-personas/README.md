# TP Clase 17 - CRUD de Personas con Flask

API REST en Python + Flask para gestionar Personas (DNI y nombre), aplicando la arquitectura en capas vista en clase: **modelo**, **repositorio** y **servicio**, más la API como capa de entrada.

Alcance: **GET** (todos y uno), **POST**, **PUT** y **DELETE**. No incluye capa de presentación.

> **Segunda entrega:** se agregaron PUT y DELETE sin modificar los GET ni el POST existentes.

## Estructura del proyecto

```mermaid
flowchart TD
    Cliente["Thunder Client / Postman"] -->|HTTP| API["api.py<br/>Endpoints Flask"]
    API --> Servicio["services/persona_service.py<br/>Reglas: DNI no repetido / persona existente"]
    API --> Modelo["models/persona.py<br/>Regla: formato del nombre"]
    Servicio --> Repo["repositories/persona_repository.py<br/>Lectura/escritura"]
    Servicio --> Modelo
    Repo --> Datos[("data/personas.json")]
```

```
tp-clase17-personas/
├── api.py                         # Endpoints Flask (app factory, sin globales)
├── models/
│   ├── __init__.py
│   └── persona.py                 # Clase Persona + validaciones propias del objeto
├── repositories/
│   ├── __init__.py
│   └── persona_repository.py      # Persistencia en archivo JSON (guardar, buscar, actualizar, eliminar)
├── services/
│   ├── __init__.py
│   └── persona_service.py         # Reglas que necesitan el repositorio
├── data/
│   └── personas.json              # "Base de datos"
├── requirements.txt
└── README.md
```

## Reglas de negocio y dónde viven

| Regla | Capa | Por qué |
|---|---|---|
| El nombre empieza con mayúscula, el resto en minúscula, solo letras, máximo 30 caracteres | Modelo (`Persona`) | Depende solo del propio objeto |
| El DNI es un entero positivo | Modelo (`Persona`) | Depende solo del propio objeto |
| El DNI no se puede repetir | Servicio (`PersonaService`) | Necesita consultar el repositorio, y el modelo nunca accede al repositorio |
| Solo se puede modificar o eliminar una persona existente | Servicio (`PersonaService`) | Necesita consultar el repositorio |
| El DNI no se puede modificar (identifica a la persona) | API (`PUT`) | El DNI llega en la URL; si viene en el body debe coincidir |

## Cómo trabajo en este proyecto

- **Sin variables globales**: la app se crea con `create_app()` y cada endpoint instancia su propio `PersonaService`.
- Como el repositorio se crea en cada request, **persiste en `data/personas.json`** en lugar de en memoria; así los datos (y la validación de DNI duplicado) se mantienen entre requests.
- Los errores del modelo devuelven **400 Bad Request**, el DNI duplicado devuelve **409 Conflict** y una persona inexistente devuelve **404 Not Found**.

## Instalación y ejecución

```bash
pip install -r requirements.txt
python api.py
```

La API queda en `http://127.0.0.1:5000`.

## Endpoints

| Método | URL | Descripción | Respuestas |
|---|---|---|---|
| GET | `/personas` | Lista todas las personas | 200 |
| GET | `/personas/<dni>` | Devuelve una persona por DNI | 200, 404 |
| POST | `/personas` | Agrega una persona | 201, 400, 409 |
| PUT | `/personas/<dni>` | Modifica el nombre de una persona | 200, 400, 404 |
| DELETE | `/personas/<dni>` | Elimina una persona | 200, 404 |

## Pruebas con Thunder Client

**POST** `http://127.0.0.1:5000/personas` con body JSON:

```json
{
  "dni": 30123456,
  "nombre": "Juan"
}
```

Casos para probar:

| Body | Resultado esperado |
|---|---|
| `{"dni": 30123456, "nombre": "Juan"}` | 201 Created |
| Repetir el mismo DNI | 409 – Ya existe una persona con ese DNI |
| `{"dni": 1, "nombre": "juan"}` | 400 – Debe comenzar con mayúscula |
| `{"dni": 2, "nombre": "JUAN"}` | 400 – El resto debe ir en minúscula |
| Nombre de más de 30 letras | 400 – Más de 30 caracteres |
| `{"nombre": "Ana"}` | 400 – Falta el DNI |

Luego **GET** `http://127.0.0.1:5000/personas` debería mostrar la persona agregada, y **GET** `http://127.0.0.1:5000/personas/30123456` devuelve solo esa persona.

### PUT

**PUT** `http://127.0.0.1:5000/personas/30123456` con body JSON (mismos parámetros que el POST; el `dni` es opcional y, si se envía, debe coincidir con el de la URL):

```json
{
  "dni": 30123456,
  "nombre": "Juancito"
}
```

| Caso | Resultado esperado |
|---|---|
| `{"nombre": "Juancito"}` sobre un DNI existente | 200 – Persona modificada |
| `{"dni": 99, "nombre": "Juancito"}` (DNI distinto al de la URL) | 400 – El DNI no se puede modificar |
| `{"nombre": "juancito"}` | 400 – Debe comenzar con mayúscula |
| `{}` | 400 – Falta el nombre |
| DNI inexistente en la URL | 404 – No existe una persona con ese DNI |

### DELETE

**DELETE** `http://127.0.0.1:5000/personas/30123456` (sin body)

| Caso | Resultado esperado |
|---|---|
| DNI existente | 200 – Devuelve la persona eliminada |
| DNI inexistente (o ya eliminado) | 404 – No existe una persona con ese DNI |

Después de un DELETE, el GET de ese DNI devuelve 404 y el DNI puede volver a usarse en un POST.
