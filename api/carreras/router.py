from uuid import UUID
from fastapi import APIRouter, Query, status


from db import db_dependency
from carreras.schema import *
from carreras.service import *

router_carreras = APIRouter(
    tags=['Carreras'],
    prefix='/carreras' 
)

@router_carreras.get('/get', response_model=PaginatedResponse)
async def get_carrreras(
    db: db_dependency,
    nombre: str = None,
    skip: int = Query(0, ge=0),  
    limit: int = Query(10, le=100) 
):
    total_count = db.query(Carreras).count()
    carreras = search_carreras(db, nombre, skip, limit)
    if not carreras:
        raise HTTPException(status_code=404, detail="Carrera not found")
    return PaginatedResponse(total=total_count, items=carreras)

    
@router_carreras.post('/post', response_model=Carreras_base, status_code=status.HTTP_201_CREATED)
async def post_carrera(
    db: db_dependency, 
    carrera: Carreras_create
):
    return create_carrera(db, carrera)


@router_carreras.put('/update/{id}', response_model=Carreras_base) 
async def put_carrera(
    db: db_dependency, 
    id: UUID, 
    carrera: Carreras_create
):
    return update_carrera(db, id, carrera)


@router_carreras.delete('/delete/{id}', response_model=Carreras_base)
async def delete_carrera(
    db: db_dependency, 
    id: UUID
): 
    return remove_carrera(db, id)


