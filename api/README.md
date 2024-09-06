Para iniciar el backend primero debemos crear una base de datos, esta se puede crear siguiendo los pasos:
-Tener instalado PostgreSQL en tu equipo, de no tenerlo seguir este tutorial:
    https://www.postgresql.org/download/
-Una vez instalado, debemos abrir la terminal SQL Shell que viene incluido con PostgreSQL
-En la terminal debe presionar enter hasta que le pida su nombre de usuario y contrasena
-Una vez entramos a nuestro usuario ejecutar el comando:

    CREATE DATABASE nombre_de_la_base_de_datos ;

-Con esto vamos a haber creado la base de datos
-Ahora debemos anadir al archivo .env nuestos datos:

    DB_NAME=nombre_de_la_base_de_datos
    DB_PORT=5432 (recomendado)
    DB_PG_USER=postgres (de no haber cambiado el nombre usar postgres)
    DB_PG_PASSWORD=1234 (password de postgres)

Para empezar el testing, tambien debemos crear una base de datos de prueba. Seguir los mismos pasos anteriores para crear otra base de datos:
-Una vez creada, incluir en el archivo .env lo siguiente:

    DB_TEST_NAME=nombre_de_la_base_de_datos_de_prueba

-Con la base de datos de prueba ya creada, ya podemos realizar el testing


Iniciar backend localmente:
-Abrir la terminal y pararse sobre el directorio api
-Ejecutar el comando, dependiendo de que python tengas instalado:

    python -m venv venv
        o
    python3 -m venv venv

-Ejecutar el comando, para activar el entorno virtual:

    source venv/bin/activate

-Ejecutar el comando:

    pip install -r requirements.txt

Para ejecutar los archivos de testing, enviar el comando:

    pytest

Por ultimo para iniciar el proyecto ejecutar el comando:

    python -m uvicorn main:app --reload