from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_tables

from carreras.router import router_carreras
from leads.router import router_leads
from materias.router import router_materias
from personas.router import router_personas

#* Creacion de la aplicacion
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # El origen del frontend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(router_personas)
app.include_router(router_materias)
app.include_router(router_carreras)
app.include_router(router_leads)

#* Creacion de las tablas en la base de datos
create_tables()

@app.get("/")
async def hello():
    return "Hello World"