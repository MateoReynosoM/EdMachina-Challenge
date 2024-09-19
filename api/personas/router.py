from fastapi import APIRouter, Query, status
from uuid import UUID

from db import db_dependency
from personas.schema import *
from personas.service import *

router_personas = APIRouter(
    tags=['Personas'],
    prefix='/personas' 
)


@router_personas.get('/get', response_model=PaginatedResponse, description='pedido para obtener personas')
async def get_personas(
    db: db_dependency,
    name: str = None ,
    first_name: str = None,
    dni: int = None,
    skip: int = Query(0, ge=0),  
    limit: int = Query(30, le=100)  
):  
    total_count = db.query(Personas).count()
    personas = search_personas(db, name, first_name, dni, skip, limit)
    if not personas:
        raise HTTPException(status_code=404, detail="Persona not found")
    return PaginatedResponse(total=total_count, items=personas)
    

@router_personas.post('/post', response_model=Personas_base, status_code=status.HTTP_201_CREATED)
async def post_persona(
    db: db_dependency, 
    persona: Personas_create
):  
    return create_persona(db, persona)


@router_personas.put('/update/{id}', response_model=Personas_base) 
async def put_persona(
    db: db_dependency, 
    id: UUID,
    persona: Personas_create
):
    return update_persona(db, id, persona)


@router_personas.delete('/delete/{id}', response_model=Personas_base)
async def delete_persona(
    db: db_dependency, 
    id: UUID
): 
    return remove_persona(db, id)
