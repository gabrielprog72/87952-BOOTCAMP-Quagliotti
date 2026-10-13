class PersonaInvalidaError(ValueError):
    """Se lanza cuando los datos de una Persona no cumplen las reglas del modelo."""


class Persona:
    LARGO_MAXIMO_NOMBRE = 30

    def __init__(self, dni: int, nombre: str):
        self.dni = dni
        self.nombre = nombre

    # ---------- DNI ----------
    @property
    def dni(self) -> int:
        return self._dni

    @dni.setter
    def dni(self, valor: int) -> None:
        # bool es subclase de int en Python, por eso se excluye explícitamente
        if not isinstance(valor, int) or isinstance(valor, bool) or valor <= 0:
            raise PersonaInvalidaError("El DNI debe ser un número entero positivo.")
        self._dni = valor

    # ---------- Nombre ----------
    @property
    def nombre(self) -> str:
        return self._nombre

    @nombre.setter
    def nombre(self, valor: str) -> None:
        if not isinstance(valor, str) or valor == "":
            raise PersonaInvalidaError("El nombre es obligatorio.")

        if len(valor) > self.LARGO_MAXIMO_NOMBRE:
            raise PersonaInvalidaError(
                f"El nombre no puede tener más de {self.LARGO_MAXIMO_NOMBRE} caracteres."
            )

        if not valor.isalpha():
            raise PersonaInvalidaError("El nombre solo puede contener letras.")

        resto = valor[1:]
        if not valor[0].isupper() or (resto != "" and not resto.islower()):
            raise PersonaInvalidaError(
                "El nombre debe comenzar con mayúscula y el resto debe estar en minúscula."
            )

        self._nombre = valor

    # ---------- Conversión ----------
    def to_dict(self) -> dict:
        return {"dni": self.dni, "nombre": self.nombre}

    @classmethod
    def from_dict(cls, datos: dict) -> "Persona":
        return cls(datos["dni"], datos["nombre"])
