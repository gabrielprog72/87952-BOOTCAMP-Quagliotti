Muy importante: hay que usar json-server 0.17.4
```
npm install json-server@0.17.4
```

```
npx json-server@0.17.4 db.json
```

Si corremos solo npx json-server, se instala la versión 1.0 beta. Esa versión ignora el ID que le mandás, le asigna uno aleatorio (como "yGxRNUsM65Y") y convierte todos los IDs a texto. Lo comprobé en la prueba: con esa versión es imposible elegir el ID desde ningún cliente. Con la 0.17.4 funciona sin inconvenientes.