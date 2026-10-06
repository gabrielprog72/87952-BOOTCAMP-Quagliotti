import json
from pathlib import Path

from models.persona import Persona


class PersonaRepository:
    """Persiste las personas en un archivo JSON.

    Como no usamos variables globales, el servicio y el repositorio se crean
    en cada request. Guardar en archivo (y no en memoria) hace que los datos
    se conserven entre requests.
    """

    def __init__(self, ruta_archivo: str | None = None):
        if ruta_archivo is None:
            ruta_archivo = Path(__file__).resolve().parent.parent / "data" / "personas.json"
        self.ruta_archivo = Path(ruta_archivo)

    # ---------- Acceso al archivo ----------
    def _leer(self) -> list[dict]:
        if not self.ruta_archivo.exists():
            return []
        with self.ruta_archivo.open("r", encoding="utf-8") as archivo:
            contenido = archivo.read().strip()
            return json.loads(contenido) if contenido else []

    def _escribir(self, registros: list[dict]) -> None:
        self.ruta_archivo.parent.mkdir(parents=True, exist_ok=True)
        with self.ruta_archivo.open("w", encoding="utf-8") as archivo:
            json.dump(registros, archivo, ensure_ascii=False, indent=2)

    # ---------- Operaciones ----------
    def obtener_todas(self) -> list[Persona]:
        return [Persona.from_dict(registro) for registro in self._leer()]

    def obtener_por_dni(self, dni: int) -> Persona | None:
        for registro in self._leer():
            if registro["dni"] == dni:
                return Persona.from_dict(registro)
        return None

    def guardar(self, persona: Persona) -> None:
        registros = self._leer()
        registros.append(persona.to_dict())
        self._escribir(registros)
