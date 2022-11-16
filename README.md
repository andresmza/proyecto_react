# FE-Condes-Interno
Frontend React sistema Condes para uso del equipo desarrollador

## Levantar ambiente en desarrollo
Levantar aplicación. Nos ubicamos en la raíz del proyecto "\".
```sh
yarn
yarn dev
```
Levantar Json Server para fake REST API con requets mockeados. Nos ubicamos dentro del proyecto en la carpeta "\node_json_server\".
```sh
yarn
yarn serve
```
Con este mock, loguearse con admin/admin para caso exitoso y admin1/admin para caso fallido.

## Armar build
Armar build para ambiente de dev.
```sh
yarn build:dev
```
Armar build para ambiente de test.
```sh
yarn build:test
```
Armar build para ambiente de prod.
```sh
yarn build:prod
```
