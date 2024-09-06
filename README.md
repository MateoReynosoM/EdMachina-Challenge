Para Comenzar el proyecto es necesario tener docker instalado, y la base de datos creada, con los parametros cargados en el archivo .env que se encuentra en /api, para mas instrucciones acceder a /api/README.md
-Asegurarse de borrar 'localhost' de el archivo .env en la llave DB_HOST
-Teniendo la base de datos creada y los parametros cargados ejecturar el siguiente comando:

    docker-compose build

-Una vez terminada la instalacion y creacion de los contenedores ejecutar el comando:

    docker-compose up

-Con esto ya deberia levantarse la aplicacion, con el frontend en el puerto:
    http://localhost:3000/

-Y la API del backend en el puerto:
    http://0.0.0.0:8000/docs

