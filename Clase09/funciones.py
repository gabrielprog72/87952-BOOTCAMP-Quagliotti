def saludo(name):
    return (f"Hola, {name}! Esta es una función en Python.") 

#input_name = input("Por favor, ingresa tu nombre: ")
#print(saludo(input_name))

def duplicar_lista(lista):
    return [elemento * 2 for elemento in lista]

#print(duplicar_lista(["a", "b", "c", "e", "f"]))

def num_mayor(lista):
  if not lista:
    return None

  mayor = lista[0]
 
  for num in lista:
    if num > mayor:
       mayor = num
 
  return mayor