# JSon-Server

* Instalarla

```
npm install -g json-server
```
```

json-server --version
```

* Vamos a crear este documento db.json

```json
{
    "personas": [
        {
            "id": 1,
            "nombre": "Juan"
        },
        {
            "id": 2,
            "nombre": "Maria"
        },
        {
            "id": 3,
            "nombre": "Pedro"
        }
    ]
}
```

* Lo ejecutamos con:

```
json-server --watch db.json
```

* Accedemos en el navegador

```
http://localhost:3000/personas
```

```
http://localhost:3000/personas/1
```

* Lo probamos con Thunder Client desde vscode
  * Probemos los get

* Pruebo el POST
  * POST http://localhost:3000/personas
  * Completar el body con un nombre

<img width="542" height="226" alt="image" src="https://github.com/user-attachments/assets/305a5570-f27d-4bb7-8d7d-5c8f4ee29251" />

# Cliente en Javascript

* Tengo instalado una extension de vscode que se llama Live Server


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script>
        async function getByUrl(){
            const url = document.getElementById('url').value;
            const response = await fetch(url);
            const data = await response.json();
            document.getElementById('resultText').value = JSON.stringify(data, null, 2);
        }
    </script>
</head>
<body>

    <input type="text" id="url" placeholder="url"> 
    <div>
        <button id="btnGet" onclick="getByUrl()">GET</button>
    </div>
    <button id="btnPost">POST</button>

    <div id="result">
        Resultado
        <div>
            <textarea id="resultText"> </textarea>
        </div>
    </div>
</body>
</html>
```

## TAREA: Completar el POST y llenar el formulario

* Quiero completen el post
  * https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=FPbD6dnIlUCa1IfSyafYxE4uGCthyi9EnQYg85vv3slUOUxNTUJXOVFVMjFZNkI5WU0xWVhYQUYyMy4u
