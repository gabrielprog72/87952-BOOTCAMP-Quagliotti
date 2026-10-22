import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Cargar las variables del archivo .env
load_dotenv()

# Obtener las credenciales desde el .env
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

# Crear el cliente de Supabase
supabase: Client = create_client(url, key)

print("¡Cliente de Supabase inicializado exitosamente!")

# Ejemplo de cómo hacer una consulta rápida a una tabla (por ejemplo, llamada 'usuarios'):
# response = supabase.table("usuarios").select("*").execute()
# print(response.data)