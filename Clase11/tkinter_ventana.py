import tkinter as tk

def salir(ventana):
    """
    Función pura: recibe una ventana y devuelve su método destroy.
    No ejecuta ninguna acción, solo retorna la función.
    """
    return ventana.destroy

def main():
    # Crear ventana principal
    ventana = tk.Tk()
    ventana.title("Hola Tkinter")
    ventana.geometry("640x480")

    # Label
    etiqueta = tk.Label(ventana, text="Hola Tkinter", font=("Arial", 16))
    etiqueta.pack(pady=20)

    # Botón Salir
    # El lambda es el encargado de ejecutar el efecto secundario:
    # obtiene el método destroy (función pura salir) y lo invoca.
    boton_salir = tk.Button(
        ventana,
        text="Salir",
        command=lambda: salir(ventana)(),
        font=("Arial", 12)
    )
    boton_salir.pack(pady=10)

    # Bucle principal
    ventana.mainloop()

if __name__ == "__main__":
    main()