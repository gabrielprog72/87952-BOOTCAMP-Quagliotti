from models.persona import Persona
from repositories.persona_repository import PersonaRepository


class DniDuplicadoError(ValueError):
    """Se lanza cuando se intenta agregar una persona con un DNI ya registrado."""


class PersonaService:
    def __init__(self, repo: PersonaRepository | None = None):
        self.repo = repo if repo is not None else PersonaRepository()

    def obtener_personas(self) -> list[Persona]:
        return self.repo.obtener_todas()

    def obtener_persona_por_dni(self, dni: int) -> Persona | None:
        return self.repo.obtener_por_dni(dni)

    def agregar_persona(self, persona: Persona) -> None:
        # Regla de negocio que necesita consultar el repositorio:
        # por eso vive en la capa de servicios y no en el modelo.
        if self.repo.obtener_por_dni(persona.dni) is not None:
            raise DniDuplicadoError(f"Ya existe una persona con el DNI {persona.dni}.")

        self.repo.guardar(persona)
