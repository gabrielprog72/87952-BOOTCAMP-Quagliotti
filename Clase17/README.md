## Trabajo Practico (Obligatorio)

* Quiero aplicando la receta y el ejemplo que vimos hagan un CRUD de una Persona que tiene DNI y nombre.
   * El documento no se puede repetir
   * El nombre comienza con mayucula y las otra otras con minuscula y no tiene mas de 30 caracteres
   * Solo los GETs y el POST
   * Probarlo con Thunder Client

 * Subir el TP en su github (El mismo que me pasaron la primer clasa)

 * Una vez subido completar la URL de github con el proyecto en el formulario quele pase el profe 

Subirlo a https://forms.cloud.microsoft/pages/responsepage.aspx?id=FPbD6dnIlUCa1IfSyafYxE4uGCthyi9EnQYg85vv3slUOVlOSTNOUUJLRTIzQ081TFJHWTVaNDNZTS4u&route=shorturl



RECETA
# Receta crear un CRUD

* Como crer un CRUD con FLASK
  * Requerimiento : Instalar flask si no esta
  * Definir la estructura del proyecto : hacer un mermaid
  * Crear la estructura del proyecto
      * Crear la carpeta models
      * Crear la carpeta repositories
      * Crear la carpeta services
      * El archivo api.py
        * Podemos tener o no (A gusto) una carpeta tambien para la presentacion / controlador
  * Describir la estructura del proyecto e informacion de como me gusta trabajar en el Readme.md
      * Es importante contar con este archivo para darle contexto a la IA y no tener que repetirlo en cada prompt
 * Creamos la clase principal en models
      * Reglas de Negocio : Aca van las validaciones que aseguran que el objeto se mantiene consistente durante todo su ciclo de vida 
 * Crearmos el repositorio
      * Persistimos el objeto ya sea en la base de datos, en archivos o en el mecanismo de persistencia que elijamos
      * Defino las operaciones que necesito para guardar, buscar y eliminar objetos del lugar donde los persistimos
      * En general esto es una base de datos
      * El modelo no accede al repositorio nunca
  * Creamos el servicio
      * Reglas de negocio: Creamos reglas que requieran el coordinar varias lllamadas al modelo y usar el repo
        * No hay legajo duplicado
  * Creo el endpoint de Flask
      * GET para todos
      * GET que recupera uno individualmente
      * POST para agregar uno nuevo
      * PUT para modificar
      * DELETE para borrar 

