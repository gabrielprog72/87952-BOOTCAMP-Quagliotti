import tkinter as tk

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Saludo Personalizado")
ventana.geometry("640x480")

# Crear el Label de instrucción
etiqueta_instruccion = tk.Label(
    ventana,
    text="Escribe tu nombre y presiona el botón",
    font=("Arial", 18),
    bg="#3498db",
    fg="white"
)
etiqueta_instruccion.pack(pady=30)

# Crear el cuadro de texto para el nombre
entrada_nombre = tk.Entry(
    ventana,
    font=("Arial", 16),
    width=30
)
entrada_nombre.pack(pady=10)

# Crear el Label donde aparecerá el saludo
etiqueta_saludo = tk.Label(
    ventana,
    text="",
    font=("Arial", 20),
    fg="#2c3e50"
)
etiqueta_saludo.pack(pady=30)

# Función para generar el saludo
def saludar():
    nombre = entrada_nombre.get().strip()
    if nombre:
        etiqueta_saludo.config(text=f"¡Hola, {nombre}!")
    else:
        etiqueta_saludo.config(text="Por favor, escribe un nombre.")

# Crear el Botón Saludar
boton_saludar = tk.Button(
    ventana,
    text="Saludar",
    font=("Arial", 14),
    bg="#3498db",
    fg="white",
    command=saludar
)
boton_saludar.pack(pady=20)

# Pone el foco en el Cuadro de Texto
entrada_nombre.focus()

# Iniciar el bucle principal
ventana.mainloop()