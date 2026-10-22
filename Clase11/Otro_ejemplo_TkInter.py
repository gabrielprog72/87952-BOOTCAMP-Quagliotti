import tkinter as tk

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Hola Tkinter")
ventana.geometry("640x480")

# Crear el Label
etiqueta = tk.Label(
    ventana,
    text="Hola esta es una Ventana 640 x 480 con un Boton Salir",
    font=("Arial", 18),
    bg="#3498db",
    fg="white"
)
etiqueta.pack(pady=30)

"""
# Función para cerrar la ventana y salir del programa
def salir():
    ventana.destroy()
"""

# Crear el Botón Salir
boton_salir = tk.Button(
    ventana,
    text="Salir",
    font=("Arial", 14),
    bg="#3498db",
    fg="white",
    command=ventana.destroy
)
boton_salir.pack(pady=20)

# Iniciar el bucle principal
ventana.mainloop()