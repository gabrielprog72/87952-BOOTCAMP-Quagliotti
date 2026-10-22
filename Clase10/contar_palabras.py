from collections import Counter
import re
from typing import Dict

def contar_palabras(texto: str, 
                    ignorar_mayusculas: bool = True,
                    ignorar_puntuacion: bool = True,
                    palabras_omitidas: set[str] = None) -> Dict[str, int]:
    """
    Cuenta la cantidad de veces que aparece cada palabra en un texto.
    
    Args:
        texto: Texto del cual se quieren contar las palabras.
        ignorar_mayusculas: Si True, convierte todo a minúsculas.
        ignorar_puntuacion: Si True, elimina signos de puntuación.
        palabras_omitidas: Conjunto de palabras a ignorar (stopwords).
    
    Returns:
        Un diccionario donde cada clave es una palabra y su valor
        representa la cantidad de apariciones.
    
    Raises:
        TypeError: Si `texto` no es una cadena de texto.
        ValueError: Si `texto` está vacío o es solo espacios.
    """
    # Validación mejorada
    if not isinstance(texto, str):
        raise TypeError("El parámetro 'texto' debe ser un string.")
    
    texto_limpio = texto.strip()
    if not texto_limpio:
        raise ValueError("El texto no puede estar vacío o ser solo espacios.")
    
    # Preprocesamiento del texto
    if ignorar_mayusculas:
        texto_limpio = texto_limpio.lower()
    
    if ignorar_puntuacion:
        # Elimina signos de puntuación y caracteres especiales
        texto_limpio = re.sub(r'[^\w\s]', ' ', texto_limpio)
        # Elimina números si se desea (opcional)
        # texto_limpio = re.sub(r'\d+', '', texto_limpio)
    
    # Dividir en palabras y filtrar vacías
    palabras = [p for p in texto_limpio.split() if p]
    
    if not palabras:
        return {}
    
    # Filtrar palabras omitidas si se proporcionan
    if palabras_omitidas:
        palabras = [p for p in palabras if p not in palabras_omitidas]
    
    # Usar Counter para mayor eficiencia
    return dict(Counter(palabras))


# Versión más eficiente para textos muy grandes (usando generadores)
def contar_palabras_streaming(texto: str, 
                             ignorar_mayusculas: bool = True,
                             palabras_omitidas: set[str] = None) -> Dict[str, int]:
    """
    Versión optimizada para textos grandes usando procesamiento en streaming.
    """
    if not isinstance(texto, str):
        raise TypeError("El parámetro 'texto' debe ser un string.")
    
    texto_limpio = texto.strip()
    if not texto_limpio:
        raise ValueError("El texto no puede estar vacío o ser solo espacios.")
    
    resultado = {}
    
    # Procesar palabra por palabra sin crear lista intermedia
    for palabra in texto_limpio.split():
        if ignorar_mayusculas:
            palabra = palabra.lower()
        
        # Limpiar puntuación simple sin regex (más rápido)
        palabra = palabra.strip('.,!?;:()"\'')
        
        if palabra and (not palabras_omitidas or palabra not in palabras_omitidas):
            resultado[palabra] = resultado.get(palabra, 0) + 1
    
    return resultado


# Ejemplo de uso
if __name__ == "__main__":
    texto_ejemplo = "Hola mundo! Hola a todos. Esto es una prueba, una prueba de conteo."
    
    # Uso básico
    print(contar_palabras(texto_ejemplo))
    
    # Con opciones
    print(contar_palabras(
        texto_ejemplo,
        ignorar_mayusculas=True,
        ignorar_puntuacion=True,
        palabras_omitidas={'hola', 'es', 'una', 'de'}  # stopwords
    ))