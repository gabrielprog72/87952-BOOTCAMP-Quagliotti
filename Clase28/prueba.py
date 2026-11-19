def promedio(numeros: list[int | float]) -> float:
    """Calcula el promedio de una lista de números.

    Args:
        numeros: Lista de enteros o flotantes.

    Returns:
        El promedio, o 0.0 si la lista está vacía.

    Raises:
        TypeError: Si numeros no es una lista de enteros o flotantes.
    """
    if not isinstance(numeros, list):
        raise TypeError("numeros debe ser una lista.")

    if any(
        isinstance(numero, bool) or not isinstance(numero, (int, float))
        for numero in numeros
    ):
        raise TypeError("Todos los elementos deben ser enteros o flotantes.")

    if not numeros:
        return 0.0

    return sum(numeros) / len(numeros)


def main() -> None:
    """Ejecuta el ejemplo de uso."""
    print(promedio([1, 2, 3, 4, 5]))


if __name__ == "__main__":
    main()
